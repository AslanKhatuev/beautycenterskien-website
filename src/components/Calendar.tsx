"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  onError?: (message: string) => void; // Ny prop for feilhåndtering
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateChange,
  onError,
}) => {
  // Funksjon for å sjekke om en dato kan velges
  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate >= today;
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    // Sjekk om datoen er i fortiden
    if (!isDateSelectable(date)) {
      // Kall onError callback hvis den eksisterer
      if (onError) {
        onError("Kan ikke booke tid i fortiden.");
      }
      return; // Ikke oppdater datoen
    }

    // Dato er gyldig, oppdater
    onDateChange(date);
  };

  return (
    <div className="flex justify-center p-4">
      <div className="rounded-xl shadow-lg p-4 bg-white border border-gray-200">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd.MM.yyyy"
          inline
          minDate={new Date()}
          calendarClassName="!border-0 !shadow-none"
          wrapperClassName="w-full"
        />
      </div>
    </div>
  );
};

export default Calendar;
