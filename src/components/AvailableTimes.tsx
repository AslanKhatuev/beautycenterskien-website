"use client";

import { useEffect, useState } from "react";

interface AvailableTimesProps {
  date: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  onError?: (message: string) => void; // Ny prop for feilhåndtering
}

export default function AvailableTimes({
  date,
  selectedTime,
  onSelectTime,
  onError,
}: AvailableTimesProps) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funksjon for å sjekke om en tid har passert (kun for dagens dato)
  const isTimePassed = (timeString: string) => {
    const today = new Date();
    const selectedDate = new Date(date);

    // Sjekk kun hvis det er dagens dato
    if (selectedDate.toDateString() !== today.toDateString()) {
      return false; // Fremtidige datoer er alltid OK
    }

    const [hours, minutes] = timeString.split(":").map(Number);
    const timeToCheck = new Date();
    timeToCheck.setHours(hours, minutes, 0, 0);

    // Legg til 15 minutter buffer for å unngå booking av tid som starter nå
    const currentTimeWithBuffer = new Date();
    currentTimeWithBuffer.setMinutes(currentTimeWithBuffer.getMinutes() + 15);

    return timeToCheck <= currentTimeWithBuffer;
  };

  const handleTimeSelect = (time: string) => {
    // Sjekk om tiden har passert
    if (isTimePassed(time)) {
      if (onError) {
        onError("Kan ikke booke tid som allerede har passert.");
      }
      return;
    }

    // Tid er gyldig, velg den
    onSelectTime(time);
  };

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
          {availableTimes.map((time) => {
            const isPast = isTimePassed(time);
            const isSelected = selectedTime === time;

            return (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                type="button"
                className={`w-28 sm:w-32 px-4 py-2 rounded-full text-sm font-medium border text-center transition-colors duration-200 ${
                  isSelected
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-pink-100 hover:border-pink-300"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
