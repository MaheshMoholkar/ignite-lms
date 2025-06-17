import express from "express";
import { editCourse, uploadCourse } from "../controllers/course.controller";
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

export default courseRouter;
