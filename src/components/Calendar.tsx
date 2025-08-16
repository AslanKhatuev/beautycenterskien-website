"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

export default function Calendar({
  selectedDate,
  onDateChange,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setCurrentMonth(new Date());
    setIsClient(true);
  }, []);

  const monthNames = [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayNames = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];

  // Don't render anything until client-side
  if (!isClient || !currentMonth) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const daysInMonth = lastDayOfMonth.getDate();
  const daysArray = [];

  // Legg til tomme celler for dager før måneden starter
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }

  // Legg til alle dager i måneden
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
  }

  const goToPreviousMonth = () => {
    if (currentMonth) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      );
    }
  };

  const goToNextMonth = () => {
    if (currentMonth) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );
    }
  };

  const isDateDisabled = (date: Date) => {
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0; // Søndager er stengt
  };

  const isDateSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Forrige måned"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Neste måned"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Dag headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Kalender grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <button
                onClick={() => !isDateDisabled(date) && onDateChange(date)}
                disabled={isDateDisabled(date)}
                className={`
                  w-full h-full flex items-center justify-center text-sm rounded-lg transition-colors
                  ${
                    isDateDisabled(date)
                      ? "text-gray-300 cursor-not-allowed"
                      : isDateSelected(date)
                      ? "bg-pink-600 text-white"
                      : "text-gray-900 hover:bg-pink-100"
                  }
                `}
                aria-label={`${date.getDate()}. ${monthNames[date.getMonth()]}`}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-full h-full" aria-hidden="true"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Søndager er stengt</p>
        <p>Velg en dato for å se ledige tider</p>
      </div>
    </div>
  );
}
