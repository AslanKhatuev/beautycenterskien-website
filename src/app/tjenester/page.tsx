// src/app/tjenester/page.tsx
export default function TjenesterPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Våre Tjenester</h1>

      {/* Seksjon 1 – Massasje */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Massasje</h2>
        <ul className="space-y-2 text-gray-700">
          <li>Klassisk massasje – 750 NOK</li>
          <li>Terapeutisk massasje – 850 NOK</li>
          <li>Sportsmassasje – 800 NOK</li>
          <li>Lymfedrenasje massasje – 900 NOK</li>
          <li>Anti-cellulitt massasje – 1000 NOK</li>
          <li>Ansikts-, hals- og dekolletémassasje – 650 NOK</li>
          <li>Håndmassasje med omsorg – 550 NOK</li>
          <li>Fotmassasje med omsorg – 550 NOK</li>
        </ul>
      </section>

      {/* Seksjon 2 – Kosmetologi og apparatbehandlinger */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Kosmetologi & Apparatbehandlinger
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>Kavitasjon (ultralyd), 1 område – 1000 NOK</li>
          <li>RF Løft (radiofrekvens), 1 område – 1000 NOK</li>
          <li>Vakuummassasje – Hele kroppen – 1000 NOK</li>
          <li>Vakuummassasje med RF – Hele kroppen – 1200 NOK</li>
        </ul>
      </section>

      {/* Seksjon 3 – Hudpleie og andre tjenester */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Hudpleie og andre behandlinger
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>Ansiktsrens – 1000 NOK</li>
          <li>Peeling + biorevitaliserende middel – 1200 NOK</li>
          <li>Peeling + mesokocktail – 1500 NOK</li>
          <li>Fraksjonell mesoterapi – 1700 NOK</li>
          <li>Hudpleie for ansikt, hals, dekolletasje og hender – 1200 NOK</li>
          <li>Apparatkosmetologi (RF-løfting) – 1000 NOK</li>
          <li>Kavitasjon (fjerning av fettansamlinger) – 1000 NOK</li>
          <li>Mikrostrømterapi + serum – 1300 NOK</li>
          <li>Behandlinger mot hårtap/flass/fet hodebunn – 1000 NOK</li>
          <li>Konsultasjon (20 min) – 300 NOK</li>
        </ul>
      </section>
    </main>
  );
}
