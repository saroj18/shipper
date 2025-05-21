import express from "express";
import http from "http";
import dotenv from "dotenv";
import httpProxy from "http-proxy";
import { Project } from "@repo/database/models/project.model";
dotenv.config();

export const app = express();

export const server = http.createServer(app);
const proxy = httpProxy.createProxy();

app.use(async (req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  const project = await Project.findOne({
    domain: { $regex: `^${subdomain}$`, $options: "i" },
  });

  if (!project) {
    const BASE_PATH = `https://bucket-shipper.s3.ap-south-1.amazonaws.com/error.html`;

    return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
  }

  const BASE_PATH = `https://bucket-shipper.s3.ap-south-1.amazonaws.com/${project.createdBy}/${project.name}/client`;

  return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, resp) => {
  const url = req.url;
  if (url === "/") proxyReq.path += `index.html`;
});
