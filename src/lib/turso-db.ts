// src/lib/turso-db.ts - Debug versjon

import { createClient } from "@libsql/client";

const tursoClient = createClient({
  url: process.env.DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  price: number;
  startAt: Date;
  createdAt: Date;
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  console.log(`🔍 DEBUG: Searching for bookings on date: ${date}`);

  const startDate = `${date} 00:00:00`;
  const endDate = `${date} 23:59:59`;

  console.log(`🔍 DEBUG: Date range: ${startDate} to ${endDate}`);

  // Først, la oss se alle bookinger
  const allBookings = await tursoClient.execute({
    sql: "SELECT * FROM Booking ORDER BY startAt ASC",
    args: [],
  });

  console.log(`🔍 DEBUG: All bookings in database:`, allBookings.rows);

  const result = await tursoClient.execute({
    sql: "SELECT * FROM Booking WHERE startAt >= ? AND startAt <= ? ORDER BY startAt ASC",
    args: [startDate, endDate],
  });

  console.log(`🔍 DEBUG: Filtered bookings for ${date}:`, result.rows);

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    serviceId: row.serviceId as string,
    serviceName: row.serviceName as string,
    price: row.price as number,
    startAt: new Date(row.startAt as string),
    createdAt: new Date(row.createdAt as string),
  }));
}

export async function createBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Promise<Booking> {
  console.log(`🔍 DEBUG: Creating booking:`, {
    name: booking.name,
    startAt: booking.startAt.toISOString(),
    startAtLocal: booking.startAt.toLocaleString("no-NO"),
  });

  // Format datetime for SQLite
  const startAtFormatted = booking.startAt
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  console.log(`🔍 DEBUG: Formatted startAt for SQLite: ${startAtFormatted}`);

  const result = await tursoClient.execute({
    sql: `INSERT INTO Booking (name, email, phone, serviceId, serviceName, price, startAt, createdAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
          RETURNING *`,
    args: [
      booking.name,
      booking.email,
      booking.phone,
      booking.serviceId,
      booking.serviceName,
      booking.price,
      startAtFormatted,
    ],
  });

  console.log(`🔍 DEBUG: Insert result:`, result.rows);

  if (result.rows.length === 0) {
    throw new Error("Failed to create booking - no rows returned");
  }

  const row = result.rows[0];
  const createdBooking = {
    id: row.id as number,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    serviceId: row.serviceId as string,
    serviceName: row.serviceName as string,
    price: row.price as number,
    startAt: new Date(row.startAt as string),
    createdAt: new Date(row.createdAt as string),
  };

  console.log(`DEBUG: Created booking:`, {
    id: createdBooking.id,
    startAt: createdBooking.startAt.toISOString(),
    startAtLocal: createdBooking.startAt.toLocaleString("no-NO"),
  });

  return createdBooking;
}
