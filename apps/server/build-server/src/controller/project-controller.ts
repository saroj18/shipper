import { ApiError, ApiResponse, asyncHandler } from '@repo/utils';
import { queue } from '../app.js';
import { User } from '@repo/database/models/user.model.js';
import { Project } from '@repo/database/models/project.model.js';
import { CacheProvider } from '@repo/redis';

export const projectConfigHandler = asyncHandler(async (req, resp) => {
  const { projectLink } = req.body;

  const userId = req.user as string;

  const user = await User.findByPk(userId);

  const repoUrl = projectLink.split('//');
  const finalRepoUrl = repoUrl[0] + '//' + user?.github_token + '@' + repoUrl[1];

  (await queue).pushOnQueue(
    'project-config',
    JSON.stringify({
      ...req.body,
      projectLink: finalRepoUrl,
      username: user?.username,
      userId,
    })
  );

  resp.status(200).json(new ApiResponse('Project Config Created', 200, req.body));
});

export const getProjectInfo = asyncHandler(async (req, resp) => {
  const { payload } = req.query;

  const project = await Project.findOne({
    project_url: { $regex: payload, $options: 'i' },
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
  const containerName = `${payload[0]}-${payload[1]}-server`

  const cacheData = await CacheProvider.getDataFromCache(containerName as string);
  if (!cacheData) {
    await Project.deleteOne({ name: payload[1], createdBy: payload[0] });
    resp.status(200).json(new ApiResponse('Project deleted successfully', 200, null));
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

  (await queue).pushOnQueue(
    'stop-server',
    JSON.stringify({ containerId, containerName, name: payload[1] })
  );

  resp.status(200).json(new ApiResponse('Project deleted successfully', 200, null));
});
