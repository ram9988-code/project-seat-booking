import "dotenv/config";
import jwt from "jsonwebtoken";
import { redis } from "./redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { IUser } from "@/@types/database.types";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);

export const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

//options for cookies
export const accessTokenOption: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 10000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOption: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = async (user: IUser, statusCode: number) => {
  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN || "",
    {
      expiresIn: "5m",
    }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN || "",
    {
      expiresIn: "7d",
    }
  );

  //upload session to redis
  redis.set(user.id, JSON.stringify(user), { ex: 604800 });

  if (process.env.NODE_ENV === "production") {
    accessTokenOption.secure = true;
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, accessTokenOption);
  cookieStore.set("refresh_token", refreshToken, refreshTokenOption);

  return new NextResponse(
    JSON.stringify({
      success: true,
      user,
      accessToken,
    }),
    { status: statusCode }
  );
};
