import express, { NextFunction, Request, Response } from "express";
import { globalErrorHandler, ApiError } from "@repo/utils";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
import { MessageQueue } from "@repo/rabbitmq";
import { runBuildContainer } from "./config/container.js";
dotenv.config();

export const app = express();

export const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
export const queue = MessageQueue.getInstance();

(async () => {
  (await queue).receiveFromQueue("project-config", async (msg: any) => {
    console.log("Received message:", msg.content.toString());
    await runBuildContainer(JSON.parse(msg.content.toString()));
  });
})();

app.use(cookieParser());
app.use((err: ApiError, req: Request, resp: Response, next: NextFunction) => {
  globalErrorHandler(err, resp);
});
