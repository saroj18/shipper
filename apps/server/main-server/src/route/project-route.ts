import Router from 'express';
import { Auth } from '../middleware/auth.js';
import {
  buildByWebHook,
  deleteProject,
  getAllProjects,
  getProjectInfo,
  projectConfigHandler,
  updateENV,
} from '../controller/project-controller.js';

export const projectRouter = Router();

projectRouter.route('/deploy').post(Auth, projectConfigHandler);
projectRouter.route('/info').get(Auth, getProjectInfo);
projectRouter.route('/web-hook').post(buildByWebHook);
projectRouter.route('/env').post(Auth, updateENV);
projectRouter.route('/').get(Auth, getAllProjects);
projectRouter.route('/:id').delete(Auth, deleteProject);
