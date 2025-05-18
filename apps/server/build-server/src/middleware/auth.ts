import jwt, { JwtPayload } from "jsonwebtoken";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { ApiError } from "@repo/utils";
import { User } from "../models";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  username: string;
}

export const Auth = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      resp.status(401);
      throw new ApiError("please login first", 401);
    }
    const decodAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRETE as string
    ) as TokenPayload;

    if (!decodAccessToken) {
      resp.status(401);
      throw new Error("Invalid token");
    }

    const findUser = await User.findOne({
      where: { _id: decodAccessToken.id },
    });

    if (!findUser) {
      resp.status(404);
      throw new ApiError("User not found");
    }

    req.user = findUser.id;
    next();
  } catch (error: any) {
    resp
      .status(error.statusCode)
      .json({ success: false, error: error.message });
  }
};
