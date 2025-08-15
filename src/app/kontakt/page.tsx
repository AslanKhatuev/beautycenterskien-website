"use client";

import { useState } from "react";
import { z } from "zod";

// Zod validering schema
const contactFormSchema = z.object({
  navn: z
    .string()
    .min(2, "Navn må være minst 2 tegn")
    .max(100, "Navn kan ikke være lengre enn 100 tegn")
    .regex(/^[a-zA-ZæøåÆØÅ\s\-\.]+$/, "Navn kan kun inneholde bokstaver"),

  epost: z
    .string()
    .email("Ugyldig e-postadresse")
    .max(100, "E-post kan ikke være lengre enn 100 tegn"),

  telefon: z
    .string()
    .regex(/^\d{8}$/, "Telefonnummer må være nøyaktig 8 siffer"),

  melding: z
    .string()
    .min(10, "Melding må være minst 10 tegn")
    .max(2000, "Melding kan ikke være lengre enn 2000 tegn"),
});

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    navn: "",
    epost: "",
    telefon: "",
    melding: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Fjern feilmelding når bruker begynner å skrive
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Frontend validering med Zod
    const validationResult = contactFormSchema.safeParse({
      navn: formData.navn.trim(),
      epost: formData.epost.trim(),
      telefon: formData.telefon.trim(),
      melding: formData.melding.trim(),
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      setError(firstError.message);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.navn.trim(),
          email: formData.epost.trim().toLowerCase(),
          phone: formData.telefon.trim(),
          subject: "Henvendelse fra nettsiden",
          message: formData.melding.trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        const retryAfter = data.retryAfter || 3600; // Default 1 time
        const minutes = Math.ceil(retryAfter / 60);
        setError(
          `For mange meldinger sendt. Prøv igjen om ${minutes} minutter.`
        );
        setIsSubmitting(false);
        return;
      }

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
        // Vis detaljerte feilmeldinger fra backend
        if (data.details && Array.isArray(data.details)) {
          const errorMessages = data.details
            .map((detail: any) => detail.message)
            .join(", ");
          setError(errorMessages);
        } else {
          setError(data.error || "Noe gikk galt. Prøv igjen senere.");
        }
      }
    } catch (err) {
      console.error("Feil ved sending:", err);
      setError("Det oppsto en feil. Vennligst prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-10">
        Kontakt oss
      </h1>

      {/* Kontaktinfo */}
      <div className="mb-12 bg-gray-100 rounded-lg p-6 text-gray-800 text-lg leading-relaxed font-medium shadow-md">
        <p className="mb-4">
          <strong>Adresse:</strong> Bruene 1, 3725 Skien <br />
          <span className="block sm:inline">
            <strong>Lokasjon:</strong> Arkaden 4.etg (Legesenter)
          </span>
        </p>
        <p className="mb-2">
          <strong>Telefon:</strong>{" "}
          <a
            href="tel:+4796809506"
            className="text-pink-600 hover:text-pink-500 hover:underline transition"
          >
            968 09 506
          </a>
        </p>
        <p>
          <strong>E-post:</strong>{" "}
          <a
            href="mailto:massagevika24@gmail.com"
            className="text-pink-600 hover:text-pink-500 hover:underline transition"
          >
            massagevika24@gmail.com
          </a>
        </p>
      </div>

      {/* Skjema */}
      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-green-800 text-xl font-bold mb-2">
            Melding sendt!
          </h2>
          <p className="text-green-700">
            Takk for din henvendelse! Vi tar kontakt så snart vi kan.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ navn: "", epost: "", telefon: "", melding: "" });
            }}
            className="mt-4 text-pink-600 hover:text-pink-500 underline"
          >
            Send ny melding
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-pink-100"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium text-center">
                {error}
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="navn"
              className="block text-sm font-semibold text-gray-700"
            >
              Navn *
            </label>
            <input
              type="text"
              id="navn"
              name="navn"
              required
              maxLength={100}
              value={formData.navn}
              onChange={handleChange}
              className="w-full mt-2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-black"
              placeholder="Ditt fulle navn"
            />
          </div>

          <div>
            <label
              htmlFor="epost"
              className="block text-sm font-semibold text-gray-700"
            >
              E-post *
            </label>
            <input
              type="email"
              id="epost"
              name="epost"
              required
              maxLength={100}
              value={formData.epost}
              onChange={handleChange}
              className="w-full mt-2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-black"
              placeholder="din@epost.no"
            />
          </div>

          <div>
            <label
              htmlFor="telefon"
              className="block text-sm font-semibold text-gray-700"
            >
              Telefonnummer *
            </label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              required
              maxLength={8}
              pattern="^\d{8}$"
              value={formData.telefon}
              onChange={handleChange}
              placeholder="96809506"
              className="w-full mt-2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-black"
            />
            <p className="text-xs text-gray-600 mt-1">
              8 siffer uten mellomrom eller bindestrek
            </p>
          </div>

          <div>
            <label
              htmlFor="melding"
              className="block text-sm font-semibold text-gray-700"
            >
              Melding *
            </label>
            <textarea
              id="melding"
              name="melding"
              required
              maxLength={2000}
              minLength={10}
              value={formData.melding}
              onChange={handleChange}
              rows={5}
              className={`w-full mt-2 border p-3 rounded-lg text-black focus:outline-none focus:ring-2 transition ${
                formData.melding.length < 10
                  ? "border-red-400 focus:ring-red-400"
                  : formData.melding.length > 1900
                  ? "border-yellow-400 focus:ring-yellow-400"
                  : "border-green-400 focus:ring-green-400"
              }`}
              placeholder="Skriv din melding her..."
            ></textarea>
            <p
              className={`text-sm mt-1 text-right ${
                formData.melding.length < 10
                  ? "text-red-600"
                  : formData.melding.length > 1900
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {formData.melding.length} / 2000
              {formData.melding.length < 10 && " (minimum 10 tegn)"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || formData.melding.length < 10}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-lg transition shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sender...
              </span>
            ) : (
              "Send melding"
            )}
          </button>
        </form>
      )}
    </section>
  );
}
