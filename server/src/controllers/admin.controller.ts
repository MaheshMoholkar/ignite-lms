import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import courseModel from "../models/course.model";
import userModel from "../models/user.model";
import orderModel from "../models/order.model";
import { uploadFile, deleteFile, BUCKETS } from "../utils/minio";

// Get admin dashboard stats
export const getAdminStats = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalCourses = await courseModel.countDocuments();
      const totalUsers = await userModel.countDocuments({ role: "user" });

      // Calculate total revenue from orders
      const orders = await orderModel.find();
      // For now, we'll set revenue to 0 since order model doesn't have price
      // This can be updated when payment system is implemented
      const totalRevenue = 0;

      // Calculate total enrollments
      const totalEnrollments = orders.length;

      res.status(200).json({
        success: true,
        totalCourses,
        totalUsers,
        totalRevenue,
        totalEnrollments,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get recent courses for admin dashboard
export const getRecentCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await courseModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name price purchased ratings createdAt");

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all courses for admin management
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await courseModel.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Create new course
export const createCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseData = JSON.parse(req.body.courseData);
      let thumbnailData;

      // Handle thumbnail upload
      if (req.file) {
        try {
          thumbnailData = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            BUCKETS.COURSE_THUMBNAILS
          );
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      // Create course with thumbnail data
      const course = await courseModel.create({
        ...courseData,
        ...(thumbnailData && { thumbnail: thumbnailData }),
      });

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Update course
export const updateCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const courseData = req.body;
      let thumbnailData;

      // Handle thumbnail upload if provided
      if (req.file) {
        try {
          // Delete old thumbnail if exists
          const existingCourse = await courseModel.findById(id);
          if (existingCourse?.thumbnail?.public_id) {
            await deleteFile(
              existingCourse.thumbnail.public_id,
              BUCKETS.COURSE_THUMBNAILS
            );
          }

          // Upload new thumbnail
          thumbnailData = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            BUCKETS.COURSE_THUMBNAILS
          );
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      // Update course
      const course = await courseModel.findByIdAndUpdate(
        id,
        {
          ...courseData,
          ...(thumbnailData && { thumbnail: thumbnailData }),
        },
        { new: true }
      );

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete course
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await courseModel.findById(id);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Delete thumbnail from MinIO
      if (course.thumbnail?.public_id) {
        await deleteFile(course.thumbnail.public_id, BUCKETS.COURSE_THUMBNAILS);
      }

      await courseModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all users for admin management
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userModel.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Update user role
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await userModel.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      );

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete user
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Delete user avatar from MinIO if exists
      if (user.avatar?.public_id) {
        await deleteFile(user.avatar.public_id, BUCKETS.PROFILE_IMAGES);
      }

      await userModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
