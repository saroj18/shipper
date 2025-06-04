import express from 'express';
import { runServerInsideContainer, stopServerInsideContainer } from './container.js';
import { generateEnvVariables } from './utils/generateEnvVariables.js';
import { Project } from '@repo/database/models/project.model.js';
import http from 'http';
import { CacheProvider } from '@repo/redis';
import cors from 'cors';

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
    const { image, flag, userId } = req.query;
    const project = await Project.findOne({ serverDockerImage: image });

    if (!project) {
      throw new Error('Project not found');
    }

    const envVariables = generateEnvVariables(project.env as { key: string; value: string }[]);

    if (!image) {
      throw new Error('flag is required');
    }
    const containerInfo = await runServerInsideContainer(
      image as string,
      flag as string,
      envVariables,
      userId as string
    );
    await Project.updateOne(
      { serverDockerImage: image },
      { serverStatus: 'running' }
    );

    resp.json({ message: 'Now your server is live please do refresh again' });
  } catch (error: any) {
    resp.status(400).send({ message: error.message });
  }
});

app.get('/stop-server', async (req, resp) => {
  try {
    const { containerName, name } = req.query;

    const { containerId } = JSON.parse(
      await CacheProvider.getDataFromCache(containerName as string)
    );
    console.log('containerId:', name);

    if (!containerId) {
      throw new Error('containerid is required');
    }

    await stopServerInsideContainer(containerId as string);
    await CacheProvider.deleteFromCache(containerName as string);
    await Project.updateOne(
      { name },
      {
        serverStatus: 'stopped',
      }
    );

    resp.status(200).send({
      message: 'Container stopped and removed successfully',
      containerId: containerId,
      containerPort: 3000,
    });
  } catch (error: any) {
    resp.status(400).send({ message: error.message });
  }
});

app.get('/', (req, resp) => {
  resp.status(200).send({
    message: 'Container Server is running',
  });
});
