"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Clock, CreditCard } from "lucide-react";

interface BookingFormProps {
  date: Date;
  time: string;
  onBookingSuccess: (details: any) => void;
}

// Tilgjengelige tjenester
const serviceCategories = [
  {
    category: "Massasje",
    services: [
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
        id: "ansikts-hals-dekollete-massasje",
        name: "Ansikts-, hals- og dekolletémassasje",
        price: 650,
      },
      { id: "handmassasje", name: "Håndmassasje med omsorg", price: 550 },
      { id: "fotmassasje", name: "Fotmassasje med omsorg", price: 550 },
    ],
  },
  {
    category: "Kosmetologi & Apparatbehandlinger",
    services: [
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
        id: "vakuummassasje-hele-kroppen",
        name: "Vakuummassasje – Hele kroppen",
        price: 1000,
      },
      {
        id: "vakuummassasje-rf-hele-kroppen",
        name: "Vakuummassasje med RF – Hele kroppen",
        price: 1200,
      },
    ],
  },
  {
    category: "Hudpleie og andre behandlinger",
    services: [
      { id: "ansiktsrens", name: "Ansiktsrens", price: 1000 },
      {
        id: "peeling-biorevitaliserende",
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
        id: "hudpleie-ansikt-hals-dekollete-hender",
        name: "Hudpleie for ansikt, hals, dekolletasje og hender",
        price: 1200,
      },
      {
        id: "apparatkosmetologi-rf-lofting",
        name: "Apparatkosmetologi (RF-løfting)",
        price: 1000,
      },
      {
        id: "kavitasjon-fettfjerning",
        name: "Kavitasjon (fjerning av fettansamlinger)",
        price: 1000,
      },
      {
        id: "mikrostromterapi-serum",
        name: "Mikrostrømterapi + serum",
        price: 1300,
      },
      {
        id: "behandling-hartap-flass",
        name: "Behandlinger mot hårtap/flass/fet hodebunn",
        price: 1000,
      },
      { id: "konsultasjon", name: "Konsultasjon (20 min)", price: 300 },
    ],
  },
];

// Flat liste av alle tjenester for enkel søking
const allServices = serviceCategories.flatMap((cat) => cat.services);

export default function BookingForm({
  date,
  time,
  onBookingSuccess,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    serviceName: "",
    price: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "serviceId") {
      const selectedService = allServices.find((s) => s.id === value);
      setFormData((prev) => ({
        ...prev,
        serviceId: value,
        serviceName: selectedService?.name || "",
        price: selectedService?.price || 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Navn er påkrevd";
    } else if (formData.name.length < 2) {
      newErrors.name = "Navn må være minst 2 tegn";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-post er påkrevd";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ugyldig e-postadresse";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefonnummer er påkrevd";
    } else if (!/^\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Telefonnummer må være 8 siffer";
    }

    if (!formData.serviceId) {
      newErrors.serviceId = "Velg en tjeneste";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // FIX: Bruk lokal tidssone for dato
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const bookingData = {
        ...formData,
        date: dateString,
        time: time,
      };

      const response = await fetch("/api/contact/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      // Success!
      onBookingSuccess({
        ...formData,
        date,
        time,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        serviceId: "",
        serviceName: "",
        price: 0,
      });
    } catch (error) {
      alert(
        `Booking feilet: ${
          error instanceof Error ? error.message : "Ukjent feil"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    if (!isClient) return "";

    return date.toLocaleDateString("no-NO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const selectedService = allServices.find((s) => s.id === formData.serviceId);

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-40"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Bestill time</h3>

      {/* Booking oversikt */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-pink-900 mb-2">📋 Din booking:</h4>
        <div className="space-y-1 text-sm text-black">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{time}</span>
          </div>
          {selectedService && (
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" aria-hidden="true" />
              <span>
                {selectedService.name} - {selectedService.price} NOK
              </span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tjeneste - først */}
        <div>
          <label
            htmlFor="serviceId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Velg behandling *
          </label>
          <select
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-black ${
              errors.serviceId ? "border-red-500" : "border-gray-300"
            }`}
            style={{ color: "black" }}
            aria-invalid={errors.serviceId ? "true" : "false"}
            aria-describedby={errors.serviceId ? "service-error" : undefined}
          >
            <option value="">Velg behandling...</option>
            {serviceCategories.map((category) => (
              <optgroup key={category.category} label={category.category}>
                {category.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price} NOK
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.serviceId && (
            <p
              id="service-error"
              className="text-red-500 text-xs mt-1"
              role="alert"
            >
              {errors.serviceId}
            </p>
          )}
        </div>

        {/* Navn */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <User className="w-4 h-4 inline mr-1" aria-hidden="true" />
            Fullt navn *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-black ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            style={{ color: "black" }}
            placeholder="Skriv inn ditt fulle navn"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-red-500 text-xs mt-1"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* E-post */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <Mail className="w-4 h-4 inline mr-1" aria-hidden="true" />
            E-postadresse *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-black ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            style={{ color: "black" }}
            placeholder="din@email.no"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-red-500 text-xs mt-1"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Telefon */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <Phone className="w-4 h-4 inline mr-1" aria-hidden="true" />
            Telefonnummer *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-black ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            style={{ color: "black" }}
            placeholder="12345678"
            maxLength={8}
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p
              id="phone-error"
              className="text-red-500 text-xs mt-1"
              role="alert"
            >
              {errors.phone}
            </p>
          )}
        </div>

        {/* Submit knapp */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700 text-white"
          }`}
          aria-disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div
                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                aria-hidden="true"
              ></div>
              Bestiller...
            </div>
          ) : (
            `Bestill time${
              selectedService ? ` - ${selectedService.price} NOK` : ""
            }`
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>* Påkrevde felt</p>
        <p>Du vil motta en e-post bekreftelse etter booking.</p>
      </div>
    </div>
  );
}
