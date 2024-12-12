import { Router } from "express";
const router = Router();
import {
  getTotalUsers,
  getActiveTickets,
  getBusesOnTrip,
  getRevenueToday,
  getAllTrips,
  addDriver,
  getUsersAndRolesCount,
} from "../controllers/adminController.js";

// Admin metrics
// router.get("/users", getTotalUsers);
router.get("/tickets", getActiveTickets);
router.get("/buses", getBusesOnTrip);
router.get("/revenue", getRevenueToday);
router.get("/users", getUsersAndRolesCount);

// Admin-specific functionality
router.get("/trips", getAllTrips);
router.post("/drivers", addDriver);

export default router;