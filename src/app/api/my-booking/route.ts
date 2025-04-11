import { IUser } from "@/@types/database.types";
import { PrismaClient } from "@/generated/prisma";
import { isAuthenticated } from "@/middleware/isAuthenticated";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET() {
  try {
    const user = (await isAuthenticated()) as IUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bookedSeats = await prisma.bookedSeat.findMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json(bookedSeats);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch booked seats" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { seats } = await req.json();
  const user = (await isAuthenticated()) as IUser;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    return NextResponse.json({ error: "No seats provided" }, { status: 400 });
  }

  try {
    const deleted = await prisma.bookedSeat.deleteMany({
      where: {
        userId: user.id,
        seatNumber: { in: seats },
      },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete seats" },
      { status: 500 }
    );
  }
}
