import express, { Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import httpProxy from 'http-proxy';
import { Project } from '@repo/database/models/project.model.js';
dotenv.config();
import { CacheProvider } from '@repo/redis';

export const app = express();

export const server = http.createServer(app);
const proxy = httpProxy.createProxy();

proxy.on('error', (err, req, resp) => {
  console.log('Proxy error:', err);
  resp.end('Something went wrong while proxying the request. please try again later.');
});

app.use(async (req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split('.')[0];
  const flag = subdomain.split('-').pop();
  console.log('flag', flag);

  if (flag === 'server') {
    const container_info = JSON.parse(await CacheProvider.getDataFromCache(subdomain));
    console.log('container_info', container_info);

    if (container_info) {
      return proxy.web(req, res, {
        target: `http://localhost:${container_info.host_port}`,
        changeOrigin: true,
      });
    }
    console.log('dammm.>>>>');
    const project = await Project.findOne({
      serverDomain: subdomain,
    });
    console.log('project', project);

    if (!project) {
      const BASE_PATH = `https://bucket-shipper.s3.ap-south-1.amazonaws.com/`;
      req.url = '/error.html';

      return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
    }
    const BASE_PATH = `http://localhost:10000/start-server?image=${project.serverDockerImage}&&flag=${project.createdBy}-${project.name}&&env=${project.env}&&userId=${project.creatorId}`;

    return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
  } else {
    const project = await Project.findOne({
      clientDomain: { $regex: `^${subdomain}$`, $options: 'i' },
    });
    console.log('project', project);

    if (!project) {
      console.log('error');
      const BASE_PATH = `https://bucket-shipper.s3.ap-south-1.amazonaws.com/`;
      req.url = '/error.html';

      return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
    }

    console.log('path', req.url);
    const BASE_PATH = `https://bucket-shipper.s3.ap-south-1.amazonaws.com/${project.createdBy}/${project.name}/client`;
    if (req.url !== '/' && !req.url.startsWith('/assets')) {
      req.url = '/index.html';
    }

    if (req.url == '/') {
      req.url = '/index.html';
    }

    return proxy.web(req, res, { target: BASE_PATH, changeOrigin: true });
  }
});
