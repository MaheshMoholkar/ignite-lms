import { NextFunction, Request, Response } from "express";
import courseModel from "../models/course.model";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../helpers/ErrorHandler";
import { uploadFile, BUCKETS } from "../utils/minio";
import { createCourse } from "../services/course.service";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      // Parse stringified JSON values
      if (typeof data.tags === "string") {
        data.tags = JSON.parse(data.tags);
      }
      if (typeof data.benefits === "string") {
        data.benefits = JSON.parse(data.benefits);
      }
      if (typeof data.prerequisites === "string") {
        data.prerequisites = JSON.parse(data.prerequisites);
      }
      if (
        data.courseData &&
        data.courseData[0]?.links &&
        typeof data.courseData[0].links === "string"
      ) {
        data.courseData[0].links = JSON.parse(data.courseData[0].links);
      }

      // Handle thumbnail upload if present
      if (req.file) {
        const fileUrl = await uploadFile(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          BUCKETS.COURSE_THUMBNAILS
        );
        data.thumbnail = fileUrl;
      } else {
        return next(new ErrorHandler("Please upload a course thumbnail", 400));
      }

      console.log(data);

      // Create course
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
