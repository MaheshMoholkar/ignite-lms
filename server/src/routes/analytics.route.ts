import express from "express";
import {
  getCoursesAnalytics,
  getOrdersAnalytics,
  getUsersAnalytics,
  getAdminStats,
} from "../controllers/analytics.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-admin-stats",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminStats
);

analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUsersAnalytics
);

analyticsRouter.get(
  "/get-courses-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAnalytics
);

analyticsRouter.get(
  "/get-orders-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrdersAnalytics
);

export default analyticsRouter;
