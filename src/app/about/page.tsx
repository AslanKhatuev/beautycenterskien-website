// app/about/page.tsx

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Velkommen til Beauty Center Skien
        </h1>

        <div className="border-b border-pink-500 w-24 mx-auto mb-12" />

        <div className="space-y-8 text-base md:text-lg leading-relaxed text-gray-200">
          <p>
            Her blir omsorg til kunst, og berøring en kilde til helse og
            skjønnhet.
          </p>

          <p>
            Her møter du <strong className="text-white">Viktoria</strong> og{" "}
            <strong className="text-white">Natalia</strong>. To kvinner, to
            fagpersoner, to hjerter som jobber i harmoni for at du skal føle deg
            fantastisk – både på utsiden og innsiden.
          </p>

          <div className="space-y-6">
            <p>
              <span role="img" aria-label="massasje">
                💆‍♀️
              </span>{" "}
              <strong className="text-white">Viktoria</strong> – utdannet
              massasjeterapeut med erfaring og intuisjon. Hendene mine vet hvor
              det gjør vondt, hvor trettheten sitter, og hvor spenningene har
              samlet seg – og hvordan man løser det. Jeg spesialiserer meg på
              lymfedrenasje, anti-cellulitt- og avslappende massasjer, samt dyp
              muskelbehandling og stresspunkter. For meg er massasje mer enn
              bare en behandling – det er en måte å hjelpe kroppen til å huske
              følelsen av letthet.
            </p>

            <p>
              <span role="img" aria-label="kosmetolog">
                💄
              </span>{" "}
              <strong className="text-white">Natalia</strong> – kosmetolog med
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
