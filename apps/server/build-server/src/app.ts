import express, { NextFunction, Request, Response } from 'express';
import { globalErrorHandler, ApiError } from '@repo/utils';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import dotenv from 'dotenv';
import { MessageQueue } from '@repo/rabbitmq';
import { runBuildContainer } from './config/container.js';
import { CacheProvider } from '@repo/redis';
dotenv.config();

export const app = express();

export const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
CacheProvider.getSocketInstance(server);

(async () => {
  await MessageQueue.receiveFromQueue('project-config', async (msg: any) => {
    console.log('Received message from project-config queue:', msg.content.toString());
    await runBuildContainer(JSON.parse(msg.content.toString()));
  });
})();

app.use(cookieParser());
app.use((err: ApiError, req: Request, resp: Response, next: NextFunction) => {
  globalErrorHandler(err, resp);
});
