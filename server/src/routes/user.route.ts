import express from "express";
import {
  activateUser,
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserDetails,
  socialAuth,
  updateUserDetails,
  updatePassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
  resendActivationCode,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import upload from "../middlewares/upload";

const userRouter = express.Router();

userRouter.post("/register", upload.single("avatar"), registerUser);

userRouter.post("/social-auth", socialAuth);

userRouter.post("/activate-user", activateUser);

userRouter.post("/resend-activation-code", resendActivationCode);

userRouter.post("/login", loginUser);

userRouter.get("/me", isAuthenticated, getUserDetails);

userRouter.put(
  "/update-user",
  isAuthenticated,
  upload.single("avatar"),
  updateUserDetails
);

userRouter.put("/update-password", isAuthenticated, updatePassword);

userRouter.post("/refresh-token", refreshToken);

userRouter.post("/logout", isAuthenticated, logoutUser);

userRouter.get(
  "/get-all-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/update-user-role/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
