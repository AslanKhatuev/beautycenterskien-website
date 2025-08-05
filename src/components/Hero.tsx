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
      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-300 to-white">
            Velkommen til Beauty Center
          </span>
          <span className="block text-lg sm:text-xl md:text-2xl font-light tracking-wide mt-3 text-white/90">
            Kosmetologi og Massasje
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 drop-shadow-md leading-relaxed">
          Skap balanse mellom kropp og sinn med profesjonelle behandlinger i
          rolige omgivelser.
        </p>

        <Link
          href="/booking"
          className="inline-block bg-pink-600 hover:bg-pink-700 transition px-6 py-3 rounded-lg text-base sm:text-lg font-semibold shadow-md"
        >
          Bestill time
        </Link>
      </div>
    </section>
  );
}
