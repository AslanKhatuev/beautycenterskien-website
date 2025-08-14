import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/contact/bookings?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  console.log("API route called");

  const dateParam = req.nextUrl.searchParams.get("date");
  console.log("Date parameter:", dateParam);

  if (!dateParam) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
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
    const { name, email, phone, serviceId, serviceName, price, date, time } =
      await req.json();

    if (
      !name ||
      !email ||
      !phone ||
      !serviceId ||
      !serviceName ||
      !price ||
      !date ||
      !time
    ) {
      return NextResponse.json({ error: "Mangler felt" }, { status: 400 });
    }

    const startAtISO = toStartAtISO(date, time);

    // Opprett booking i database
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
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
        name,
        email,
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
        console.log(" E-post bekreftelse sendt");
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
  } catch (err: any) {
    if (err?.code === "P2002") {
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
