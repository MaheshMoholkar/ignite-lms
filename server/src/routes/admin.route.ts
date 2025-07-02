import express from "express";
import {
  getAdminStats,
  getRecentCourses,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";
import upload from "../middlewares/upload";

const adminRouter = express.Router();

// Admin dashboard routes
adminRouter.get(
  "/stats",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminStats
);
adminRouter.get(
  "/recent-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getRecentCourses
);

// Course management routes
adminRouter.get(
  "/courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCourses
);
adminRouter.post(
  "/courses",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("thumbnail"),
  createCourse
);
adminRouter.put(
  "/courses/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("thumbnail"),
  updateCourse
);
adminRouter.delete(
  "/courses/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

// User management routes
adminRouter.get(
  "/users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);
adminRouter.put(
  "/users/:id/role",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);
adminRouter.delete(
  "/users/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default adminRouter;
