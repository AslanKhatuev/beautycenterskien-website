// app/about/page.tsx

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Velkommen til Beauty Center Skien
        </h1>

        <div className="border-b border-pink-500 w-24 mx-auto mb-12" />

        <div className="space-y-16 text-base md:text-lg leading-relaxed text-gray-200">
          <p className="text-center">
            Her blir omsorg til kunst, og berøring en kilde til helse og
            skjønnhet.
          </p>

          {/* Viktoria */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src="/vika.jpg"
              alt="Viktoria"
              width={200}
              height={200}
              className="rounded-xl shadow-lg object-cover"
            />
            <p>
              <span role="img" aria-label="massasje">
                
              </span>{" "}
              <strong className="text-white">Viktoriia</strong> – utdannet
              massasjeterapeut med erfaring og intuisjon. Hendene mine vet hvor
              det gjør vondt, hvor trettheten sitter, og hvor spenningene har
              samlet seg – og hvordan man løser det. Jeg spesialiserer meg på
              lymfedrenasje, anti-cellulitt- og avslappende massasjer, samt dyp
              muskelbehandling og stresspunkter. For meg er massasje mer enn
              bare en behandling – det er en måte å hjelpe kroppen til å huske
              følelsen av letthet.
            </p>
          </div>

          {/* Natalia */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src="/mama.jpg"
              alt="Natalia"
              width={200}
              height={200}
              className="rounded-xl shadow-lg object-cover"
            />
            <p>
              <span role="img" aria-label="kosmetolog">
                
              </span>{" "}
              <strong className="text-white">Nataliia</strong> – kosmetolog med
              magiske hender og et varmt hjerte. Over 20 år i yrket og tusenvis
              av takknemlige kunder. Jeg jobber med huden skånsomt, bevisst og
              effektivt. Rens, pleie, løft, anti-aldringsprosedyrer – alt
              tilpasses individuelt og gjøres med kjærlighet. Skjønnhet begynner
              med omsorg, og jeg gjør den tilgjengelig.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
