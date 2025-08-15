"use client";

import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Hudpleie",
    image: "/hudpleie2.jpg",
    description: "Profesjonell hudpleie for glødende og sunn hud.",
  },
  {
    title: "Massasje",
    image: "/massasje.avif",
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
    <section className="py-16 bg-gray-50 text-black">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Våre behandlinger</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href="/booking"
              className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 hover:bg-pink-50 transition duration-300 p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4 w-[130px] h-[130px] relative overflow-hidden rounded-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/tjenester"
          className="inline-block mt-10 bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700 transition"
        >
          Se alle våre tjenester
        </Link>
      </div>
    </section>
  );
}
