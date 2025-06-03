import Docker from 'dockerode';
import { getEcrAuth } from './utils/checkAuth.js';
import { checkPort } from './utils/checkPort.js';
import { CacheProvider } from '@repo/redis';
import { envExtrator } from './utils/env.extrator.js';
import { SocketProvider } from '@repo/socket';

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

export const runServerInsideContainer = async (image: string, flag: string, env: any) => {
  const [createdBy, projectName] = flag.split('-');
  const containerName = `${createdBy}-${projectName}-server`.toLocaleLowerCase();

  try {
    const exists = await imageExistsLocally(image);
    if (!exists) {
      await getEcrAuth();
      await pullImage(image);
    }
    const existingContainers = await docker.listContainers({ all: true });
    const existingContainer = existingContainers.find((container) =>
      container.Names.includes(`/${containerName}`)
    );
    if (existingContainer && existingContainer.State === 'running') {
      console.log(
        `[Info] Container ${containerName} is already running on container-port ${existingContainer.Ports[0].PrivatePort} & host-port ${existingContainer.Ports[0].PublicPort} of ip ${existingContainer.Ports[0].IP}.`
      );
      console.log('containerId:', existingContainer.Id);
      console.log('containerName:', existingContainer.Names[0]);
      return {
        containerId: existingContainer.Id,
        containerPort: existingContainer.Ports[0].PublicPort,
        message: 'Container is already running',
        containerName: existingContainer.Names[0],
      };
    }

    if (existingContainer && existingContainer.State !== 'running') {
      const container = docker.getContainer(existingContainer.Id);

      await container.remove();
    }
    const lines = env.trim().split('\n');
    const envMap = Object.fromEntries(lines.map((line: string) => line.split('=')));
    
    const userPort = envMap.PORT;
    const port = await checkPort(Number(userPort));

    const container = await docker.createContainer({
      Image: image,
      name: containerName,
      ExposedPorts: {
        [`${userPort}/tcp`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${userPort}/tcp`]: [
            {
              HostIp: '0.0.0.0',
              HostPort: port.toString(),
            },
          ],
        },
      },
      Env: [
        `PROJECT_NAME=${projectName}`,
        `AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`,
        `AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`,
        `S3_SERVER_BUCKET_NAME=bucket-shipper-server`,
        `USER_PROJECT_IDENTITY=${createdBy}/${projectName}`,
        `BUILD_COMMAND=${process.env.BUILD_COMMAND}`,
        `START_COMMAND=${process.env.START_COMMAND}`,
        `INSTALL_COMMAND=${process.env.INSTALL_COMMAND}`,
        `OUTPUT_DIRECTORY=${process.env.OUTPUT_DIRECTORY}`,
        env,
      ],
    });

    await container.start();
    console.log(`[Info] Container started: ${containerName}`);
    CacheProvider.saveDataOnCache(
      `${containerName}`,
      JSON.stringify({
        containerId: container.id,
        container_name: containerName,
        host_port: port,
        container_port: existingContainer?.Ports[0].PrivatePort,
        ip: existingContainer?.Ports[0].IP,
        container_host_url: `http://localhost/${existingContainer?.Ports[0].PublicPort}`,
        userId: createdBy,
      })
    );

    // Stream logs
    const logStream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });

    logStream.on('data', (chunk) => {
      console.log(chunk.toString('utf8'));
    });

    return {
      containerId: container.id,
      containerPort: 3000,
      message: 'Container started successfully',
      containerName: containerName,
    };
  } catch (error: any) {
    console.error(`[Error] ${error.message}`);
  }
};

export const stopServerInsideContainer = async (containerId: string) => {
  const container = docker.getContainer(containerId);
  await container.stop();
  await container.remove();
};
