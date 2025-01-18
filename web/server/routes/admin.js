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
  checkDriverIdExists,
  addBus,
  updateBus,
  getAllBuses,
  getUsersByRole,
} from "../controllers/adminController.js";

// Admin metrics
// router.get("/users", getTotalUsers);
router.get("/tickets", getActiveTickets);
router.get("/buses", getBusesOnTrip);
router.get("/revenue", getRevenueToday);
router.get("/users", getUsersAndRolesCount);
// Admin-specific functionality
router.get("/trips", getAllTrips);
// router.post("/drivers/:id", addDriver);
router.get("/driver/:id", checkDriverIdExists);
router.post("/addBus", addBus);
router.get("/getBuses", getAllBuses);
router.put("/updateBus", updateBus);
router.get("/users/:role", getUsersByRole);
export default router;
