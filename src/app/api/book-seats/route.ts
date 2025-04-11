import { IUser } from "@/@types/database.types";
import { PrismaClient } from "@/generated/prisma";
import { isAuthenticated } from "@/middleware/isAuthenticated";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await isAuthenticated();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bookedSeats = await prisma.bookedSeat.findMany();
    return NextResponse.json(bookedSeats);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch booked seats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { seats } = await request.json();
  const user = (await isAuthenticated()) as IUser;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    return NextResponse.json({ error: "No seats provided" }, { status: 400 });
  }

  try {
    const existingSeats = await prisma.bookedSeat.findMany({
      where: {
        seatNumber: {
          in: seats,
        },
      },
    });

    const alreadyBooked = existingSeats.map((s) => s.seatNumber);
    const newSeats = seats.filter((s: number) => !alreadyBooked.includes(s));

    if (newSeats.length === 0) {
      return NextResponse.json(
        { error: "All selected seats are already booked", alreadyBooked },
        { status: 409 }
      );
    }

    const data = await Promise.all(
      newSeats.map((seat: number) =>
        prisma.bookedSeat.create({
          data: {
            seatNumber: seat,
            userId: user.id,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `${data.length} seat(s) booked successfully`,
      booked: data,
      skipped: alreadyBooked,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to book seats" },
      { status: 500 }
    );
  }
}
