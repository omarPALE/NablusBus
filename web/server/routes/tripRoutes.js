// routes/tripRoutes.js
import { Router } from "express";
const router = Router();
import {
  addNewTrip,
  getAllTrips,
  updateEndTime,
  getTripsByWorkerId,
} from "../controllers/tripController.js";

// POST endpoint to create a new trip
router.post("/trip", addNewTrip);
// Route to get trips by worker ID
router.get("/worker/:workerId", getTripsByWorkerId);
// Route to get all trips
router.get("/alltrips", getAllTrips);
router.get("/trip/:tripid");
router.get("/all");
router.put("/updateEndTime/:tripId", updateEndTime);
export default router;
