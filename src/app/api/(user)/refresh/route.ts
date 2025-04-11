import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { redis } from "@/utils/redis";
import { accessTokenOption, refreshTokenOption } from "@/utils/jwt";
import { IUser } from "@/@types/database.types";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const refresh_token = cookieStore.get("refresh_token");
    if (!refresh_token) {
      return new NextResponse("Please login to this resource", { status: 400 });
    }

    const decoded = jwt.verify(
      refresh_token?.value,
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;

    const message = "Could not refresh token";
    if (!decoded) {
      return new NextResponse(message, { status: 400 });
    }

    const user: IUser | null = await redis.get(decoded.id);

    if (!user) {
      return new NextResponse("Please login to access this resourse", {
        status: 400,
      });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN as string,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN as string,
      { expiresIn: "7d" }
    );

    cookieStore.set("access_token", accessToken, accessTokenOption);
    cookieStore.set("refresh_token", refreshToken, refreshTokenOption);
    await redis.set(user.id, JSON.stringify(user), { ex: 604800 });

    return new NextResponse(
      JSON.stringify({ stutus: "Success", accessToken }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(errorMessage, { status: 400 });
  }
}
