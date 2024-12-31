import { Router } from "express";
import {
  updateBusLocation,
  getLastLocation,
  updateLocation,
} from "../controllers/busLocationController.js";
const router = Router();

// Route to handle location updates
router.post("/update-location", updateBusLocation);
router.get("/recent/:busId", getLastLocation);
router.post("/update", updateLocation);
export default router;
