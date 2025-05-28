import express, { Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import httpProxy from 'http-proxy';
import { Project } from '@repo/database/models/project.model';
dotenv.config();
import { CacheProvider } from '@repo/redis';

export const app = express();

export const server = http.createServer(app);
const proxy = httpProxy.createProxy();

app.use(async (req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split('.')[0];
  const flag = subdomain.split('-').pop();

  proxy.on('proxyReq', (proxyReq, req, resp) => {
    const url = req.url;
    if (url === '/' && flag == 'client') proxyReq.path += `index.html`;
  });

  if (flag === 'server') {
    const container_info = JSON.parse(await CacheProvider.getDataFromCache(subdomain));

    if (container_info) {
      return proxy.web(req, res, {
        target: `http://localhost:${container_info.host_port}`,
        changeOrigin: true,
      });
    }

    const project = await Project.findOne({
      serverDomain: subdomain,
    });
    console.log('project', project);

    if (!project) {
      const BASE_PATH = `https://bucket-shipper.s3.ap-south-1.amazonaws.com/error.html`;

      return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
    }
    const BASE_PATH = `http://localhost:10000/start-server?image=${project.serverDockerImage}&&flag=${project.createdBy}-${project.name}&&env=${project.env}`;

    return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
  } else {
    const project = await Project.findOne({
      clientDomain: { $regex: `^${subdomain}$`, $options: 'i' },
    });

    if (!project) {
      const BASE_PATH = `https://bucket-shipper.s3.ap-south-1.amazonaws.com/error.html`;

      return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
    }

    const BASE_PATH = `https://bucket-shipper.s3.ap-south-1.amazonaws.com/${project.createdBy}/${project.name}/client`;

    return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
  }
});
