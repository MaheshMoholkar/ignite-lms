import { Response } from "express";
import userModel, { IUser } from "../models/user.model";
import redis from "../utils/redis";

export const getUserById = async (id: string): Promise<IUser | null> => {
  const userJson = await redis.get(id);
  if (!userJson) {
    const user = await userModel.findById(id);
    if (user) {
      await redis.set(id, JSON.stringify(user), "EX", 3600);
    }
    return user;
  }
  return JSON.parse(userJson) as IUser;
};
