"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center bg-black overflow-hidden">
      {/* Bakgrunnsvideo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
      >
        <source src="/video1.mp4" type="video/mp4" />
        Din nettleser støtter ikke video.
      </video>

      {/* Tekstinnhold */}
      <div className="relative z-10 text-center text-white px-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Velkommen til Beauty Center – Kosmetologi og Massasje
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Skap balanse mellom kropp og sinn med profesjonelle behandlinger i
          rolige omgivelser.
        </p>
        <Link
          href="/booking"
          className="inline-block bg-pink-600 hover:bg-pink-700 transition px-6 py-3 rounded text-lg font-semibold"
        >
          Bestill time
        </Link>
      </div>
    </section>
  );
}
