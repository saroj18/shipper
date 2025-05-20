import Docker from "dockerode";

export const runBuildContainer = async (projectInfo: any) => {
  const docker = new Docker();
  try {
    const container = await docker.createContainer({
      Image: "730335220956.dkr.ecr.ap-south-1.amazonaws.com/builder:v23",
      Cmd: [""],
      Env: [
        `PROJECT_NAME=${projectInfo.projectName}`,
        `GIT_REPOSITORY__URL=${projectInfo.projectLink}`,
        `AWS_ACCESS_KEY_ID=AKIA2UC27CTOAPK4C3PJ`,
        `AWS_SECRET_ACCESS_KEY=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`,
        `S3_BUCKET_NAME=saroj-learn`,
        `USER_PROJECT_IDENTITY=${projectInfo.projectName + Math.random()}`,
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
  } catch (error: any) {
    console.log("Error: ", error.message);
  }
};
