interface Props {
  date: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

const dummyTimes = [
  "08:00",
  "09:00",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
];

export default function AvailableTimes({ selectedTime, onSelectTime }: Props) {
  return (
    <div className="mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
        Ledige tider:
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
        {dummyTimes.map((time) => (
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
    </div>
  );
}
