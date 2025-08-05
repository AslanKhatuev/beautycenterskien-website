// components/LandingServices.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Hudpleie",
    image: "/icons/skin-care.png", // Du kan bruke egne bilder eller ikoner
    description: "Profesjonell hudpleie for glødende og sunn hud.",
  },
  {
    title: "Massasje",
    image: "/icons/massage.png",
    description: "Avslappende og dyp massasje for kropp og sjel.",
  },
  {
    title: "RF-løft",
    image: "/vika.jpg",
    description: "Oppstrammende behandling med radiofrekvens.",
  },
];

export default function LandingServices() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Våre behandlinger</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
            >
              <Image
                src={service.image}
                alt={service.title}
                width={60}
                height={60}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>

        <Link
          href="/tjenester"
          className="inline-block mt-10 bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700 transition"
        >
          Se alle behandlinger
        </Link>
      </div>
    </section>
  );
}
