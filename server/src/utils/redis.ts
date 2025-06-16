import Redis from "ioredis";
require("dotenv").config();

const redisClient = new Redis(
  process.env.REDIS_URI || "redis://localhost:6379",
  {
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  }
);

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// Utility functions for Redis operations
export const setCache = async (
  key: string,
  value: any,
  expiryInSeconds?: number
) => {
  try {
    const stringValue = JSON.stringify(value);
    if (expiryInSeconds) {
      await redisClient.setex(key, expiryInSeconds, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    return true;
  } catch (error) {
    console.error("Redis Set Error:", error);
    return false;
  }
};

export const getCache = async (key: string) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Redis Get Error:", error);
    return null;
  }
};

export const deleteCache = async (key: string) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error("Redis Delete Error:", error);
    return false;
  }
};

export const clearCache = async () => {
  try {
    await redisClient.flushall();
    return true;
  } catch (error) {
    console.error("Redis Clear Error:", error);
    return false;
  }
};

export default redisClient;
