"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar";
import AvailableTimes from "@/components/AvailableTimes";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleBookingSuccess = (details: any) => {
    console.log("SUCCESS CALLBACK RECEIVED:", details);
    setBookingDetails(details);
    setShowModal(true);
    setSelectedTime(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Bestill time
        </h1>

        {/* Kalender */}
        <div className="mb-8">
          <Calendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Ledige tider */}
        {selectedDate && (
          <div className="mb-8">
            <AvailableTimes
              key={`${selectedDate.toISOString()}-${refreshKey}`}
              date={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />
          </div>
        )}

        {/* Booking-skjema */}
        {selectedDate && selectedTime && (
          <div className="mb-8">
            <BookingForm
              date={selectedDate}
              time={selectedTime}
              onBookingSuccess={handleBookingSuccess}
            />
          </div>
        )}

        {/* Info-seksjoner */}
        {!selectedDate && (
          <div className="text-center text-white mt-12">
            <p className="text-lg">Velg en dato for å se ledige tider</p>
          </div>
        )}

        {selectedDate && !selectedTime && (
          <div className="text-center text-white mt-8">
            <p>Velg en tid for å fortsette med booking</p>
          </div>
        )}
      </div>

      {/* MODAL MED SVART TEKST */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
          style={{ zIndex: 999999 }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Success ikon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Booking bekreftet! 🌸
              </h2>

              <p className="text-gray-700 mb-6">
                Din timebestilling har blitt mottatt og bekreftet.
              </p>

              {bookingDetails && (
                <div className="mb-6 text-left bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="font-bold text-pink-800 mb-3">
                    📋 Dine detaljer:
                  </h3>
                  <div className="space-y-2 text-gray-800">
                    <p>
                      <span className="font-semibold text-gray-900">
                        Behandling:
                      </span>{" "}
                      {bookingDetails.serviceName}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Dato:</span>{" "}
                      {bookingDetails.date.toLocaleDateString("no-NO", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Tid:</span>{" "}
                      {bookingDetails.time}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Pris:</span>{" "}
                      {bookingDetails.price} NOK
                    </p>
                  </div>
                </div>
              )}

              {/* E-post info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-800 mb-1">
                      📧 E-post bekreftelse sendt!
                    </p>
                    <p className="text-blue-700">
                      Sjekk innboksen din (og spam-mappen) for bekreftelse.
                    </p>
                  </div>
                </div>
              </div>

              {/* Knapper */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedTime(null);
                    setRefreshKey((prev) => prev + 1);
                  }}
                  className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition duration-200 font-semibold"
                >
                  🗓️ Book ny tid
                </button>

                <button
                  onClick={() => {
                    setShowModal(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                >
                  ⬆️ Tilbake til toppen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
