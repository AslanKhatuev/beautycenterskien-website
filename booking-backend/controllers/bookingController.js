// controllers/bookingController.js (MySQL-versjon)
import { pool } from "../db.js";

export const getUnavailableTimes = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date)
      return res.status(400).json({ error: "date kreves (YYYY-MM-DD)" });
    const [rows] = await pool.query(
      "SELECT time FROM bookings WHERE date = ?",
      [date]
    );
    return res.json({ times: rows.map((r) => r.time) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Kunne ikke hente tider" });
  }
};

export const postBooking = async (req, res) => {
  try {
    const { name, email, phone, date, time } = req.body;
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ error: "Alle felter er påkrevd" });
    }
    const [exists] = await pool.query(
      "SELECT id FROM bookings WHERE date = ? AND time = ? LIMIT 1",
      [date, time]
    );
    if (exists.length)
      return res.status(409).json({ error: "Tiden er opptatt" });

    await pool.query(
      "INSERT INTO bookings (name, email, phone, date, time) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, date, time]
    );

    return res.status(201).json({ message: "Booking registrert" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Kunne ikke lagre booking" });
  }
};
