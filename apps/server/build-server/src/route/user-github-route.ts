import Router from 'express'
import { getAllGithubRepos } from '../controller/user-github-controller'
import { Auth } from '../middleware/auth'

export const userGithubRouter=Router()

userGithubRouter.route("/repos").get(Auth,getAllGithubRepos)