import { ApiError, ApiResponse, asyncHandler } from '@repo/utils';
import { queue } from '../app.js';
import { User } from '@repo/database/models/user.model.js';
import { Project } from '@repo/database/models/project.model.js';

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

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  resp.status(200).json(new ApiResponse('Project Info', 200, project));
});
