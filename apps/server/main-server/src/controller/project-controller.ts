import { ApiError, ApiResponse, asyncHandler, setGitHubStatus } from '@repo/utils';
import { User } from '@repo/database/models/user.model.js';
import { Project } from '@repo/database/models/project.model.js';
import { CacheProvider } from '@repo/redis';
import { MessageQueue } from '@repo/rabbitmq';
import { deleteWebhook } from '../delete-webhook.js';

export const projectConfigHandler = asyncHandler(async (req, resp) => {
  const { projectLink } = req.body;

  const userId = req.user as string;
  console.log('userId>>><<<<:', userId);

  const user = await User.findByPk(userId);

  const repoUrl = projectLink.split('//');
  const finalRepoUrl = repoUrl[0] + '//' + user?.github_token + '@' + repoUrl[1];

  await MessageQueue.pushOnQueue(
    'project-config',
    JSON.stringify({
      ...req.body,
      projectLink: finalRepoUrl,
      username: user?.username,
      userId,
      token: user?.github_token,
      isBackendChanges: true,
      isFrontendChanges: true,
      type: 'direct',
    })
  );

  resp.status(200).json(new ApiResponse('Project Config Created', 200, req.body));
});

export const getProjectInfo = asyncHandler(async (req, resp) => {
  const { payload } = req.query;
  console.log('payload:', payload);

  if (!payload) {
    throw new ApiError('Payload is required', 400);
  }
  const info = (payload as string).split('/');

  const project = await Project.findOne({
    $or: [
      { serverDomain: `${info[0].toLowerCase()}-${info[1].toLowerCase()}-server` },
      { clientDomain: `${info[0].toLowerCase()}-${info[1].toLowerCase()}-client` },
    ],
  });

  console.log('project:', project);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  resp.status(200).json(new ApiResponse('Project Info', 200, project));
});

export const getAllProjects = asyncHandler(async (req, resp) => {
  const userId = req.user as string;
  const user = await User.findByPk(userId);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const projects = await Project.find({ createdBy: user.username });

  resp.status(200).json(new ApiResponse('All Projects', 200, projects));
});

export const deleteProject = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  const payload = id.split('^');

  const project = await Project.findOneAndDelete({ name: payload[1], createdBy: payload[0] });

  if (!project) {
    throw new ApiError('Project not found', 404);
  }
  const containerName = `${payload[0]}-${payload[1]}-server`.toLowerCase();
  console.log('containerName:', containerName);

  const cacheData = await CacheProvider.getDataFromCache(containerName as string);
  console.log('cacheData:', cacheData);
  if (!cacheData) {
    await Project.deleteOne({ name: payload[1], createdBy: payload[0] });
    await MessageQueue.pushOnQueue(
      'delete-client-from-s3',
      JSON.stringify({ key: `${payload[0]}/${payload[1]}` })
    );
    await MessageQueue.pushOnQueue(
      'delete-server-image-from-ecr',
      JSON.stringify({ repo_name: `${payload[0].toLowerCase()}-${payload[1].toLowerCase()}` })
    );

    await deleteWebhook(payload[0], payload[1]);
    resp.status(200).json(new ApiResponse('Project deleted successfully [CNSY]', 200, null));
    return;
  }
  const info = cacheData ? JSON.parse(cacheData) : null;
  if (!info) {
    throw new ApiError('info not found', 404);
  }

  const { containerId } = info;

  if (!containerId) {
    throw new Error('containerid is required');
  }

  await MessageQueue.pushOnQueue(
    'stop-server',
    JSON.stringify({ containerId, containerName, name: payload[1] })
  );
  await MessageQueue.pushOnQueue(
    'delete-client-from-s3',
    JSON.stringify({ key: `${payload[0]}/${payload[1]}` })
  );
  await MessageQueue.pushOnQueue(
    'delete-server-image-from-ecr',
    JSON.stringify({ repo_name: `${payload[0]}-${payload[1]}` })
  );
  await deleteWebhook(payload[0], payload[1]);
  resp.status(200).json(new ApiResponse('Project deleted successfully', 200, null));
});

export const updateENV = asyncHandler(async (req, resp) => {
  const { env, payload } = req.body;
  if (!payload) {
    throw new ApiError('Payload is required', 400);
  }

  if (!env || !Array.isArray(env)) {
    throw new ApiError('Environment variables are required', 400);
  }

  const userId = req.user as string;
  const info = payload.split('/');
  await Project.updateOne(
    {
      $or: [
        { clientDomain: `${info[0]}-${info[1]}-client` },
        { serverDomain: `${info[0]}-${info[1]}-server` },
      ],
    },
    { env: env }
  );

  resp.status(200).json(new ApiResponse('Environment variables updated successfully', 200, null));
});

export const buildByWebHook = asyncHandler(async (req, resp) => {
  let { userId } = req.query;
  const { after, commits } = req.body;
  console.log('commits->:', commits);
  const isBackendChanges = commits.some((commit: any) => {
    console.log(commit.modified);
    const flag = commit.modified[0]?.split('/');
    return flag && flag.includes('server');
  });

  const isFrontendChanges = commits.some((commit: any) => {
    console.log(commit.modified);
    const flag = commit.modified[0]?.split('/');
    return flag && flag.includes('client');
  });

  console.log('isBackendChanges:', isBackendChanges);

  const project = await Project.findOne({
    creatorId: userId,
  });

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  const token = project.project_url.split('//')[1].split('@')[0];

  setGitHubStatus({
    owner: project.createdBy,
    repo: project.name,
    sha: after,
    state: 'pending',
    description: 'Deployment pending....',
    context: 'Shipper',
    githubToken: token,
  });

  await MessageQueue.pushOnQueue(
    'project-config',
    JSON.stringify({
      projectName: project.name,
      envVariables: project.env,
      projectLink: project.project_url,
      username: project.createdBy,
      userId: project.creatorId,
      token,
      sha: after,
      isBackendChanges,
      isFrontendChanges,
      type: 'webhook',
    })
  );

  resp.status(200).json(new ApiResponse('Build triggered successfully', 200, null));
});
