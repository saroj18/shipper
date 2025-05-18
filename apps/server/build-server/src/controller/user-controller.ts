import { ApiError, ApiResponse, asyncHandler } from "@repo/utils";
import { User } from "../models/index.js";

export const loginWithGitHub = asyncHandler(async (req, resp) => {
  const userInfo = (req as any).user;

  const findUser = await User.findOne({
    where: {
      email: userInfo.emails[0].value,
    },
  });

  if (findUser) {
    await findUser.update({
      github_token: userInfo.accessToken,
    });
    await findUser.save();

    const { accessToken, refreshToken } = await User.generateToken({
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
    });

    resp.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    resp.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    resp
      .status(200)
      .json(new ApiResponse("User logged in successfully", 200, userInfo));
    return;
  }

  const saveOnDb = await User.create({
    email: userInfo.emails[0].value,
    username: userInfo.username,
    profile_url: userInfo.photos[0].value,
    github_token: userInfo.accessToken,
  });

  if (!saveOnDb) {
    throw new ApiError("Unable to save user on DB", 500);
  }

  const { accessToken, refreshToken } = await User.generateToken({
    id: saveOnDb.id,
    username: saveOnDb.username,
    email: saveOnDb.email,
  });

  resp.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  resp.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  resp
    .status(200)
    .json(new ApiResponse("User logged in successfully", 200, userInfo));
});


export const logoutHandler = asyncHandler(async (req, resp) => {
  resp.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  resp.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  resp.status(200).json(new ApiResponse("User logged out successfully", 200,{}));
});
