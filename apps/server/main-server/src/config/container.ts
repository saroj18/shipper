import Docker from 'dockerode';
import { Project } from '@repo/database/models/project.model';
import { config } from 'dotenv';
config();
import { CacheProvider } from '@repo/redis';

export const runBuildContainer = async (projectInfo: any) => {
  const docker = new Docker();
  try {
    const container = await docker.createContainer({
      Image: '730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:v1',
      Env: [
        `PROJECT_NAME=${projectInfo.projectName}`,
        `GIT_REPOSITORY__URL=${projectInfo.projectLink}`,
        `AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`,
        `AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`,
        `S3_CLIENT_BUCKET_NAME=bucket-shipper-clientsss`,
        `S3_SERVER_BUCKET_NAME=bucket-shipper-server`,
        `USER_PROJECT_IDENTITY=${projectInfo.username + '/' + projectInfo.projectName}`,
        `PROJECT_NAME=${projectInfo.projectName}`,
        `BUILD_COMMAND=${projectInfo.buildCommand}`,
        `START_COMMAND=${projectInfo.startCommand}`,
        `INSTALL_COMMAND=${projectInfo.installCommand}`,
        `OUTPUT_DIRECTORY=${projectInfo.outputDirectory}`,
        `AWS_ECR_REPOSITORY_URL=${process.env.AWS_ECR_REPOSITORY_URL}`,
        `AWS_REGION=${process.env.AWS_REGION}`,
        `AWS_ECR_AUTH_CMD=${process.env.AWS_ECR_AUTH_CMD}`,
        `IMAGE_NAME=${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}`,
        `AWS_ECR_REPOSITORY_NAME=${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}`,
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

    logStream.on('data', (chunk) => {
      console.log('>>>>>', chunk.toString('utf8'));
    });

    await container.wait();
    await container.remove();

    const findProject = await Project.findOne({
      project_url: projectInfo.projectLink,
    });
    console.log('findProject:', findProject);
    if (findProject) {
      await Project.updateMany(
        { project_url: projectInfo.projectLink },
        {
          serverDockerImage: `${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3`,
          env: projectInfo.envVariables,
          clientDomain:
            projectInfo.username.toLowerCase() +
            '-' +
            projectInfo.projectName.toLowerCase() +
            '-client',
          serverDomain:
            projectInfo.username.toLowerCase() +
            '-' +
            projectInfo.projectName.toLowerCase() +
            '-server',
        }
      );
      const containerName =
        `/${projectInfo.username}-${projectInfo.projectName}-server`.toLocaleLowerCase();
      const existingContainers = await docker.listContainers({ all: true });
      const existingContainer = existingContainers.find((container) =>
        container.Names.includes(containerName)
      );
      console.log('extc', existingContainers);
      if (existingContainer) {
        console.log('yes existing container');
        const container = docker.getContainer(existingContainer.Id);
        await container.stop();
        await container.remove();
      }
      const image = docker.getImage(
        `${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3`
      );
      await image.remove();
      console.log('delete prv iamge');
      await CacheProvider.deleteFromCache(
        projectInfo.username + '-' + projectInfo.projectName.toLowerCase() + '-' + 'server'
      );
      const BASE_PATH = `http://localhost:10000/start-server?image=${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3&&flag=${projectInfo.username}-${projectInfo.projectName}&&env=${projectInfo.envVariables}`;
      await fetch(BASE_PATH);
    } else {
      await Project.create({
        name: projectInfo.projectName,
        createdBy: projectInfo.username,
        project_url: projectInfo.projectLink,
        serverDockerImage: `${process.env.AWS_ECR_REPOSITORY_URL}/${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}:v3`,
        env: projectInfo.envVariables,
        clientDomain:
          projectInfo.username.toLowerCase() +
          '-' +
          projectInfo.projectName.toLowerCase() +
          '-client',
        serverDomain:
          projectInfo.username.toLowerCase() +
          '-' +
          projectInfo.projectName.toLowerCase() +
          '-server',
      });
    }
  } catch (error: any) {
    console.log('Error: ', error.message);
  }
};
