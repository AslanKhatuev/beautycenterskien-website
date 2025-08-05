import { Star } from "lucide-react";

const reviews = [
  {
    name: "Emma L.",
    rating: 5,
    text: "Utrolig god massasjeopplevelse! Jeg følte meg avslappet og godt ivaretatt. Kommer definitivt tilbake.",
  },
  {
    name: "Nora M.",
    rating: 5,
    text: "Profesjonell service og hyggelig personale. Anbefales på det sterkeste!",
  },
  {
    name: "Sofie A.",
    rating: 4,
    text: "Flott sted med rolig atmosfære. Fikk god behandling og veiledning. Litt ventetid, men verdt det.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">
          Hva sier kundene våre?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={18} fill="#fbbf24" stroke="#fbbf24" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{review.text}"</p>
              <p className="font-semibold text-pink-600">– {review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
