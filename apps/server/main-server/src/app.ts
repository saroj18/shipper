import express, { NextFunction, Request, Response } from 'express';
import { globalErrorHandler, ApiError } from '@repo/utils';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import dotenv from 'dotenv';
import { MessageQueue } from '@repo/rabbitmq';
import { runBuildContainer } from './config/container.js';
import { SocketProvider } from '@repo/socket';
dotenv.config();

export const app = express();

export const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
SocketProvider.getInstance(server);

(async () => {
  await MessageQueue.receiveFromQueue('project-config', async (msg: any) => {
    console.log('Received message:', msg.content.toString());
    console.log('awskeyid', process.env.AWS_ACCESS_KEY_ID);
    console.log('awssecretkey', process.env.AWS_SECRET_ACCESS_KEY);
    await runBuildContainer(JSON.parse(msg.content.toString()));
  });
})();

app.use(cookieParser());
app.use((err: ApiError, req: Request, resp: Response, next: NextFunction) => {
  globalErrorHandler(err, resp);
});
