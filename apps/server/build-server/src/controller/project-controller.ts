import { asyncHandler } from "@repo/utils";

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
  } = req.body;


  
});
