import express from 'express';
import { runServerInsideContainer, stopServerInsideContainer } from './container.js';
import { generateEnvVariables } from './utils/generateEnvVariables.js';
import { Project } from '@repo/database/models/project.model.js';

export const app = express();

app.get('/start-server', async (req, resp) => {
  try {
    const { image, flag, env, userId } = req.query;
    const project = await Project.findOne({ serverDockerImage: image });

    if (!project) {
      throw new Error('Project not found');
    }
    console.log('env??????', project.env);

    const envVariables = generateEnvVariables(project.env as { key: string; value: string }[]);
    console.log('envVariables>>>???', envVariables);

    if (!image) {
      throw new Error('flag is required');
    }
    const containerInfo = await runServerInsideContainer(
      image as string,
      flag as string,
      envVariables
    );
    resp.json({ message: 'Now your server is live please do refresh again' });
  } catch (error: any) {
    resp.status(400).send({ message: error.message });
  }
});

app.get('/stop-server', async (req, resp) => {
  try {
    const { containerId } = req.query;

    if (!containerId) {
      throw new Error('containerName is required');
    }

    await stopServerInsideContainer(containerId as string);

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
