import { CacheProvider } from '@repo/redis';
import { Project } from '@repo/database/models/project.model.js';
import Docker from 'dockerode';

import {
  ECRClient,
  DeleteRepositoryCommand,
  DeleteRepositoryCommandInput,
} from '@aws-sdk/client-ecr';
import { MessageQueue } from '@repo/rabbitmq';
import { deleteS3Folder } from './folder.delete.js';

const client = new ECRClient({ region: process.env.AWS_REGION });

const stopServerInsideContainer = async (containerId: string) => {
  const docker = new Docker();
  const container = docker.getContainer(containerId);
  console.log('containerInfo:', container);
  await container.stop();
  await container.remove();
};

export const runQueueJob = async () => {
  await MessageQueue.receiveFromQueue('stop-server', async (msg: any) => {
    try {
      console.log('Received message:', msg.content.toString());
      const { containerId, containerName, name } = JSON.parse(msg.content.toString());

      await stopServerInsideContainer(containerId as string);

      await CacheProvider.deleteFromCache(containerName as string);
      await Project.deleteOne({ name });
      console.log(`Container ${containerName} stopped successfully`);
    } catch (error) {
      console.error('Error stopping container:', error);
    }
  });

  await MessageQueue.receiveFromQueue('delete-client-from-s3', async (msg: any) => {
    try {
      console.log('Received message for S3 deletion:', msg.content.toString());
      const { key } = JSON.parse(msg.content.toString());
      const bucketParams = { Bucket: process.env.S3_CLIENT_BUCKET_NAME, Key: key };

      await deleteS3Folder(bucketParams.Bucket as string, bucketParams.Key);
    } catch (error) {
      console.error('Error deleting client from S3:', error);
    }
  });
  await MessageQueue.receiveFromQueue('delete-server-image-from-ecr', async (msg: any) => {
    try {
      console.log('Received message for S3 deletion:', msg.content.toString());
      const { repo_name } = JSON.parse(msg.content.toString());
      const input: DeleteRepositoryCommandInput = {
        repositoryName: repo_name,
        force: true,
      };
      await client.send(new DeleteRepositoryCommand(input));
    } catch (error) {
      console.error('Error deleting client from S3:', error);
    }
  });
};
