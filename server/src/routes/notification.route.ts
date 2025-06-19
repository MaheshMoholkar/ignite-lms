import { Router } from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import {
  deleteNotification,
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";

const router = Router();

router.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);
router.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);
router.delete(
  "/delete-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteNotification
);

export default router;
