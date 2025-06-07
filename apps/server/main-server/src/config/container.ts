import Docker from 'dockerode';
import { Project } from '@repo/database/models/project.model.js';
import { config } from 'dotenv';
config();
import { CacheProvider } from '@repo/redis';
import { getEcrAuth } from './checkAuth.js';

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
  const exists = await imageExistsLocally(
    '730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:v1'
  );
  if (!exists) {
    await getEcrAuth();
    await pullImage('730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:v1');
  }

  console.log('awskeyid', process.env.AWS_ACCESS_KEY_ID);
  console.log('awssecretkey', process.env.AWS_SECRET_ACCESS_KEY);

  try {
    const container = await docker.createContainer({
      Image: '730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:v1',
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

    logStream.on('data', async (chunk) => {
      // console.log('>>>>>', chunk.toString('utf8'));

      const header = chunk.slice(0, 8);
      const type = header[0] === 1 ? 'stdout' : 'stderr';
      const content = chunk.slice(8).toString();

      const lines = content.split('\n').filter(Boolean);

      for (const line of lines) {
        const isIncluded = INCLUDE_KEYWORDS.some((k) => line.includes(k));
        const isExcluded = EXCLUDE_KEYWORDS.some((k) => line.includes(k));
        console.log('line>>>>>', line);
        const isClientExists = line.includes('CLIENT_IS_HERE');
        const isServerExists = line.includes('SERVER_IS_HERE');
        if (isClientExists) {
          projectInfo.clientExists = true;
        }

        if (isServerExists) {
          projectInfo.serverExists = true;
        }

        if (isIncluded && !isExcluded) {
          const logObject = {
            type,
            message: line,
          };
          console.log(logObject);
          await CacheProvider.publishToChannel('build_logs', {
            userId: projectInfo.userId,
            payload: logObject,
          });
        }
      }
    });

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
    if (findProject) {
      await CacheProvider.publishToChannel('build_status', {
        userId: projectInfo.userId,
        payload: true,
      });
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
      const BASE_PATH = `http://localhost:10000/start-server?image=${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3&&flag=${projectInfo.username}-${projectInfo.projectName}&&env=${projectInfo.envVariables}&&userId=${projectInfo.userId}`;
      await fetch(BASE_PATH);
    } else {
      await CacheProvider.publishToChannel('build_status', {
        userId: projectInfo.userId,
        payload: true,
      });
      await Project.create({
        name: projectInfo.projectName,
        createdBy: projectInfo.username,
        project_url: projectInfo.projectLink,
        serverDockerImage: `${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3`,
        env: projectInfo.envVariables,
        serverStatus: 'running',
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
      const BASE_PATH = `http://localhost:10000/start-server?image=${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3&&flag=${projectInfo.username}-${projectInfo.projectName}&&env=${projectInfo.envVariables}&&userId=${projectInfo.userId}`;
      await fetch(BASE_PATH);
    }
  } catch (error: any) {
    CacheProvider.publishToChannel('build_status', {
      userId: projectInfo.userId,
      payload: false,
    });
    console.log('Errorgg: ', error.message);
  }
};
