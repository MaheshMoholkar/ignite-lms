import { NextFunction, Request, Response } from "express";
import courseModel from "../models/course.model";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import { uploadFile, BUCKETS, deleteFile } from "../utils/minio";
import redisClient from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/mail";
import notificationModel from "../models/notification.model";

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

      const course = await courseModel.create(data);
      res.status(201).json({
        success: true,
        course,
      });
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

export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      // Validate course ID
      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      const cache = await redisClient.get(courseId);

      if (cache) {
        res.status(200).json({
          success: true,
          course: JSON.parse(cache),
        });
      } else {
        const course = await courseModel
          .findById(courseId)
          .select(
            "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
          );

        if (!course) {
          return next(new ErrorHandler("Course not found", 404));
        }

        await redisClient.set(courseId, JSON.stringify(course), "EX", 84000);

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cache = await redisClient.get("all-courses");

      if (cache) {
        res.status(200).json({
          success: true,
          courses: JSON.parse(cache),
        });
      } else {
        const courses = await courseModel
          .find()
          .select(
            "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
          );

        await redisClient.set(
          "all-courses",
          JSON.stringify(courses),
          "EX",
          84000
        );

        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = req.user.courses;
      const courseId = req.params.id;

      // Validate course ID
      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      if (courses.length === 0) {
        return next(new ErrorHandler("You have not purchased any course", 404));
      }

      const course = courses.find(
        (course: any) => course.courseId.toString() == courseId
      );

      if (!course) {
        return next(
          new ErrorHandler("You have not purchased this course", 404)
        );
      }

      const courseData = await courseModel.findById(courseId);

      res.status(200).json({
        success: true,
        courseData,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IAddQuestion {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body as IAddQuestion;

      const course = await courseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 400));
      }

      const content = course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!content) {
        return next(new ErrorHandler("Content not found", 404));
      }

      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      content.questions.push(newQuestion);

      await notificationModel.create({
        title: "New Question Received",
        user: req.user._id,
        message: `You have a new question in ${content.title}`,
      });

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IAddAnswer {
  questionId: string;
  answer: string;
  courseId: string;
  contentId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId, answer, courseId, contentId } =
        req.body as IAddAnswer;

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 400));
      }

      const content = course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!content) {
        return next(new ErrorHandler("Content not found", 404));
      }

      const question = content?.questions.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Question not found", 404));
      }

      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies.push(newAnswer);

      await course.save();

      if (req.user._id === question.user._id) {
        await notificationModel.create({
          title: "New Reply Received",
          user: question.user._id,
          message: `You have a new reply in ${content.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: question.question,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "New Reply to your question",
            template: "question-reply.ejs",
            data: {
              html,
            },
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IAddReview {
  courseId: string;
  rating: number;
  review: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, rating, review } = req.body as IAddReview;

      const courses = req.user.courses;

      const courseExists = courses.find(
        (course: any) => course.courseId.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You have not purchased this course", 404)
        );
      }

      const reviewObject: any = {
        user: req.user,
        rating,
        comment: review,
      };

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      course.reviews.push(reviewObject);

      let averageRating =
        course.reviews.reduce(
          (acc: number, item: any) => acc + item.rating,
          0
        ) / course.reviews.length;
      averageRating = Math.round(averageRating * 10) / 10;

      course.ratings = averageRating;

      await course.save();

      await notificationModel.create({
        title: "New Review",
        user: req.user._id,
        message: `You have a new review in ${course.name}`,
      });

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IAddReviewReply {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplytoReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewReply;

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews.find((item: any) =>
        item._id.equals(reviewId)
      );

      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const reply: any = {
        user: req.user,
        comment,
      };

      if (!review.commentReplies) review.commentReplies = [];

      review.commentReplies?.push(reply);

      await course.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
