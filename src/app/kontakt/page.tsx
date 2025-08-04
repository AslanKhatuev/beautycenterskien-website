"use client";

import { useState } from "react";

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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateTelefon = (telefon: string) => {
    const re = /^(\+47)?\s?\d{8}$/;
    return re.test(telefon);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.epost)) {
      setError("Ugyldig e-postadresse.");
      return;
    }

    if (!validateTelefon(formData.telefon)) {
      setError("Telefonnummer må være et gyldig norsk nummer.");
      return;
    }

    setError("");
    setIsSubmitted(true);
    console.log("Skjemadata:", formData);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        Kontakt oss
      </h1>

      {/* Kontaktinfo */}
      <div className="mb-10 text-center space-y-2 text-gray-700 text-base sm:text-lg">
        <p>
          <strong>Adresse:</strong> Klostergata 12, 3732 Skien
        </p>
        <p>
          <strong>Telefon:</strong>{" "}
          <a href="tel:+4741234567" className="text-pink-600 hover:underline">
            +47 412 34 567
          </a>
        </p>
        <p>
          <strong>E-post:</strong>{" "}
          <a
            href="mailto:kontakt@beautycenterskien.no"
            className="text-pink-600 hover:underline"
          >
            kontakt@beautycenterskien.no
          </a>
        </p>
      </div>

      {/* Skjema */}
      {isSubmitted ? (
        <p className="text-green-600 text-center text-lg">
          Takk for din henvendelse!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-pink-50 p-6 shadow-md rounded-lg"
        >
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label htmlFor="navn" className="block text-sm font-medium">
              Navn
            </label>
            <input
              type="text"
              id="navn"
              name="navn"
              required
              value={formData.navn}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label htmlFor="epost" className="block text-sm font-medium">
              E-post
            </label>
            <input
              type="email"
              id="epost"
              name="epost"
              required
              value={formData.epost}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label htmlFor="telefon" className="block text-sm font-medium">
              Telefonnummer
            </label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              required
              value={formData.telefon}
              onChange={handleChange}
              placeholder="f.eks. 41234567 eller +4741234567"
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label htmlFor="melding" className="block text-sm font-medium">
              Melding
            </label>
            <textarea
              id="melding"
              name="melding"
              required
              value={formData.melding}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition text-lg"
          >
            Send melding
          </button>
        </form>
      )}
    </section>
  );
}
