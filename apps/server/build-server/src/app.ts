import express, { NextFunction, Request, Response } from 'express';
import { globalErrorHandler, ApiError } from '@repo/utils';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import dotenv from 'dotenv';
// import GoogleStrategy from "passport-google-oauth20";
import GithubStrategy from 'passport-github';
import passport from 'passport';
import { userRouter } from './route/user-route.js';
import { userGithubRouter } from './route/user-github-route.js';
import { projectRouter } from './route/project-route.js';
import { SocketProvider } from '@repo/socket';
dotenv.config();

export const app = express();


export const server = http.createServer(app);
SocketProvider.getInstance(server);

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  })
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, { ...profile, accessToken });
    }
  )
);

app.use(cookieParser());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/github', userGithubRouter);
app.use('/api/v1/project', projectRouter);
app.use((err: ApiError, req: Request, resp: Response, next: NextFunction) => {
  globalErrorHandler(err, resp);
});
