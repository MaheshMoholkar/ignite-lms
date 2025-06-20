import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";

import { generateAnalytics } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import courseModel from "../models/course.model";
import orderModel from "../models/order.model";

export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateAnalytics(userModel);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateAnalytics(courseModel);

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getOrdersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateAnalytics(orderModel);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
