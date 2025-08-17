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
  const dateParam = req.nextUrl.searchParams.get("date");

  if (!dateParam) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  // Valider dato format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateParam)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  // Parse dato med norsk tidssone
  const [year, month, day] = dateParam.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  try {
    // Hent opptatte tider fra Turso database
    const bookings = await getBookingsByDate(dateParam);

    // Konverter opptatte tider til HH:MM format
    const takenTimes = bookings.map((booking) => {
      const bookingDate = new Date(booking.startAt);
      const hours = String(bookingDate.getHours()).padStart(2, "0");
      const minutes = String(bookingDate.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    // Generer alle mulige tider for dagen
    const dayOfWeek = date.getDay();
    let allSlots: string[] = [];

    if (dayOfWeek === 0) {
      // Søndag - stengt
      allSlots = [];
    } else if (dayOfWeek === 6) {
      // Lørdag: 09:00 - 14:00
      for (let hour = 9; hour < 14; hour++) {
        const h = hour.toString().padStart(2, "0");
        allSlots.push(`${h}:00`);
      }
    } else {
      // Ukedager: 09:00 - 19:00
      for (let hour = 9; hour < 19; hour++) {
        const h = hour.toString().padStart(2, "0");
        allSlots.push(`${h}:00`);
      }
    }

    // Filtrer bort både bookede tider og passerte tider
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(dateParam);
    selectedDay.setHours(0, 0, 0, 0);

    const availableTimes = allSlots.filter((timeSlot) => {
      // Sjekk om tiden er booket
      if (takenTimes.includes(timeSlot)) {
        return false;
      }

      // Sjekk om datoen er i fortiden
      if (selectedDay < today) {
        return false;
      }

      // Sjekk om tiden har passert (kun for dagens dato)
      if (selectedDay.getTime() === today.getTime()) {
        const [hours, minutes] = timeSlot.split(":").map(Number);
        const timeToCheck = new Date();
        timeToCheck.setHours(hours, minutes, 0, 0);
        const minimumTime = new Date(now.getTime() + 30 * 60 * 1000);

        if (timeToCheck <= minimumTime) {
          return false;
        }
      }

      return true;
    });

    return NextResponse.json({ available: availableTimes });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Database error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/contact/bookings - Opprett ny booking
export async function POST(req: NextRequest) {
  try {
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

    // Opprett dato/tid objekt med norsk tidssone
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    const bookingDateTime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      0,
      0
    );

    // Sjekk at booking er i fremtiden
    const now = new Date();
    const timeDifferenceHours =
      (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (timeDifferenceHours < 0.5) {
      return NextResponse.json(
        {
          error:
            "Kan ikke booke tid i fortiden eller for nært i tid. Vennligst velg en tid minst 30 minutter frem i tid.",
        },
        { status: 400 }
      );
    }

    // Sanitiser navn
    const sanitizedName = name.trim().replace(/\s+/g, " ");

    // Opprett booking i database
    const booking = await createBooking({
      name: sanitizedName,
      email: email.toLowerCase(),
      phone,
      serviceId,
      serviceName,
      price: Number(price),
      startAt: bookingDateTime,
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
        // E-post feilet, men booking er lagret
      }
    } catch (emailError) {
      // E-post feilet, men booking er lagret
    }

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      message: "Booking opprettet og e-post sendt",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
