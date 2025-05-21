import Docker from "dockerode";
import { Project } from "@repo/database/models/project.model";

export const runBuildContainer = async (projectInfo: any) => {
  const docker = new Docker();
  try {
    const container = await docker.createContainer({
      Image: "730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:v1",
      Cmd: [""],
      Env: [
        `PROJECT_NAME=${projectInfo.projectName}`,
        `GIT_REPOSITORY__URL=${projectInfo.projectLink}`,
        `AWS_ACCESS_KEY_ID=AKIA2UC27CTOAPK4C3PJ`,
        `AWS_SECRET_ACCESS_KEY=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`,
        `S3_CLIENT_BUCKET_NAME=bucket-shipper-client`,
        `S3_SERVER_BUCKET_NAME=bucket-shipper-server`,
        `USER_PROJECT_IDENTITY=${projectInfo.username + "/" + projectInfo.projectName}`,
        `PROJECT_NAME=${projectInfo.projectName}`,
        `BUILD_COMMAND=${projectInfo.buildCommand}`,
        `START_COMMAND=${projectInfo.startCommand}`,
        `INSTALL_COMMAND=${projectInfo.installCommand}`,
        `OUTPUT_DIRECTORY=${projectInfo.outputDirectory}`,
      ],
    });

    await container.start();

    // Stream logs from the container
    const logStream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });

    logStream.on("data", (chunk) => {
      console.log(">>>>>", chunk.toString("utf8"));
    });

    await container.wait();
    await container.remove();
    await Project.create({
      name: projectInfo.projectName,
      createdBy: projectInfo.username,
      domain: `${projectInfo.username.toLowerCase()}-${projectInfo.projectName.toLowerCase()}`,
      project_url: projectInfo.projectLink,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
  }
};
