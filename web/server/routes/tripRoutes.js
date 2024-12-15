// routes/tripRoutes.js
import { Router } from "express";
const router = Router();
import {
  addNewTrip,
  getAllTrips,
  updateEndTime,
 } from "../controllers/tripController.js";

// POST endpoint to create a new trip
router.post("/trip", addNewTrip);
// Route to get all trips
router.get("/alltrips", getAllTrips);

router.put("/updateEndTime/:tripId", updateEndTime);
export default router;
