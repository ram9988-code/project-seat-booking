// import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// const redisClint = () => {
//   if (process.env.REDIS_URL) {
//     console.log("Redis is Connected");
//     return process.env.REDIS_URL;
//   }
//   throw new Error("Redis Connection failed");
// };

// export const redis = new Redis(redisClint());

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.REDIS_URL_N,
  token: process.env.REDIS_TOKEN,
});
