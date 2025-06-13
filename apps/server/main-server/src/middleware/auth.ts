import jwt, { JwtPayload } from 'jsonwebtoken';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { ApiError } from '@repo/utils';
import { User } from '@repo/database/models/user.model.js';
import { ENV } from '../ENV-Config.js';

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  username: string;
}

export const Auth = async (req: Request, resp: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      resp.status(401);
      throw new ApiError('please login first', 401);
    }
    const decodAccessToken = jwt.verify(accessToken, 'ENV.JWT_SECRET') as TokenPayload;

    if (!decodAccessToken) {
      resp.status(401);
      throw new Error('Invalid token');
    }

    const findUser = await User.findByPk(decodAccessToken.id);

    if (!findUser) {
      resp.status(404);
      throw new ApiError('User not found');
    }

    req.user = findUser.id;
    next();
  } catch (error: any) {
    resp.status(+error.statusCode || 500).json({ success: false, error: error.message });
  }
};
