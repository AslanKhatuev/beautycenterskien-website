// controllers/bookingController.js
import { pool } from "../db.js";

const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidTime = (s) => /^\d{2}:\d{2}$/.test(s); // HH:MM

export const getUnavailableTimes = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !isValidDate(date)) {
      return res.status(400).json({ error: "date kreves i format YYYY-MM-DD" });
    }

    // Returnerer tider som 'HH:MM'
    const [rows] = await pool.execute(
      "SELECT TIME_FORMAT(`time`, '%H:%i') AS time FROM `bookings` WHERE `date` = ? ORDER BY `time`",
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
    if (!isValidDate(date)) {
      return res.status(400).json({ error: "Ugyldig dato (bruk YYYY-MM-DD)" });
    }
    if (!isValidTime(time)) {
      return res.status(400).json({ error: "Ugyldig tid (bruk HH:MM)" });
    }

    // Sjekk konflikt (konverterer innkommende 'HH:MM' til TIME)
    const [exists] = await pool.execute(
      "SELECT `id` FROM `bookings` WHERE `date` = ? AND `time` = STR_TO_DATE(?, '%H:%i') LIMIT 1",
      [date, time]
    );
    if (exists.length) {
      return res.status(409).json({ error: "Tiden er opptatt" });
    }

    await pool.execute(
      "INSERT INTO `bookings` (`name`, `email`, `phone`, `date`, `time`) VALUES (?, ?, ?, ?, STR_TO_DATE(?, '%H:%i'))",
      [name, email, phone, date, time]
    );

    return res.status(201).json({ message: "Booking registrert" });
  } catch (e) {
    console.error(e);

    // Håndter unik-nøkkel-feil i tilfelle race condition
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Tiden er opptatt" });
    }

    return res.status(500).json({ error: "Kunne ikke lagre booking" });
  }
};
