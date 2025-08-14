// Oppdater src/components/AvailableTime.tsx
"use client";

import { useEffect, useState } from "react";

interface AvailableTimesProps {
  date: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export default function AvailableTimes({
  date,
  selectedTime,
  onSelectTime,
}: AvailableTimesProps) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        console.log("🔍 Fetching available times for date:", dateString);

        const response = await fetch(
          `/api/contact/bookings?date=${dateString}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", response.status, errorText);
          throw new Error(`API feil (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Sett tilgjengelige tider direkte fra API
        setAvailableTimes(data.available || []);
      } catch (err) {
        console.error("Full error:", err);
        setError(err instanceof Error ? err.message : "Ukjent feil");
        setAvailableTimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [date]);

  if (loading) {
    return (
      <div className="mb-8 w-full">
        <h2 className="text-xl font-semibold mb-4 text-white text-center sm:text-left">
          Henter ledige tider...
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 w-full">
        <h2 className="text-xl font-semibold mb-4 text-white text-center sm:text-left">
          Ledige tider:
        </h2>
        <p className="text-red-400 text-center mb-4">
          Feil ved henting av tider: {error}
        </p>
        <p className="text-white text-center">
          Vennligst prøv å laste siden på nytt.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4 text-white text-center sm:text-left">
        Velg tid:
      </h2>

      {availableTimes.length === 0 ? (
        <p className="text-white text-center">
          {date.getDay() === 0
            ? "Vi er stengt på søndag."
            : "Ingen ledige tider denne dagen."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => onSelectTime(time)}
              type="button"
              className={`w-28 sm:w-32 px-4 py-2 rounded-full text-sm font-medium border text-center transition-colors duration-200 ${
                selectedTime === time
                  ? "bg-pink-600 text-white border-pink-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-pink-100 hover:border-pink-300"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
