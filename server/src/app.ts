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
import layoutRouter from "./routes/layout.route";
import adminRouter from "./routes/admin.route";
require("dotenv").config();

// json parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors policy
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ignite-lms-peach.vercel.app",
        "https://ignite-lms.vercel.app",
      ];

      if (process.env.NODE_ENV === "production") {
        allowedOrigins.push(process.env.ORIGIN || "");
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// routes
app.use(
  "/api/v1",
  courseRouter,
  userRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter,
  adminRouter
);

// middleware
app.use(ErrorMiddleware);
