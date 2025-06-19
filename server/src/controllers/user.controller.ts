import { Secret } from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validateEmail } from "../utils/validators";
import { generateRandomActivationCode } from "../utils/security";
import sendMail from "../utils/mail";
import redis from "../utils/redis";
import { uploadFile, deleteFile, BUCKETS } from "../utils/minio";
require("dotenv").config();

// register user
interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
}

export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      let avatarData;

      // Input validation
      if (!name || !email || !password) {
        return next(
          new ErrorHandler("Please provide all required fields", 400)
        );
      }

      // Email validation
      if (!validateEmail(email)) {
        return next(new ErrorHandler("Please provide a valid email", 400));
      }

      // Password strength validation
      if (password.length < 3) {
        return next(
          new ErrorHandler("Password must be at least 3 characters long", 400)
        );
      }

      // Check if email already exists
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      // Handle avatar upload if present
      if (req.file) {
        try {
          // Upload to MinIO and get the URL and public_id
          avatarData = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            BUCKETS.PROFILE_IMAGES
          );
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      // Create user object with MinIO avatar data
      const userData: IRegisterBody = {
        name,
        email,
        password,
        ...(avatarData && { avatar: avatarData }), // Include MinIO avatar data if available
      };

      const activationCode = generateRandomActivationCode();

      // Generate authentication activation_token
      const activation_token = jwt.sign(
        { user: userData, activationCode },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "1h" }
      );

      // Create user in database with isVerified flag and MinIO avatar data
      const user = await userModel.create({
        ...userData,
        isVerified: false,
        activationCode,
      });

      // Send activation email
      const data = {
        user: {
          name: user.name,
        },
        activationCode,
      };

      try {
        await sendMail({
          email: user.email,
          subject: "Activate Your Ignite LMS Account",
          template: "activation-mail.ejs",
          data,
        });

        res.cookie("activation_token", activation_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(201).json({
          success: true,
          message: "Please check your email to activate your account",
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
        });
      } catch (error: any) {
        // If email sending fails, delete the created user and uploaded avatar
        await userModel.findOneAndDelete({ email });
        if (avatarData?.public_id) {
          await deleteFile(avatarData.public_id, BUCKETS.PROFILE_IMAGES);
        }
        return next(new ErrorHandler("Failed to send activation email", 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activation_token = req.cookies.activation_token;
      const activation_code = req.body.activation_code;

      if (!activation_token || !activation_code) {
        return next(
          new ErrorHandler(
            "Please provide activation activation_token and code",
            400
          )
        );
      }

      let decodedToken: { user: IUser; activationCode: string };
      try {
        decodedToken = jwt.verify(
          activation_token,
          process.env.JWT_SECRET as string
        ) as {
          user: IUser;
          activationCode: string;
        };
      } catch (error) {
        return next(
          new ErrorHandler(
            "Invalid or expired activation activation_token",
            400
          )
        );
      }

      const { email } = decodedToken.user;

      // Find the user by email
      const user = await userModel.findOne({ email }).select("+activationCode");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (user.isVerified) {
        return next(new ErrorHandler("User is already activated", 400));
      }

      if (user.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      // Update user status
      user.isVerified = true;
      user.activationCode = undefined;
      await user.save();

      res.cookie("activation_token", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      await redis.set(user._id as string, JSON.stringify(user), "EX", 3600);

      res.status(200).json({
        success: true,
        message: "User activated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
      }

      // Find user and include password field
      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      // Check if user is verified
      if (!user.isVerified) {
        return next(new ErrorHandler("Please verify your account first", 400));
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      // Generate access token
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "1h" }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET as Secret,
        { expiresIn: "7d" }
      );

      // Set access token in cookie
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      // Set refresh token in cookie
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      await redis.set(user._id as string, JSON.stringify(user), "EX", 3600);

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// refresh token
export const refreshToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        return next(new ErrorHandler("Refresh token not found", 400));
      }

      // Verify refresh token
      const decoded = jwt.verify(
        refresh_token,
        process.env.JWT_REFRESH_SECRET as Secret
      ) as { id: string };

      // Generate new access token
      const access_token = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "1h" }
      );

      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await redis.set(user._id as string, JSON.stringify(user), "EX", 3600);

      res.status(200).json({
        success: true,
        message: "New access token generated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler("Invalid refresh token", 400));
    }
  }
);

// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      res.cookie("refresh_token", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      await redis.del(req.user._id as string);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user details
export const getUserDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await redis.set(user._id as string, JSON.stringify(user), "EX", 3600);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ISocialAuthRequest {
  name: string;
  email: string;
  avatar: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuthRequest;

      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user = await userModel.create({
        name,
        email,
        avatar,
        isVerified: true,
      });

      await redis.set(user._id as string, JSON.stringify(user), "EX", 3600);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user details
export const updateUserDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const { name, email } = req.body || {};
      let avatar;

      // Validate email if provided
      if (email) {
        if (!validateEmail(email)) {
          return next(new ErrorHandler("Please provide a valid email", 400));
        }

        if (email !== user.email) {
          const isEmailExist = await userModel.findOne({ email });
          if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
          }
          user.email = email;
        }
      }

      if (name) user.name = name;

      // Handle avatar upload if present
      if (req.file) {
        try {
          // Delete old avatar if exists
          if (user.avatar?.public_id) {
            await deleteFile(user.avatar.public_id, BUCKETS.PROFILE_IMAGES);
          }

          // Upload new avatar
          avatar = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            BUCKETS.PROFILE_IMAGES
          );
          user.avatar = avatar;
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      await user.save();

      await redis.set(user._id as string, JSON.stringify(user), "EX", 3600);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdatePassword {
  oldPassword?: string;
  newPassword: string;
}

// update password
export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.user._id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!newPassword) {
        return next(new ErrorHandler("Please provide new password", 400));
      }

      // Check if user has a password (not a social auth user)
      if (user.password) {
        if (!oldPassword) {
          return next(new ErrorHandler("Please provide old password", 400));
        }

        const isPasswordValid = await user.comparePassword(oldPassword);
        if (!isPasswordValid) {
          return next(new ErrorHandler("Invalid old password", 400));
        }
      }

      // Set new password
      user.password = newPassword;
      await user.save();

      await redis.set(user._id as string, JSON.stringify(user), "EX", 3600);

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userModel.find({ role: "user" });

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      user.role = req.body.role;
      await user.save();

      await redis.del(user._id as string);

      res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete user
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await user.deleteOne();

      await redis.del(user._id as string);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
