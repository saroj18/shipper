import { CacheProvider } from '@repo/redis';
import { queue } from './app.js';
import { Project } from '@repo/database/models/project.model.js';
import Docker from 'dockerode';

const stopServerInsideContainer = async (containerId: string) => {
  const docker = new Docker();
  const container = docker.getContainer(containerId);
  console.log('containerInfo:', container);
  await container.stop();
  await container.remove();
};

(async () => {
  (await queue).receiveFromQueue('stop-server', async (msg: any) => {
    console.log('Received message:', msg.content.toString());
    const { containerId, containerName, name } = JSON.parse(msg.content.toString());

    try {
      await stopServerInsideContainer(containerId as string);

      await CacheProvider.deleteFromCache(containerName as string);
      await Project.updateOne(
        { name },
        {
          serverStatus: 'stopped',
        }
      );
    } catch (error) {
      console.error('Error stopping container:', error);
    }
  });
})();
