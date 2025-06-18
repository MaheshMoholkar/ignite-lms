import express from "express";
import {
  addQuestion,
  addAnswer,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";
import upload from "../middlewares/upload";

const courseRouter = express.Router();

// Upload course (only admin)
courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("thumbnail"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("thumbnail"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourses);
courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);
courseRouter.put("/add-question", isAuthenticated, addQuestion);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);

export default courseRouter;
