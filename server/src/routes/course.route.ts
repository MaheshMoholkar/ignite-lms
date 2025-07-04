import express from "express";
import {
  addQuestion,
  addAnswer,
  editCourse,
  getAllPublicCourses,
  getCourseByUser,
  getUserCourses,
  getSingleCourse,
  uploadCourse,
  uploadCourseVideo,
  addReview,
  addReplytoReview,
  getAllCourses,
  deleteCourse,
} from "../controllers/course.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";
import upload, { uploadVideo } from "../middlewares/upload";

const courseRouter = express.Router();

// Upload course (only admin)
courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("thumbnail"),
  uploadCourse
);

// Upload course video (only admin)
courseRouter.post(
  "/upload-video",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadVideo.single("video"),
  uploadCourseVideo
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("thumbnail"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllPublicCourses);
courseRouter.get("/get-user-courses", isAuthenticated, getUserCourses);
courseRouter.get(
  "/get-all-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCourses
);
courseRouter.get(
  "/courses/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  getSingleCourse
);
courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);
courseRouter.put("/add-question", isAuthenticated, addQuestion);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review", isAuthenticated, addReview);
courseRouter.put(
  "/add-review-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplytoReview
);
courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
