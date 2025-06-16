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
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import upload from "../middlewares/upload";

const userRouter = express.Router();

userRouter.post("/register", upload.single("avatar"), registerUser);

userRouter.post("/social-auth", socialAuth);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/me", isAuthenticated, getUserDetails);

userRouter.put(
  "/update-user",
  isAuthenticated,
  upload.single("avatar"),
  updateUserDetails
);

userRouter.post("/refresh-token", refreshToken);

userRouter.post("/logout", isAuthenticated, logoutUser);

export default userRouter;
