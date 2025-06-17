import express from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();
import { ErrorMiddleware } from "./middlewares/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";

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
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);

// middleware
app.use(ErrorMiddleware);
