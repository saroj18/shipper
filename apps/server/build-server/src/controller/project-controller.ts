import { ApiResponse, asyncHandler } from '@repo/utils';
import { queue } from '../app.js';
import { User } from '../models/index.js';

export const projectConfigHandler = asyncHandler(async (req, resp) => {
  const {
    projectName,
    configFileLocation,
    techStack,
    buildCommand,
    startCommand,
    installCommand,
    outputDirectory,
    envVariables,
    projectLink,
  } = req.body;
  console.log('envVariables', envVariables);

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
      envVariables,
    })
  );
  resp.status(200).json(new ApiResponse('Project Config Created', 200, req.body));
});
