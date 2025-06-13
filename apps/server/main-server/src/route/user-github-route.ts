import Router from 'express'
import { getAllGithubRepos, getSingleGithubRepo } from '../controller/user-github-controller.js'
import { Auth } from '../middleware/auth.js'

export const userGithubRouter=Router()

userGithubRouter.route("/repos").get(Auth,getAllGithubRepos)
userGithubRouter.route("/repo/:name").get(Auth,getSingleGithubRepo)