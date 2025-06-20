import express from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
require("dotenv").config();

// json parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors policy
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// routes
app.use(
  "/api/v1",
  courseRouter,
  userRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter
);

// middleware
app.use(ErrorMiddleware);
