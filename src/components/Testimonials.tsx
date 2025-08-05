"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Hansen",
    text: 'Behandlingen var "utrolig profesjonell". Jeg følte meg avslappet og godt ivaretatt. Anbefales!',
    rating: 5,
  },
  {
    name: "Elin Berg",
    text: "Fantastisk service! Jeg kommer definitivt tilbake. Følte meg ny etter massasjen.",
    rating: 5,
  },
  {
    name: "Kari Nilsen",
    text: "Jeg prøvde RF-løft for første gang og er imponert over resultatet. Profesjonelt og behagelig miljø.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-black mb-10">
          Kundeanmeldelser
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-gray-700"
            >
              <div className="flex mb-2">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="text-sm mb-4">{t.text}</p>
              <p className="font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
