import Router from 'express'
import { getAllGithubRepos } from '../controller/user-github-controller'

export const userGithubRouter=Router()

userGithubRouter.route("/repos").get(getAllGithubRepos)