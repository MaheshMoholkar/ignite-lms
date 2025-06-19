import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import orderModel from "../models/order.Model";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import notificationModel from "../models/notification.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/mail";

interface IOrder {
  courseId: string;
  paymentInfo?: any;
}

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, paymentInfo } = req.body as IOrder;

      const user = await userModel.findById(req.user._id);

      if (!user) return next(new ErrorHandler("User not found", 404));

      const courseExists = user?.courses.find((c) => c.courseId === courseId);

      if (courseExists)
        return next(
          new ErrorHandler("You have already purchased this course!", 400)
        );

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        paymentInfo,
      };

      await orderModel.create(data);

      const mail = {
        order: {
          _id: course.id.slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      try {
        await sendMail({
          email: user.email,
          subject: "Order Confirmed",
          template: "order-confirmation.ejs",
          data: mail,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user.courses.push({ courseId: course.id });

      course.purchased ? (course.purchased += 1) : (course.purchased = 1);

      await course.save();

      await user.save();

      await notificationModel.create({
        userId: user._id,
        title: "New Order",
        message: "You have received a new order",
      });

      res.status(201).json({
        success: true,
        order: course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
