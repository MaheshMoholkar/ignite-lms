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

export default redisClient;
