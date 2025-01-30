import { Router } from "express";
import {
  updateBusLocation,
  getLastLocation,
  updateLocation,
  getBusesLastLocation,
} from "../controllers/busLocationController.js";
const router = Router();

// Route to handle location updates
router.post("/update-location", updateBusLocation);
router.get("/recent/:busId", getLastLocation);
router.get("/recent", getBusesLastLocation);

router.post("/update", updateLocation);
export default router;
