"use client";

import { useState } from "react";
import {
  validateEmail,
  validateTelefon,
  validateMelding,
} from "@/utils/contactValidation";

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    navn: "",
    epost: "",
    telefon: "",
    melding: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validering
    if (!validateEmail(formData.epost)) {
      setError("Ugyldig e-postadresse.");
      return;
    }

    if (!validateTelefon(formData.telefon)) {
      setError("Telefonnummer må være 8 siffer (f.eks. 96809506).");
      return;
    }

    if (!validateMelding(formData.melding)) {
      setError("Meldingen må være mellom 10 og 256 tegn.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setError("");
        setIsSubmitted(true);
        setFormData({
          navn: "",
          epost: "",
          telefon: "",
          melding: "",
        });
      } else {
        const message = await res.text();
        setError(message || "Noe gikk galt. Prøv igjen senere.");
      }
    } catch (err) {
      console.error("Feil ved sending:", err);
      setError("Det oppsto en feil. Vennligst prøv igjen.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-10">
        Kontakt oss
      </h1>

      {/* Kontaktinfo */}
      <div className="mb-12 text-center space-y-2 text-pink-600 text-lg">
        <p>
          <strong>Adresse:</strong> Bruene 1, 3725 Skien <br />
          <span className="block sm:inline">
            <strong>Lokasjon:</strong> Arkaden 4.etg (Legesenter)
          </span>
        </p>
        <p>
          <strong>Telefon:</strong>{" "}
          <a
            href="tel:+4796809506"
            className="text-pink-600 hover:text-pink-400 hover:underline transition"
          >
            968 09 506
          </a>
        </p>
        <p>
          <strong>E-post:</strong>{" "}
          <a
            href="mailto:massagevika24@gmail.com"
            className="text-pink-600 hover:text-pink-400 hover:underline transition"
          >
            massagevika24@gmail.com
          </a>
        </p>
      </div>

      {/* Skjema */}
      {isSubmitted ? (
        <p className="text-green-600 text-center text-xl font-medium">
          ✅ Takk for din henvendelse! Vi tar kontakt så snart vi kan.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-pink-100"
        >
          {error && (
            <p className="text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="navn"
              className="block text-sm font-semibold text-gray-700"
            >
              Navn
            </label>
            <input
              type="text"
              id="navn"
              name="navn"
              required
              value={formData.navn}
              onChange={handleChange}
              className="w-full mt-2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-black"
            />
          </div>

          <div>
            <label
              htmlFor="epost"
              className="block text-sm font-semibold text-gray-700"
            >
              E-post
            </label>
            <input
              type="email"
              id="epost"
              name="epost"
              required
              value={formData.epost}
              onChange={handleChange}
              className="w-full mt-2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-black"
            />
          </div>

          <div>
            <label
              htmlFor="telefon"
              className="block text-sm font-semibold text-gray-700"
            >
              Telefonnummer
            </label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              required
              value={formData.telefon}
              onChange={handleChange}
              placeholder="f.eks. 96809506"
              className="w-full mt-2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-black"
            />
          </div>

          <div>
            <label
              htmlFor="melding"
              className="block text-sm font-semibold text-gray-700"
            >
              Melding
            </label>
            <textarea
              id="melding"
              name="melding"
              required
              maxLength={256}
              value={formData.melding}
              onChange={handleChange}
              rows={5}
              className={`w-full mt-2 border p-3 rounded-lg text-black focus:outline-none focus:ring-2 transition ${
                formData.melding.length < 10
                  ? "border-red-400 focus:ring-red-400"
                  : "border-green-400 focus:ring-green-400"
              }`}
            ></textarea>
            <p
              className={`text-sm mt-1 text-right ${
                formData.melding.length < 10 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formData.melding.length} / 256
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold text-lg transition shadow-md hover:shadow-lg"
          >
            Send melding
          </button>
        </form>
      )}
    </section>
  );
}
