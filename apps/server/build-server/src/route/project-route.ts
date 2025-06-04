import Router from "express";
import { Auth } from "../middleware/auth.js";
import { deleteProject, getAllProjects, getProjectInfo, projectConfigHandler } from "../controller/project-controller.js";

export const projectRouter = Router();

projectRouter.route("/deploy").post (Auth, projectConfigHandler);
projectRouter.route("/info").get(Auth, getProjectInfo);
projectRouter.route("/").get(Auth, getAllProjects);
projectRouter.route("/:id").delete(Auth, deleteProject);
