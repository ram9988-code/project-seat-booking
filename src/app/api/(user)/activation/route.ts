import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { PrismaClient } from "@/generated/prisma";
import { IUser } from "@/@types/database.types";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { activationCode, activationToken } = await req.json();

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET as string
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      return new NextResponse("Invalid activation code!", { status: 400 });
    }

    const { email, password, name, username } = newUser.user;

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        username,
      },
    });

    if (!user) {
      return new NextResponse("User not created!", { status: 400 });
    }
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 201,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(errorMessage, {
      status: 500,
    });
  }
}
