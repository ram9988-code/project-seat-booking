import { NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";

import sendMail from "@/utils/sendMail";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  username: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}
export async function POST(req: Request) {
  try {
    const { name, email, password, username } = await req.json();

    const isEmailExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (isEmailExist) {
      return new NextResponse("Email already exist", { status: 400 });
    }

    const isUsernameExist = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (isUsernameExist) {
      return new NextResponse("Username already exist", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IRegistrationBody = {
      name,
      email,
      password: hashedPassword,
      username,
    };

    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        templete: "activation.mail.ejs",
        data,
      });

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        }),
        { status: 200 }
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return new NextResponse(errorMessage, { status: 400 });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(errorMessage, {
      status: 500,
    });
  }
}

const createActivationToken = (user: IRegistrationBody): IActivationToken => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};
