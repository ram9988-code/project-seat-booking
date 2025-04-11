"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function SeatGrid() {
  const router = useRouter();
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  // const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatsToBook, setSeatsToBook] = useState<number>(0);

  const totalSeats = 80;
  const seatsPerRow = 7;

  // ✅ Load booked seats on mount
  useEffect(() => {
    const fetchBookedSeats = async () => {
      const response = await axios.get("/api/refresh");

      if (response.status === 200) {
        toast.success("logged in successfully");
        const res = await fetch("/api/book-seats");
        const data = await res.json();

        if (data) {
          const seatNumbers = data.map(
            (seat: { seatNumber: number }) => seat.seatNumber
          );
          setBookedSeats(seatNumbers);
        }
      }
      if (response.status === 401) {
        toast.error("Please login to this resource");
        router.replace("/login");
      }
      if (response.status === 400) {
        toast.error("Access token is not valid");
        router.replace("/login");
      }
      if (response.status === 500) {
        toast.error("Please login to access this resource");
        router.replace("/login");
      }
    };
    fetchBookedSeats();
  }, []);

  const handleBooking = async () => {
    const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
    const availableSeats = allSeats.filter(
      (seat) => !bookedSeats.includes(seat)
    );

    const newSelected: number[] = [];

    for (
      let rowStart = 0;
      rowStart < totalSeats && newSelected.length < seatsToBook;
      rowStart += seatsPerRow
    ) {
      const rowSeats = Array.from(
        { length: seatsPerRow },
        (_, i) => rowStart + i + 1
      );
      const availableInRow = rowSeats.filter(
        (seat) => !bookedSeats.includes(seat)
      );

      if (
        availableInRow.length === seatsPerRow ||
        availableInRow.length >= seatsToBook - newSelected.length
      ) {
        const needed = seatsToBook - newSelected.length;
        newSelected.push(...availableInRow.slice(0, needed));
      }
    }

    if (newSelected.length < seatsToBook) {
      const remainingNeeded = seatsToBook - newSelected.length;
      const extraSeats = availableSeats
        .filter((s) => !newSelected.includes(s))
        .slice(0, remainingNeeded);
      newSelected.push(...extraSeats);
    }

    if (newSelected.length === seatsToBook) {
      try {
        await axios
          .post("/api/book-seats", JSON.stringify({ seats: newSelected }))
          .then((res) => {
            if (res.status === 200) {
              toast.success("Seats booked successfully!");
            } else if (res.status === 409) {
              toast.error("Some seats were just booked by someone else.");
            }
          });
        setBookedSeats([...bookedSeats, ...newSelected]);
      } catch (error) {
        console.error("Booking failed:", error);
      }
    } else {
      alert("Not enough available seats to book.");
    }
  };

  return (
    <div className="p-4 flex w-full h-fit flex-row items-center justify-between ">
      <div className="w-1/2">
        <div className=" p-6 grid grid-cols-7 gap-2 select-none bg-white rounded-2xl ">
          {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => {
            const isBooked = bookedSeats.includes(seat);
            return (
              <div
                key={seat}
                className={`text-center px-4 py-1 rounded-[8px] ${
                  isBooked ? "bg-yellow-400 cursor-not-allowed" : "bg-green-500"
                }`}
              >
                <p className="text-[16px] font-medium">{seat}</p>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 flex-row items-center justify-between mt-4">
          <div className="w-1/2 flex justify-center items-center  rounded-[8px] bg-yellow-400 px-10 py-2">
            <p className="text-[16px] font-medium">
              Booked Seats = {bookedSeats.length}
            </p>
          </div>
          <div className="w-1/2 flex justify-center items-center  rounded-[8px] bg-green-500 px-10 py-2">
            <p className="text-[16px] font-medium ">
              Available = {totalSeats - bookedSeats.length}
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/2">
        <div className="flex gap-2 flex-row items-center justify-end">
          <input
            type="number"
            min="1"
            max={7}
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(parseInt(e.target.value) || 0)}
            placeholder="Enter number of seats"
            className="border border-gray-400 rounded-lg px-4 py-2 w-[196px]"
          />
          <button
            onClick={handleBooking}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Book
          </button>
        </div>
        <div className="flex gap-2 flex-row items-center justify-end mt-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 w-1/2">
            Reset Booking
          </button>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
