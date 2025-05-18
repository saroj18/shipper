import Router from "express";
import passport from "passport";
import {
  loginWithGitHub,
  logoutHandler,
  userInfoHandler,
} from "../controller/user-controller.js";
import { Auth } from "../middleware/auth.js";

export const userRouter = Router();

userRouter.route("/auth/github").get(
  passport.authenticate("github", {
    scope: ["read:user", "user:email", "repo"],
  })
);
userRouter.route("/github/callback").get(
  passport.authenticate("github", {
    session: false,
  }),
  loginWithGitHub
);
userRouter.route("/").get(Auth, userInfoHandler);
userRouter.route("/logout").get(Auth, logoutHandler);
