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
    const date = new Date(dateParam);
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

// Forbedret tidssone-konvertering
function toStartAtISO(dateStr: string, timeStr: string) {
  console.log(`🔧 toStartAtISO: input = ${dateStr} ${timeStr}`);

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  console.log(
    `🔧 Parsed: year=${year}, month=${month}, day=${day}, hours=${hours}, minutes=${minutes}`
  );

  // Opprett dato i lokal tid (ikke UTC) - month-1 fordi JavaScript måneder er 0-basert
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  console.log(`🔧 Created date object: ${localDate.toISOString()}`);
  console.log(`🔧 Local representation: ${localDate.toLocaleString("no-NO")}`);

  return localDate;
}

export async function POST(req: NextRequest) {
  try {
    console.log("POST booking request (Turso)");

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Ugyldig JSON i request" },
        { status: 400 }
      );
    }

    // Valider input med Zod
    const validationResult = bookingSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      console.log("Validation errors:", errors);

      return NextResponse.json(
        {
          error: "Ugyldig input",
          details: errors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, serviceId, serviceName, price, date, time } =
      validationResult.data;

    // Dato/tid validering
    console.log(`🔧 RAW INPUT: date="${date}" time="${time}"`);

    const bookingDateTime = toStartAtISO(date, time);
    const now = new Date();

    console.log(`🔧 Backend validation:`);
    console.log(`  Booking: ${bookingDateTime.toLocaleString("no-NO")}`);
    console.log(`  Now: ${now.toLocaleString("no-NO")}`);

    // Beregn forskjell i timer
    const timeDifferenceHours =
      (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    console.log(`  Hours difference: ${timeDifferenceHours.toFixed(2)}`);

    // Økt buffer til 30 minutter (0.5 timer) for sikkerhet
    if (timeDifferenceHours < 0.5) {
      console.log(
        `Booking is ${Math.abs(timeDifferenceHours).toFixed(
          1
        )} hours in the past or too close to current time`
      );
      return NextResponse.json(
        {
          error:
            "Kan ikke booke tid i fortiden eller for nært i tid. Vennligst velg en tid minst 30 minutter frem i tid.",
        },
        { status: 400 }
      );
    }

    // Sanitiser navn (fjern ekstra mellomrom)
    const sanitizedName = name.trim().replace(/\s+/g, " ");

    // Opprett booking i Turso database
    const booking = await createBooking({
      name: sanitizedName,
      email: email.toLowerCase(),
      phone,
      serviceId,
      serviceName,
      price: Number(price),
      startAt: bookingDateTime,
    });

    console.log("Booking created in Turso:", {
      id: booking.id,
      startAt: booking.startAt.toISOString(),
      localTime: booking.startAt.toLocaleString("no-NO"),
    });

    // Send e-post bekreftelse
    try {
      const emailResult = await sendBookingConfirmation({
        name: sanitizedName,
        email: email.toLowerCase(),
        phone,
        serviceName,
        price: Number(price),
        date,
        time,
      });

      if (!emailResult.success) {
        console.error("⚠️ E-post kunne ikke sendes:", emailResult.error);
        // Vi fortsetter likevel siden bookingen er lagret
      } else {
        console.log("E-post bekreftelse sendt");
      }
    } catch (emailError) {
      console.error("⚠️ E-post feil:", emailError);
      // Vi fortsetter likevel siden bookingen er lagret
    }

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      message: "Booking opprettet og e-post sendt",
    });
  } catch (err: unknown) {
    console.error("POST /api/contact/bookings error:", err);

    // Mer detaljert feilmeldinger
    if (err instanceof Error) {
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
