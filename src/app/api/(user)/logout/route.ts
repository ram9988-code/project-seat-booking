import { IUser } from "@/@types/database.types";
import { isAuthenticated } from "@/middleware/isAuthenticated";
import { redis } from "@/utils/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const user = (await isAuthenticated()) as IUser;
    if (!user) {
      return new NextResponse("Please login to this resource", { status: 400 });
    }
    cookieStore.set("access_token", "", { maxAge: 1 });
    cookieStore.set("refresh_token", "", { maxAge: 1 });

    redis.del(user.id);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Logged out succesfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(errorMessage, { status: 400 });
  }
}
