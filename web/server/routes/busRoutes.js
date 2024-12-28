import { Router } from "express";
const router = Router();
import { getBusNumberByDriverId } from "../controllers/busController.js";

// Define the route to get bus number by driver_work_id
router.get("/driver/:driver_work_id", getBusNumberByDriverId);

export default router;
