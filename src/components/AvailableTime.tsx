interface AvailableTimesProps {
  date: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

// Funksjon for å generere tider mellom start og slutt
function generateTimeSlots(start: number, end: number): string[] {
  const slots: string[] = [];
  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
}

// Hovedkomponent
export default function AvailableTimes({
  date,
  selectedTime,
  onSelectTime,
}: AvailableTimesProps) {
  const day = date.getDay(); // 0 = søndag, 1 = mandag, ..., 6 = lørdag

  let timeSlots: string[] = [];

  if (day >= 1 && day <= 5) {
    // Mandag–Fredag: 09:00–19:00
    timeSlots = generateTimeSlots(9, 19);
  } else if (day === 6) {
    // Lørdag: 09:00–15:00
    timeSlots = generateTimeSlots(9, 15);
  } else {
    // Søndag: ingen tider
    timeSlots = [];
  }

  return (
    <div className="mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4 text-white text-center sm:text-left">
        Ledige tider:
      </h2>

      {timeSlots.length === 0 ? (
        <p className="text-white text-center">Ingen ledige tider på søndag.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
          {timeSlots.map((time: string) => (
            <button
              key={time}
              onClick={() => onSelectTime(time)}
              type="button"
              className={`w-28 sm:w-32 px-4 py-2 rounded-full text-sm font-medium border text-center transition-colors duration-200 ${
                selectedTime === time
                  ? "bg-pink-600 text-white border-pink-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-pink-100 hover:border-pink-300"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
