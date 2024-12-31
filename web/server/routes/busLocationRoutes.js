import { Router } from "express";
import { updateBusLocation } from "../controllers/busLocationController.js";

const router = Router();

// Route to handle location updates
router.post("/update-location", updateBusLocation);

export default router;
