import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../helpers/ErrorHandler";
import redis from "../utils/redis";
import userModel, { IUser } from "../models/user.model";

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as Secret
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Invalid token", 401));
    }

    const user = await redis.get(decoded.id as string);

    if (!user) {
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await redis.set(user._id as string, JSON.stringify(user), "EX", 3600);
    }

    req.user = JSON.parse(user as string) as IUser;

    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string)) {
      return next(new ErrorHandler("Unauthorized", 403));
    }
    next();
  };
};
