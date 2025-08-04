"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div className="flex justify-center p-4">
      <div className="rounded-xl shadow-lg p-4 bg-white border border-gray-200">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) onDateChange(date);
          }}
          dateFormat="dd.MM.yyyy"
          inline
          calendarClassName="!bg-white !rounded-lg !shadow-md p-2"
          dayClassName={(date) =>
            "text-sm hover:bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center" +
            (selectedDate?.toDateString() === date.toDateString()
              ? " bg-pink-500 text-white"
              : "")
          }
        />
      </div>
    </div>
  );
};

export default Calendar;
