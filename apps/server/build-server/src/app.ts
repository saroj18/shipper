import express, { NextFunction, Request, Response } from "express";
import { globalErrorHandler,ApiError } from "@repo/utils";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
// import GoogleStrategy from "passport-google-oauth20";
// import GithubStrategy from "passport-github-oauth20";
import passport from "passport";
dotenv.config();

export const app = express();


export const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//       passReqToCallback: true,
//     },
//     function (request, accessToken, refreshToken, profile, done) {
//       return done(null, profile);
//     }
//   )
// );

app.use(cookieParser());
app.use((err: ApiError, req: Request, resp: Response, next: NextFunction) => {
  globalErrorHandler(err, resp);
});
