"use client";

import { useState } from "react";

interface Props {
  date: Date;
  time: string;
}

export default function BookingForm({ date, time }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Bestilling sendt!\n\nNavn: ${formData.name}\nTid: ${time}`);
    // Send til backend her senere
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 bg-white rounded shadow-md max-w-lg mx-auto"
    >
      <h3 className="text-xl font-bold text-gray-800">
        Fyll ut din informasjon
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fullt navn
        </label>
        <input
          type="text"
          name="name"
          placeholder="Navn"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-post
        </label>
        <input
          type="email"
          name="email"
          placeholder="din@epost.no"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefon (norsk)
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="9-sifret mobilnummer"
          pattern="^(\+47|47)?[2-9]\d{7}$"
          title="Skriv inn et gyldig norsk telefonnummer"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition duration-200"
      >
        Book {time} – {date.toLocaleDateString("no-NO")}
      </button>
    </form>
  );
}
