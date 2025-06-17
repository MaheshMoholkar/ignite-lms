import { NextFunction, Request, Response } from "express";
import courseModel from "../models/course.model";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../helpers/ErrorHandler";
import { uploadFile, BUCKETS, deleteFile } from "../utils/minio";
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

      // Transform flattened courseData into array of objects
      const courseDataArray = [];
      let index = 0;
      while (data[`courseData[${index}].title`]) {
        const courseDataItem = {
          title: data[`courseData[${index}].title`],
          description: data[`courseData[${index}].description`],
          videoUrl: data[`courseData[${index}].videoUrl`],
          videoSection: data[`courseData[${index}].videoSection`],
          videoLength: data[`courseData[${index}].videoLength`],
          links:
            typeof data[`courseData[${index}].links`] === "string"
              ? JSON.parse(data[`courseData[${index}].links`])
              : data[`courseData[${index}].links`],
        };
        courseDataArray.push(courseDataItem);
        index++;
      }
      data.courseData = courseDataArray;

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

      // Create course
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id;

      // Validate course ID
      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      // Check if course exists
      const existingCourse = await courseModel.findById(courseId);
      if (!existingCourse) {
        return next(new ErrorHandler("Course not found", 404));
      }

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

      // Transform flattened courseData into array of objects
      const courseDataArray = [];
      let index = 0;
      while (data[`courseData[${index}].title`]) {
        const courseDataItem = {
          title: data[`courseData[${index}].title`],
          description: data[`courseData[${index}].description`],
          videoUrl: data[`courseData[${index}].videoUrl`],
          videoSection: data[`courseData[${index}].videoSection`],
          videoLength: data[`courseData[${index}].videoLength`],
          links:
            typeof data[`courseData[${index}].links`] === "string"
              ? JSON.parse(data[`courseData[${index}].links`])
              : data[`courseData[${index}].links`],
        };
        courseDataArray.push(courseDataItem);
        index++;
      }
      if (courseDataArray.length > 0) {
        data.courseData = courseDataArray;
      }

      // Handle thumbnail upload if present
      if (req.file) {
        // Delete old thumbnail if it exists
        if (existingCourse.thumbnail?.public_id) {
          await deleteFile(
            existingCourse.thumbnail.public_id,
            BUCKETS.COURSE_THUMBNAILS
          );
        }

        const fileUrl = await uploadFile(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          BUCKETS.COURSE_THUMBNAILS
        );
        data.thumbnail = {
          public_id: req.file.originalname,
          url: fileUrl,
        };
      }

      const course = await courseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
