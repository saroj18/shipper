import { ApiError, ApiResponse, asyncHandler } from "@repo/utils";
import { User } from "../models";
import axios from "axios";

export const getAllGithubRepos = asyncHandler(async (req, resp) => {
  const userId = (req as any).user.id;

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const githubToken = user.github_token;

  if (!githubToken) {
    throw new ApiError("GitHub token not found", 404);
  }

  const response = await axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  const repos = response.data;

  resp
    .status(200)
    .json(new ApiResponse("Github repos fetched successfully", 200, repos));
});
