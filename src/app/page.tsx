"use client";
import SeatGrid from "@/components/SeatGrid";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-6xl flex flex-col items-center ">
        <h1 className="text-2xl mb-3 font-bold">Ticket Booking</h1>
        <SeatGrid />
      </div>
    </div>
  );
}
