"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!date || !isClient) return;

      setLoading(true);
      setError(null);

      try {
        const dateString = date.toISOString().split("T")[0];
        console.log("🔍 Fetching available times for date:", dateString);

        const response = await fetch(
          `/api/contact/bookings?date=${dateString}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", response.status, errorData);
          throw new Error(
            `API feil (${response.status}): ${JSON.stringify(errorData)}`
          );
        }

        const data = await response.json();
        console.log("✅ Available times received:", data);

        setAvailableTimes(data.available || []);
      } catch (error) {
        console.error("Full error:", error);
        setError(error instanceof Error ? error.message : "Ukjent feil");
        setAvailableTimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [date, isClient]);

  const formatDate = (date: Date) => {
    if (!isClient) return "";

    return date.toLocaleDateString("no-NO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Ledige tider</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="ml-2 text-gray-600">Laster tider...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Ledige tider</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-red-600 mb-2" role="alert">
            ❌ Feil ved henting av tider
          </div>
          <div className="text-sm text-red-500">{error}</div>
          <p className="text-gray-600 mt-4">
            Vennligst prøv å laste siden på nytt.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
          >
            Last på nytt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-pink-600" />
        <h3 className="text-lg font-semibold text-gray-900">Ledige tider</h3>
      </div>

      <p className="text-gray-600 mb-4">{formatDate(date)}</p>

      {availableTimes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Ingen ledige tider for denne dagen.</p>
          <p className="text-sm text-gray-500 mt-2">
            Velg en annen dato for å fortsette med booking
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {availableTimes.map((time) => {
            // Sjekk om tiden har passert (kun for dagens dato)
            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDay = new Date(date);
            selectedDay.setHours(0, 0, 0, 0);

            let isTimePassed = false;
            if (selectedDay.getTime() === today.getTime()) {
              const [hours, minutes] = time.split(":").map(Number);
              const timeToCheck = new Date();
              timeToCheck.setHours(hours, minutes, 0, 0);
              const minimumTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 min buffer
              isTimePassed = timeToCheck <= minimumTime;
            }

            return (
              <button
                key={time}
                onClick={() => !isTimePassed && onSelectTime(time)}
                disabled={isTimePassed}
                className={`
                  py-3 px-4 rounded-lg text-sm font-medium transition-colors
                  ${
                    isTimePassed
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      : selectedTime === time
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-pink-100"
                  }
                `}
                aria-pressed={!isTimePassed && selectedTime === time}
                aria-disabled={isTimePassed}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}

      {availableTimes.length > 0 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Velg en tid for å fortsette med booking
        </p>
      )}
    </div>
  );
}
