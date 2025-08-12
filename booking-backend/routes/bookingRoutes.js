// routes/bookingRoutes.js
import { Router } from "express";
import {
  postBooking,
  getUnavailableTimes,
} from "../controllers/bookingController.js";

const router = Router();

// Hent opptatte tider for dato
router.get("/unavailable", getUnavailableTimes);

// Lagre booking
router.post("/book", postBooking);

export default router;
