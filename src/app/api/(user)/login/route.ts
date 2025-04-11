import { PrismaClient } from "@/generated/prisma";
import { sendToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse("Please enter email and password", {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse("Invalid email and password", { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new NextResponse("Invalid email and password", { status: 400 });
    }

    await sendToken(user, 200);
    return new NextResponse(
      JSON.stringify({ message: "Login successful", user }),
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(errorMessage, { status: 400 });
  }
}
