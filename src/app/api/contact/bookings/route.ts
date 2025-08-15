import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";
import { bookingRateLimit } from "@/lib/ratelimit";

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

  const dayStart = new Date(`${dateParam}T00:00:00`);
  const dayEnd = new Date(`${dateParam}T23:59:59.999`);

  console.log("Date range:", { dayStart, dayEnd });

  try {
    console.log("Attempting database connection...");

    // Hent opptatte tider fra database
    const bookings = await prisma.booking.findMany({
      where: { startAt: { gte: dayStart, lte: dayEnd } },
      select: { startAt: true },
      orderBy: { startAt: "asc" },
    });

    console.log("Database query successful, found bookings:", bookings);

    // Konverter opptatte tider til HH:MM format
    const takenTimes = bookings.map((b: { startAt: Date }) => {
      const d = new Date(b.startAt);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    });

    console.log("Taken times:", takenTimes);

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

    // Filtrer bort opptatte tider - returner KUN tilgjengelige tider
    const availableTimes = allSlots.filter(
      (time) => !takenTimes.includes(time)
    );

    console.log("All possible slots:", allSlots);
    console.log("Available times after filtering:", availableTimes);

    return NextResponse.json({ available: availableTimes });
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

function toStartAtISO(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const local = new Date(y, m - 1, d, hh, mm, 0);
  return local.toISOString();
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - hent IP adresse fra headers
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : req.headers.get("x-real-ip") || "127.0.0.1";

    const { success, limit, reset, remaining } = await bookingRateLimit.limit(
      ip
    );

    if (!success) {
      return NextResponse.json(
        {
          error: "For mange booking-forsøk. Prøv igjen senere.",
          retryAfter: Math.round((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

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

    // Ekstra validering: sjekk at dato ikke er i fortiden
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return NextResponse.json(
        {
          error: "Kan ikke booke tid i fortiden",
        },
        { status: 400 }
      );
    }

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

    console.log("Booking created:", booking.id);

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
