import Router from "express";
import passport from "passport";
import {
  loginWithGitHub,
  logoutHandler,
} from "../controller/user-controller.js";

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
userRouter.route("/logout").get(logoutHandler);
