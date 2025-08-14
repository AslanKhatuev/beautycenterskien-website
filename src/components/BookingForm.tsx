"use client";

import { useMemo, useState } from "react";

interface Props {
  date: Date;
  time: string;
  onBookingSuccess?: (details: {
    serviceName: string;
    date: Date;
    time: string;
    price: number;
  }) => void;
}

type ServiceItem = { id: string; name: string; price: number };
type ServiceGroup = { group: string; items: ServiceItem[] };

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    group: "Massasje",
    items: [
      { id: "klassisk-massasje", name: "Klassisk massasje", price: 750 },
      { id: "terapeutisk-massasje", name: "Terapeutisk massasje", price: 850 },
      { id: "sportsmassasje", name: "Sportsmassasje", price: 800 },
      {
        id: "lymfedrenasje-massasje",
        name: "Lymfedrenasje massasje",
        price: 900,
      },
      {
        id: "anti-cellulitt-massasje",
        name: "Anti-cellulitt massasje",
        price: 1000,
      },
      {
        id: "ansikt-hals-dekollete",
        name: "Ansikt-, hals- og dekolletémassasje",
        price: 650,
      },
      { id: "handmassasje", name: "Håndmassasje med omsorg", price: 550 },
      { id: "fotmassasje", name: "Fotmassasje med omsorg", price: 550 },
    ],
  },
  {
    group: "Kosmetologi & apparatbehandlinger",
    items: [
      {
        id: "kavitasjon-1-omrade",
        name: "Kavitasjon (ultralyd), 1 område",
        price: 1000,
      },
      {
        id: "rf-loft-1-omrade",
        name: "RF Løft (radiofrekvens), 1 område",
        price: 1000,
      },
      {
        id: "vakuummassasje-hel-kropp",
        name: "Vakuummassasje – Hele kroppen",
        price: 1000,
      },
      {
        id: "vakuummassasje-rf-hel-kropp",
        name: "Vakuummassasje med RF – Hele kroppen",
        price: 1200,
      },
    ],
  },
  {
    group: "Hudpleie og andre behandlinger",
    items: [
      { id: "ansiktsrens", name: "Ansiktsrens", price: 1000 },
      {
        id: "peeling-biorevitalisering",
        name: "Peeling + biorevitaliserende middel",
        price: 1200,
      },
      {
        id: "peeling-mesokocktail",
        name: "Peeling + mesokocktail",
        price: 1500,
      },
      {
        id: "fraksjonell-mesoterapi",
        name: "Fraksjonell mesoterapi",
        price: 1700,
      },
      {
        id: "hudpleie-ansikt-hals-dekolletasje-hender",
        name: "Hudpleie for ansikt, hals, dekolletasje og hender",
        price: 1200,
      },
      {
        id: "apparatkosmetologi-rf",
        name: "Apparatkosmetologi (RF-løfting)",
        price: 1000,
      },
      {
        id: "kavitasjon-fett",
        name: "Kavitasjon (fjerning av fettansamlinger)",
        price: 1000,
      },
      { id: "mikrostrom-serum", name: "Mikrostrømterapi + serum", price: 1300 },
      {
        id: "harhodebunn-behandling",
        name: "Behandling mot hårtap/flass/fet hodebunn",
        price: 1000,
      },
      { id: "konsultasjon-20", name: "Konsultasjon (20 min)", price: 300 },
    ],
  },
];

export default function BookingForm({ date, time, onBookingSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allServices = useMemo<ServiceItem[]>(
    () => SERVICE_GROUPS.flatMap((g) => g.items),
    []
  );

  const selectedService = useMemo(
    () => allServices.find((s) => s.id === formData.serviceId),
    [allServices, formData.serviceId]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedService) {
      setError("Velg behandling før du fortsetter.");
      return;
    }

    // Validate Norwegian phone number (8 digits)
    if (!/^\d{8}$/.test(formData.phone)) {
      setError("Telefonnummer må være 8 siffer.");
      return;
    }

    setSubmitting(true);

    try {
      console.log("Sending booking request...");

      const response = await fetch("/api/contact/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          serviceId: formData.serviceId,
          serviceName: selectedService.name,
          price: selectedService.price,
          date: date.toISOString().slice(0, 10),
          time,
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.status === 409) {
        setError(
          "Beklager, tiden ble nettopp booket av noen andre. Velg en annen tid."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Kunne ikke fullføre booking");
      }

      // Success - kall parent med detaljer!
      console.log("🎉 Booking successful! Calling parent...");

      // Call callback to show modal in parent
      if (onBookingSuccess) {
        onBookingSuccess({
          serviceName: selectedService.name,
          date: date,
          time: time,
          price: selectedService.price,
        });
      }

      setFormData({ name: "", email: "", phone: "", serviceId: "" });
    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "En ukjent feil oppstod";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 bg-white rounded shadow-md max-w-lg mx-auto text-black"
    >
      <h3 className="text-xl font-bold text-black">Fyll ut din informasjon</h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Behandling */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Velg behandling *
        </label>
        <select
          name="serviceId"
          required
          value={formData.serviceId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
        >
          <option value="" disabled>
            — Velg behandling —
          </option>
          {SERVICE_GROUPS.map((group) => (
            <optgroup key={group.group} label={group.group}>
              {group.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.price} NOK
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {selectedService && (
          <p className="text-sm text-gray-800 mt-1">
            Pris:{" "}
            <span className="font-medium">{selectedService.price} NOK</span>
          </p>
        )}
      </div>

      {/* Navn */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Fullt navn *
        </label>
        <input
          type="text"
          name="name"
          placeholder="Ola Nordmann"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
        />
      </div>

      {/* E-post */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          E-post *
        </label>
        <input
          type="email"
          name="email"
          placeholder="ola@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          maxLength={100}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
        />
      </div>

      {/* Telefon */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Telefon (8 siffer) *
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="12345678"
          pattern="^\d{8}$"
          title="Skriv inn et gyldig norsk telefonnummer (8 siffer)"
          value={formData.phone}
          onChange={handleChange}
          required
          maxLength={8}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
        />
        <p className="text-xs text-gray-600 mt-1">
          Kun norske telefonnummer (8 siffer)
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
      >
        {submitting ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Sender...
          </span>
        ) : (
          `Book ${
            selectedService ? selectedService.name + " – " : ""
          }${time} – ${date.toLocaleDateString("no-NO")}`
        )}
      </button>
    </form>
  );
}
