import express from 'express';
import { runServerInsideContainer, stopServerInsideContainer } from './container.js';
import { generateEnvVariables } from './utils/generateEnvVariables.js';
import { Project } from '@repo/database/models/project.model.js';
import http from 'http';
import { CacheProvider } from '@repo/redis';
import cors from 'cors';
import { ApiError } from '@repo/utils';
import { removeContainer } from './utils/remove-container.js';

export const app = express();
export const server = http.createServer(app);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  })
);

app.get('/start-server', async (req, resp) => {
  try {
    let { image, flag, userId,webhook } = req.query;
    userId = (userId as string).split('/')[0];
    console.log('userId:', webhook);

    const project = await Project.findOne({
      serverDockerImage: image,
    });

    if (!project) {
      throw new ApiError('Project not found', 404);
    }

    const envVariables = generateEnvVariables(project.env as { key: string; value: string }[]);

    if (!project.serverDockerImage) {
      throw new ApiError('image is required', 400);
    }
    console.log('this is happen');
    const response = await runServerInsideContainer(
      project.serverDockerImage,
      (flag as string) || `${project.createdBy}-${project.name}`,
      envVariables,
      userId as string,
    );

    // if (response?.status == 'running') {
    //   await removeContainer(response?.containerId);
    // }

    resp.json({ message: 'Now your server is live please do refresh again' });
  } catch (error: any) {
    resp.status(400).send({ error: error.message });
  }
});

app.get('/stop-server', async (req, resp) => {
  try {
    const { containerName, image } = req.query;
    console.log('containerName:', containerName);

    if (!containerName) {
      throw new ApiError('your server is failed please re-deploy it with valid configuration', 400);
    }

    const cachedData = await CacheProvider.getDataFromCache(containerName as string);
    if (!cachedData) {
      throw new ApiError('your server is failed please re-deploy it with valid configuration', 400);
    }
    const { containerId, userId } = JSON.parse(cachedData);

    if (!containerId) {
      throw new Error('containerid is required');
    }

    await stopServerInsideContainer(containerId as string);
    await CacheProvider.deleteFromCache(containerName as string);
    const data = await Project.updateOne(
      { serverDockerImage: image },
      {
        $set: {
          serverStatus: 'stopped',
        },
      },
      { new: true }
    );
    CacheProvider.publishToChannel('server_logs', {
      userId,
      payload: `Your server is stopped successfully`,
    });

    resp.status(200).send({
      message: 'Container stopped and removed successfully',
      containerId: containerId,
      containerPort: 3000,
    });
  } catch (error: any) {
    resp.status(400).send({ error: error.message });
  }
});

app.get('/', (req, resp) => {
  resp.status(200).send({
    message: 'Container Server is running',
  });
});
