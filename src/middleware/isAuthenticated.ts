import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "@/utils/redis";
import { cookies } from "next/headers";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");

  if (!access_token) {
    return new NextResponse("Please login to this resource", { status: 400 });
  }

  const decoded = jwt.verify(
    access_token.value,
    process.env.ACCESS_TOKEN as string
  ) as JwtPayload;

  if (!decoded) {
    return new NextResponse("Access token is not valid", { status: 400 });
  }

  const user = await redis.get(decoded.id);

  if (!user) {
    return new NextResponse("Please login to access this resourse", {
      status: 400,
    });
  }

  return user;
}
