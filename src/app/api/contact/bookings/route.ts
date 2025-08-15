import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";
// import { bookingRateLimit } from "@/lib/ratelimit"; // Midlertidig deaktivert

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

// Interface for Prisma errors
interface PrismaError extends Error {
  code: string;
}

function isPrismaError(error: unknown): error is PrismaError {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof (error as { code: string }).code === "string"
  );
}

// GET /api/contact/bookings?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  console.log("API route called");

  const dateParam = req.nextUrl.searchParams.get("date");
  console.log("Date parameter:", dateParam);

  if (!dateParam) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  // Valider dato format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateParam)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  try {
    console.log("Attempting database connection...");

    // Opprett start og slutt av dagen i lokal tid (norsk tid)
    const [year, month, day] = dateParam.split("-").map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    console.log("Searching for bookings between:", {
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString(),
      localStart: startOfDay.toLocaleString("no-NO"),
      localEnd: endOfDay.toLocaleString("no-NO"),
    });

    // Hent opptatte tider fra database
    const bookings = await prisma.booking.findMany({
      where: {
        startAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { startAt: true },
      orderBy: { startAt: "asc" },
    });

    console.log("Database query successful, found bookings:", bookings);

    // Konverter opptatte tider til HH:MM format
    const takenTimes = bookings.map((booking: { startAt: Date }) => {
      const bookingDate = new Date(booking.startAt);
      const hours = String(bookingDate.getHours()).padStart(2, "0");
      const minutes = String(bookingDate.getMinutes()).padStart(2, "0");
      const timeSlot = `${hours}:${minutes}`;
      console.log(
        `📅 Booking found: ${bookingDate.toISOString()} (local: ${bookingDate.toLocaleString(
          "no-NO"
        )}) -> ${timeSlot}`
      );
      return timeSlot;
    });

    console.log("Taken times (formatted):", takenTimes);

    // Generer alle mulige tider for dagen
    const date = new Date(dateParam);
    const dayOfWeek = date.getDay(); // 0 = søndag, 6 = lørdag

    let allSlots: string[] = [];

    if (dayOfWeek === 0) {
      // Søndag - stengt
      allSlots = [];
    } else if (dayOfWeek === 6) {
      // Lørdag: 09:00 - 15:00
      for (let hour = 9; hour < 15; hour++) {
        const h = hour.toString().padStart(2, "0");
        allSlots.push(`${h}:00`);
        allSlots.push(`${h}:30`);
      }
    } else {
      // Ukedager: 09:00 - 19:00
      for (let hour = 9; hour < 19; hour++) {
        const h = hour.toString().padStart(2, "0");
        allSlots.push(`${h}:00`);
        allSlots.push(`${h}:30`);
      }
    }

    console.log("All possible time slots:", allSlots);

    // Filtrer bort både bookede tider OG passerte tider
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(dateParam);
    selectedDay.setHours(0, 0, 0, 0);

    const availableTimes = allSlots.filter((timeSlot) => {
      // Sjekk om tiden er booket
      const isBooked = takenTimes.includes(timeSlot);
      if (isBooked) {
        console.log(`⛔ Time slot ${timeSlot} is TAKEN - filtering out`);
        return false;
      }

      // Sjekk om tiden har passert (kun for dagens dato)
      if (selectedDay.getTime() === today.getTime()) {
        const [hours, minutes] = timeSlot.split(":").map(Number);
        const timeToCheck = new Date();
        timeToCheck.setHours(hours, minutes, 0, 0);

        // Legg til 15 minutters buffer
        const minimumTime = new Date(now.getTime() + 15 * 60 * 1000);

        if (timeToCheck <= minimumTime) {
          console.log(`⏰ Time slot ${timeSlot} has PASSED - filtering out`);
          return false;
        }
      }

      console.log(`✅ Time slot ${timeSlot} is AVAILABLE`);
      return true;
    });

    console.log("🎯 Final available times after filtering:", availableTimes);

    return NextResponse.json({ available: availableTimes });
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Forbedret tidssone-konvertering - FIKSER DATO BUG
function toStartAtISO(dateStr: string, timeStr: string) {
  console.log(`🔧 FIXING toStartAtISO: input = ${dateStr} ${timeStr}`);

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  console.log(
    `🔧 Parsed: year=${year}, month=${month}, day=${day}, hours=${hours}, minutes=${minutes}`
  );

  // Opprett dato i lokal tid (ikke UTC) - month-1 fordi JavaScript måneder er 0-basert
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  console.log(`🔧 Created date object: ${localDate.toISOString()}`);
  console.log(`🔧 Local representation: ${localDate.toLocaleString("no-NO")}`);

  return localDate.toISOString();
}

export async function POST(req: NextRequest) {
  try {
    // MIDLERTIDIG: Deaktiver rate limiting for testing
    console.log("🚀 Rate limiting disabled for testing");

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

    // FIKSET dato/tid validering - LØSER DATO BUG
    console.log(`🔧 RAW INPUT: date="${date}" time="${time}"`);

    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    console.log(
      `🔧 PARSED: year=${year}, month=${month}, day=${day}, hours=${hours}, minutes=${minutes}`
    );

    // VIKTIG: JavaScript Date bruker month-1 (0-11), så august = 7, ikke 8!
    const bookingDateTime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      0,
      0
    );
    const now = new Date();

    console.log(`📅 FIXED Backend validation:`);
    console.log(`  Booking: ${bookingDateTime.toLocaleString("no-NO")}`);
    console.log(`  Now: ${now.toLocaleString("no-NO")}`);
    console.log(`  Booking ISO: ${bookingDateTime.toISOString()}`);
    console.log(`  Now ISO: ${now.toISOString()}`);

    // Beregn forskjell i timer
    const timeDifferenceHours =
      (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    console.log(`  Hours difference: ${timeDifferenceHours.toFixed(2)}`);

    if (timeDifferenceHours < -1) {
      console.log(
        `❌ Booking is ${Math.abs(timeDifferenceHours).toFixed(
          1
        )} hours in the past`
      );
      return NextResponse.json(
        {
          error: "Kan ikke booke tid i fortiden",
        },
        { status: 400 }
      );
    }

    console.log(
      `✅ Booking allowed: ${timeDifferenceHours.toFixed(1)} hours from now`
    );

    // Sanitiser navn (fjern ekstra mellomrom)
    const sanitizedName = name.trim().replace(/\s+/g, " ");

    const startAtISO = toStartAtISO(date, time);

    // Opprett booking i database
    const booking = await prisma.booking.create({
      data: {
        name: sanitizedName,
        email: email.toLowerCase(),
        phone,
        serviceId,
        serviceName,
        price: Number(price),
        startAt: new Date(startAtISO),
      },
    });

    console.log("✅ Booking created:", {
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
        console.log("✅ E-post bekreftelse sendt");
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
    if (isPrismaError(err) && err.code === "P2002") {
      return NextResponse.json(
        { error: "Tiden er allerede booket." },
        { status: 409 }
      );
    }
    console.error("POST /api/contact/bookings error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
