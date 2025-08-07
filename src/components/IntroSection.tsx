// components/IntroSection.tsx
"use client";

import Image from "next/image";

export default function IntroSection() {
  return (
    <section className="bg-white py-16 px-6 sm:px-10 lg:px-20 text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Tekst */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-pink-600 mb-6">
            Et fristed for ro, velvære og skjønnhet
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            Hos <strong>Beauty Center Skien</strong> handler alt om velvære. Vi
            kombinerer profesjonell massasjeterapi med moderne
            skjønnhetsbehandlinger, tilpasset dine behov. Enten du trenger
            avslapning, smertebehandling eller hudpleie – er du i trygge hender
            hos oss.
          </p>
          <p className="text-lg text-gray-700">
            Velkommen til en moderne og fredelig klinikk i hjertet av Skien – du
            finner oss i 4. etasje på Arkaden. Hos oss står ditt velvære og din
            opplevelse i fokus.
          </p>
        </div>

        {/* Bilde */}
        <div className="flex justify-center">
          <Image
            src="/arkaden.jpg"
            alt="Arkaden"
            width={500}
            height={400}
            className="rounded-xl shadow-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
