import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBookingsByDate, createBooking } from "@/lib/turso-db";
import { sendBookingConfirmation } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Zod schema for validering
const bookingSchema = z.object({
  name: z
    .string()
    .min(2, "Navn må være minst 2 tegn")
    .max(100, "Navn kan ikke være lengre enn 100 tegn")
    .regex(
      /^[a-zA-ZæøåÆØÅ\s\-\.]+$/,
      "Navn kan kun inneholde bokstaver, mellomrom, bindestrek og punktum"
    ),

  email: z
    .string()
    .email("Ugyldig e-postadresse")
    .max(100, "E-post kan ikke være lengre enn 100 tegn")
    .toLowerCase(),

  phone: z.string().regex(/^\d{8}$/, "Telefonnummer må være nøyaktig 8 siffer"),

  serviceId: z.string().min(1, "Tjeneste må velges"),

  serviceName: z
    .string()
    .min(1, "Tjenestenavn er påkrevd")
    .max(200, "Tjenestenavn kan ikke være lengre enn 200 tegn"),

  price: z
    .number()
    .positive("Pris må være positiv")
    .max(10000, "Pris kan ikke være høyere enn 10000 NOK"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Dato må være i formatet YYYY-MM-DD"),

  time: z.string().regex(/^\d{2}:\d{2}$/, "Tid må være i formatet HH:MM"),
});

// GET /api/contact/bookings?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  console.log("API route GET /api/contact/bookings called (Turso)");

  const dateParam = req.nextUrl.searchParams.get("date");
  console.log("Date parameter:", dateParam);

  if (!dateParam) {
    console.log("Missing date parameter");
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  // Valider dato format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateParam)) {
    console.log("Invalid date format:", dateParam);
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  // Debug logging for dato
  // Debug logging for dato - MED NORSK TIDSSONE
  const [year, month, day] = dateParam.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Lokal tid (Norge)

  console.log("📅 Raw dateParam:", dateParam);
  console.log("📅 Parsed year/month/day:", year, month, day);
  console.log("📅 Date object (Norge tid):", date);
  console.log(
    "📅 Day of week:",
    date.getDay(),
    "(0=søndag, 1=mandag, 6=lørdag)"
  );
  console.log("📅 toISOString:", date.toISOString());
  console.log("📅 toLocaleDateString Norge:", date.toLocaleDateString("no-NO"));
  try {
    console.log("Testing Turso database connection...");

    // Hent opptatte tider fra Turso database
    const bookings = await getBookingsByDate(dateParam);

    console.log("Turso query successful, found bookings:", bookings.length);

    // Konverter opptatte tider til HH:MM format
    const takenTimes = bookings.map((booking) => {
      const bookingDate = new Date(booking.startAt);
      const hours = String(bookingDate.getHours()).padStart(2, "0");
      const minutes = String(bookingDate.getMinutes()).padStart(2, "0");
      const timeSlot = `${hours}:${minutes}`;
      console.log(
        `Booking found: ${bookingDate.toISOString()} (local: ${bookingDate.toLocaleString(
          "no-NO"
        )}) -> ${timeSlot}`
      );
      return timeSlot;
    });

    console.log("Taken times (formatted):", takenTimes);

    // Generer alle mulige tider for dagen - HVER TIME
    const dayOfWeek = date.getDay(); // 0 = søndag, 6 = lørdag

    let allSlots: string[] = [];

    if (dayOfWeek === 0) {
      // Søndag - stengt
      allSlots = [];
      console.log("Sunday - closed");
    } else if (dayOfWeek === 6) {
      // Lørdag: 09:00 - 15:00 (hver time)
      for (let hour = 9; hour < 15; hour++) {
        const h = hour.toString().padStart(2, "0");
        allSlots.push(`${h}:00`);
      }
      console.log("Saturday hours: 09:00 - 15:00");
    } else {
      // Ukedager: 09:00 - 19:00 (hver time)
      for (let hour = 9; hour < 19; hour++) {
        const h = hour.toString().padStart(2, "0");
        allSlots.push(`${h}:00`);
      }
      console.log("Weekday hours: 09:00 - 19:00");
    }

    console.log("All possible time slots:", allSlots);

    // Filtrer bort både bookede tider OG passerte tider
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(dateParam);
    selectedDay.setHours(0, 0, 0, 0);

    console.log("Time filtering debug:", {
      now: now.toLocaleString("no-NO"),
      today: today.toLocaleString("no-NO"),
      selectedDay: selectedDay.toLocaleString("no-NO"),
      isToday: selectedDay.getTime() === today.getTime(),
      currentHour: now.getHours(),
      currentMinutes: now.getMinutes(),
    });

    const availableTimes = allSlots.filter((timeSlot) => {
      // Sjekk om tiden er booket
      const isBooked = takenTimes.includes(timeSlot);
      if (isBooked) {
        console.log(`Time slot ${timeSlot} is TAKEN - filtering out`);
        return false;
      }

      // Sjekk om datoen er i fortiden (ikke i dag)
      if (selectedDay < today) {
        console.log(
          `Date ${dateParam} is in the past - filtering out all times`
        );
        return false;
      }

      // Sjekk om tiden har passert (kun for dagens dato)
      if (selectedDay.getTime() === today.getTime()) {
        const [hours, minutes] = timeSlot.split(":").map(Number);
        const timeToCheck = new Date();
        timeToCheck.setHours(hours, minutes, 0, 0);

        // Økt buffer til 30 minutter for sikkerhet
        const minimumTime = new Date(now.getTime() + 30 * 60 * 1000);

        console.log(`Checking time ${timeSlot}:`, {
          timeToCheck: timeToCheck.toLocaleString("no-NO"),
          minimumTime: minimumTime.toLocaleString("no-NO"),
          hasPassed: timeToCheck <= minimumTime,
        });

        if (timeToCheck <= minimumTime) {
          console.log(`⏳ Time slot ${timeSlot} has PASSED - filtering out`);
          return false;
        }
      }

      console.log(`Time slot ${timeSlot} is AVAILABLE`);
      return true;
    });

    console.log("Final available times after filtering:", availableTimes);

    return NextResponse.json({ available: availableTimes });
  } catch (error) {
    console.error("GET bookings error:", error);

    // Mer detaljert feilmeldinger
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Database error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}