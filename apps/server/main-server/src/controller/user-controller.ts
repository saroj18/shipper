import { ApiError, ApiResponse, asyncHandler } from "@repo/utils";
import { User } from "@repo/database/models/user.model.js";
import { ENV } from "../ENV-Config.js";

export const loginWithGitHub = asyncHandler(async (req, resp) => {
  const userInfo = (req as any).user;
  console.log("userInfo", userInfo);

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
    console.log("userInfo", findUser.dataValues);

    const { accessToken } = await User.generateToken({
      id: findUser.dataValues.id,
      username: findUser.dataValues.username,
      email: findUser.dataValues.email,
    });

    resp.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    resp.status(202).redirect(ENV.REDIRECT_AFTER_GITHUB_LOGIN);
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

  const { accessToken } = await User.generateToken({
    id: saveOnDb.id,
    username: saveOnDb.username,
    email: saveOnDb.email,
  });

  resp.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  resp.status(202).redirect(ENV.REDIRECT_AFTER_GITHUB_LOGIN);
});

export const logoutHandler = asyncHandler(async (req, resp) => {
  resp.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  resp
    .status(200)
    .json(new ApiResponse("User logged out successfully", 200, {}));
});

export const userInfoHandler = asyncHandler(async (req, resp) => {
  const userId = (req as any).user;
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  resp
    .status(200)
    .json(new ApiResponse("User info fetched successfully", 200, user));
});
