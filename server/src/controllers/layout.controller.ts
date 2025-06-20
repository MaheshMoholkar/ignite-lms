import { NextFunction, Request, Response } from "express";
import layoutModel from "../models/layout.model";
import ErrorHandler from "../utils/errorHandler";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import { uploadFile, BUCKETS, deleteFile } from "../utils/minio";

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (!type) {
        return next(new ErrorHandler("Type is required", 400));
      }
      const isExist = await layoutModel.findOne({ type });
      if (isExist) {
        return next(new ErrorHandler("Layout already exists", 400));
      }
      if (type === "banner") {
        const { title, subTitle } = req.body;
        if (!req.file) {
          return next(new ErrorHandler("Please upload a banner image", 400));
        }
        const bannerImage = await uploadFile(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          BUCKETS.LAYOUT_BANNERS
        );
        const banner = await layoutModel.create({
          type: "banner",
          banner: {
            image: bannerImage,
            title,
            subTitle,
          },
        });
        res.status(201).json({
          success: true,
          banner,
        });
      }
      if (type === "faq") {
        const { faq } = req.body;
        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));
        await layoutModel.create({ type: "faq", faq: faqItems });
        res.status(201).json({
          success: true,
          message: "FAQ created successfully",
        });
      }
      if (type === "categories") {
        const { categories } = req.body;
        const categoryItems = categories.map((item: any) => ({
          title: item.title,
        }));
        await layoutModel.create({
          type: "categories",
          categories: categoryItems,
        });
        res.status(201).json({
          success: true,
          message: "Categories created successfully",
        });
      }
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (!type) {
        return next(new ErrorHandler("Type is required", 400));
      }
      const isExist = await layoutModel.findOne({ type });
      if (!isExist) {
        return next(new ErrorHandler("Layout not found", 400));
      }
      if (type === "banner") {
        const { title, subTitle } = req.body;
        if (!req.file) {
          return next(new ErrorHandler("Please upload a banner image", 400));
        }

        if (isExist.banner.image.public_id) {
          await deleteFile(
            isExist.banner.image.public_id,
            BUCKETS.LAYOUT_BANNERS
          );
        }

        const bannerImage = await uploadFile(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          BUCKETS.LAYOUT_BANNERS
        );

        await layoutModel.findByIdAndUpdate(isExist._id, {
          type: "banner",
          banner: {
            image: bannerImage,
            title,
            subTitle,
          },
        });

        res.status(200).json({
          success: true,
          message: "Banner updated successfully",
        });
      }
      if (type === "faq") {
        const { faq } = req.body;

        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));

        await layoutModel.findByIdAndUpdate(isExist._id, {
          type: "faq",
          faq: faqItems,
        });

        res.status(200).json({
          success: true,
          message: "FAQ updated successfully",
        });
      }
      if (type === "categories") {
        const { categories } = req.body;

        const categoryItems = categories.map((item: any) => ({
          title: item.title,
        }));

        await layoutModel.findByIdAndUpdate(isExist._id, {
          type: "categories",
          categories: categoryItems,
        });

        res.status(200).json({
          success: true,
          message: "Categories updated successfully",
        });
      }
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.query;
      if (!type) {
        return next(new ErrorHandler("Type is required", 400));
      }
      const layout = await layoutModel.findOne({ type: type as string });
      if (!layout) return next(new ErrorHandler("Layout not found", 404));

      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);
