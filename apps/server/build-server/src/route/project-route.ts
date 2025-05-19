import Router from "express";
import { Auth } from "../middleware/auth.js";
import { projectConfigHandler } from "../controller/project-controller.js";

export const projectRouter = Router();

projectRouter.route("/deploy").post (Auth, projectConfigHandler);
