import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";
import upload from "../middlewares/upload";
import { createOrder } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);

export default orderRouter;
