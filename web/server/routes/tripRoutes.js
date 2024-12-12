// routes/tripRoutes.js
import { Router } from "express";
const router = Router();
import { addNewTrip } from "../controllers/tripController.js";

// POST endpoint to create a new trip
router.post("/trip", addNewTrip);

export default router;
