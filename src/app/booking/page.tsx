"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar";
import AvailableTimes from "@/components/AvailableTime";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Bestill time</h1>

      {/* Kalender */}
      <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Ledige tider */}
      {selectedDate && (
        <AvailableTimes
          date={selectedDate}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />
      )}

      {/* Booking-skjema */}
      {selectedDate && selectedTime && (
        <BookingForm date={selectedDate} time={selectedTime} />
      )}
    </main>
  );
}
