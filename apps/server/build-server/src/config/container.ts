import Docker from 'dockerode';
import { Project } from '@repo/database/models/project.model.js';
import { config } from 'dotenv';
config();
import { CacheProvider } from '@repo/redis';
import { getEcrAuth } from './checkAuth.js';
import { addWebhook } from './add-webhook.js';
import { setGitHubStatus } from '@repo/utils';

const INCLUDE_KEYWORDS = [
  'npm install',
  'pnpm install',
  'yarn install',
  'RUN npm',
  'RUN yarn',
  'Installing',
  'Building',
  'Compiled successfully',
  'Added',
  'Build completed',
  '[BUILD]',
  '[ERROR]',
  '[INSTALL]',
  'shipper.config',
];

const EXCLUDE_KEYWORDS = [
  'Pushed',
  'Pulling',
  'Downloading',
  'Already exists',
  'Digest:',
  'Status: Downloaded',
];
const docker = new Docker();
const imageExistsLocally = async (image: string): Promise<boolean> => {
  const images = await docker.listImages();
  return images.some((img) => {
    return img.RepoTags?.includes(image);
  });
};

const pullImage = async (image: string): Promise<void> => {
  const { username, password, serveraddress } = await getEcrAuth();

  return new Promise((resolve, reject) => {
    docker.pull(
      image,
      {
        authconfig: {
          username,
          password,
          serveraddress,
        },
      },
      (err: any, stream: any) => {
        if (err) return reject(err);

        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err: any) {
          if (err) return reject(err);
          resolve();
        }

        function onProgress(event: any) {
          if (event.status) console.log(`[Docker Pull] ${event.status}`);
        }
      }
    );
  });
};

export const runBuildContainer = async (projectInfo: any) => {
  console.log('Running build container with project info:', projectInfo);
  const exists = await imageExistsLocally(
    '730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:latest'
  );
  if (!exists) {
    await getEcrAuth();
    await pullImage('730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:latest');
  }

  try {
    const container = await docker.createContainer({
      Image: '730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:latest',
      Env: [
        `PROJECT_NAME=${projectInfo.projectName}`,
        `GIT_REPOSITORY__URL=${projectInfo.projectLink}`,
        `AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`,
        `AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`,
        `S3_CLIENT_BUCKET_NAME=bucket-shipper`,
        `S3_SERVER_BUCKET_NAME=bucket-shipper-server`,
        `USER_PROJECT_IDENTITY=${projectInfo.username + '/' + projectInfo.projectName}`,
        `PROJECT_NAME=${projectInfo.projectName}`,
        `BUILD_COMMAND=${projectInfo?.buildCommand}`,
        `START_COMMAND=${projectInfo?.startCommand}`,
        `INSTALL_COMMAND=${projectInfo?.installCommand}`,
        `OUTPUT_DIRECTORY=${projectInfo?.outputDirectory}`,
        `AWS_ECR_REPOSITORY_URL=${process.env.AWS_ECR_REPOSITORY_URL}`,
        `AWS_REGION=${process.env.AWS_REGION}`,
        `AWS_ECR_AUTH_CMD=${process.env.AWS_ECR_AUTH_CMD}`,
        `USER_SERVER_PATH=${projectInfo?.isBackendChanges}`,
        `USER_CLIENT_PATH=${projectInfo?.isFrontendChanges}`,
        `IMAGE_NAME=${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}`,
        `AWS_ECR_REPOSITORY_NAME=${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}`,
        // ...env,
      ],
      HostConfig: {
        Binds: ['/var/run/docker.sock:/var/run/docker.sock'],
      },
    });

    await container.start();

    // Stream logs from the container
    const logStream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });

    const sentLogLines = new Set();

    logStream.on('data', async (chunk) => {
      try {
        const header = chunk.slice(0, 8);
        const type = header[0] === 1 ? 'stdout' : 'stderr';
        const content = chunk.slice(8).toString('utf8');
        console.log('Log chunk received:', content);

        const lines = content.split('\n').filter(Boolean);

        for (const line of lines) {
          const logKey = `${type}-${line}`;
          if (sentLogLines.has(logKey)) continue;
          sentLogLines.add(logKey);

          if (line.includes('CLIENT_IS_HERE')) {
            projectInfo.clientExists = true;
          }

          if (line.includes('SERVER_IS_HERE')) {
            projectInfo.serverExists = true;
          }

          const isIncluded = INCLUDE_KEYWORDS.some((k) => line.includes(k));
          const isExcluded = EXCLUDE_KEYWORDS.some((k) => line.includes(k));

          if (isIncluded && !isExcluded) {
            const logObject = {
              type,
              message: line,
            };

            console.log('Publishing log:', logObject);

            await CacheProvider.publishToChannel('build_logs', {
              userId: projectInfo.userId,
              payload: logObject,
            });
          }
        }
      } catch (err) {
        console.error('Error processing log chunk:', err);
      }
    });

    const clearIntervalId = setInterval(
      () => {
        sentLogLines.clear();
      },
      5 * 60 * 1000
    );

    const clearLogs = () => {
      sentLogLines.clear();
      clearInterval(clearIntervalId);
      console.log('Log stream ended or closed. Cleared sent logs.');
    };

    logStream.on('end', clearLogs);
    logStream.on('close', clearLogs);

    const waitAMin = await container.wait();
    await container.remove();

    if (waitAMin.StatusCode !== 0) {
      await CacheProvider.publishToChannel('build_status', {
        userId: projectInfo.userId,
        payload: false,
      });
      return;
    }

    const findProject = await Project.findOne({
      project_url: projectInfo.projectLink,
    });
    if (!findProject?.webHook) {
      console.log('Adding webhook for project:', projectInfo.projectLink);
      console.log('Adding webhook for webhook:', findProject?.webHook);
    }

    if (findProject) {
      await CacheProvider.publishToChannel('build_status', {
        userId: projectInfo.userId,
        payload: true,
      });
      if (projectInfo?.type != 'webhook') {
        await Project.updateMany(
          { project_url: projectInfo.projectLink },
          {
            serverDockerImage: `${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3`,
            env: projectInfo.envVariables,
            serverStatus: 'running',
            clientDomain: projectInfo.clientExists
              ? projectInfo.username.toLowerCase() +
                '-' +
                projectInfo.projectName.toLowerCase() +
                '-client'
              : null,
            serverDomain: projectInfo.serverExists
              ? projectInfo.username.toLowerCase() +
                '-' +
                projectInfo.projectName.toLowerCase() +
                '-server'
              : null,
          }
        );
      }
      const containerName =
        `/${projectInfo.username}-${projectInfo.projectName}-server`.toLocaleLowerCase();
      const existingContainers = await docker.listContainers({ all: true });
      const existingContainer = existingContainers.find((container) =>
        container.Names.includes(containerName)
      );
      if (existingContainer) {
        await CacheProvider.deleteFromCache(
          projectInfo.username + '-' + projectInfo.projectName.toLowerCase() + '-' + 'server'
        );
        const container = docker.getContainer(existingContainer.Id);
        await container.stop();
        await container.remove();
      }
      const image = docker.getImage(
        `${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3`
      );
      await image.remove();
      const BASE_PATH = `${process.env.CONTAINER_SERVER_URL}/start-server/?image=${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3&flag=${projectInfo.username}-${projectInfo.projectName}&env=${projectInfo.envVariables}&userId=${projectInfo.userId}`;
      const resp = await fetch(BASE_PATH);
      if (resp.ok && findProject?.webHook) {
        setGitHubStatus({
          owner: projectInfo.username,
          repo: projectInfo.projectName,
          sha: projectInfo.sha,
          state: 'success',
          description: 'Deployment successful',
          context: 'Shipper',
          githubToken: projectInfo.token,
        });
      }
    } else {
      await CacheProvider.publishToChannel('build_status', {
        userId: projectInfo.userId,
        payload: true,
      });

      await addWebhook(
        projectInfo.username as string,
        projectInfo.projectLink.split('/').pop()?.replace('.git', '') as string,
        `${process.env.WEBHOOK_URL}?userId=${projectInfo.userId}`,
        projectInfo.token as string
      );

      const pro = await Project.create({
        name: projectInfo.projectName,
        createdBy: projectInfo.username,
        project_url: projectInfo.projectLink,
        serverDockerImage: `${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3`,
        env: projectInfo.envVariables,
        serverStatus: 'running',
        webHook: true,
        creatorId: projectInfo.userId,
        clientDomain: projectInfo.clientExists
          ? projectInfo.username.toLowerCase() +
            '-' +
            projectInfo.projectName.toLowerCase() +
            '-client'
          : null,
        serverDomain: projectInfo.serverExists
          ? projectInfo.username.toLowerCase() +
            '-' +
            projectInfo.projectName.toLowerCase() +
            '-server'
          : null,
      });

      console.log('Project created:', pro);
      const BASE_PATH = `${process.env.CONTAINER_SERVER_URL}/start-server?image=${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3&&flag=${projectInfo.username}-${projectInfo.projectName}&env=${projectInfo.envVariables}&userId=${projectInfo.userId}`;
      const resp = await fetch(BASE_PATH);
      console.log('Response from start-server:', resp.status, resp.statusText, resp.ok);
    }
  } catch (error: any) {
    CacheProvider.publishToChannel('build_status', {
      userId: projectInfo.userId,
      payload: false,
    });
    console.log('Errorgg: ', error.message);
    setGitHubStatus({
      owner: projectInfo.username,
      repo: projectInfo.projectName,
      sha: projectInfo.sha,
      state: 'failure',
      description: `Deployment failed: ${error.message}`,
      context: 'Shipper',
      githubToken: projectInfo.token,
    });
  }
};
