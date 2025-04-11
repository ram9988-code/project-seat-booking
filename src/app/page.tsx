"use client";

import SeatGrid from "@/components/SeatGrid";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleLogout = async () => {
    await axios
      .post("/api/logout")
      .then((res) => {
        if (res.status === 201) {
          router.replace("/login");
        }
      })
      .catch(() => {
        console.log("Error logging out");
        // router.replace("/login");
      });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="w-full max-w-6xl flex flex-col items-center ">
        <h1 className="text-2xl mb-3 font-bold">Ticket Booking</h1>
        <SeatGrid />
      </div>
    </div>
  );
}
