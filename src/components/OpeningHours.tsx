export default function OpeningHours() {
  const hours = [
    { day: "Mandag", time: "09:00 – 19:00" },
    { day: "Tirsdag", time: "09:00 – 19:00" },
    { day: "Onsdag", time: "09:00 – 19:00" },
    { day: "Torsdag", time: "09:00 – 19:00" },
    { day: "Fredag", time: "09:00 – 19:00" },
    { day: "Lørdag", time: "09:00 – 15:00" },
    { day: "Søndag", time: "Stengt" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          Våre åpningstider
        </h2>
        <ul className="divide-y border rounded-lg overflow-hidden shadow">
          {hours.map((entry, index) => (
            <li
              key={index}
              className="flex justify-between px-4 py-3 text-gray-700 bg-gray-50 even:bg-white"
            >
              <span>{entry.day}</span>
              <span>{entry.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
