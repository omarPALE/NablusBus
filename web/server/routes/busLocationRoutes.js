import { Router } from "express";
import {
  updateBusLocation,
  getLastLocation,
} from "../controllers/busLocationController.js";
const router = Router();

// Route to handle location updates
router.post("/update-location", updateBusLocation);
router.get("/recent/:busId", getLastLocation);

export default router;
