import { Router } from "express";
import pool from "../db.js";
import cors from "cors";
import express from "express";

// Create a new PostgreSQL pool instance
const router = express.Router();
// Middleware
router.use(express.json());
router.use(cors());

// Endpoint to validate the ticket
router.post("/validate-ticket", async (req, res) => {
  const { ticket_id } = req.body; // Extract ticket_id from request

  try {
    // Query to find the ticket by ticket_id
    const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [
      ticket_id,
    ]);

    if (result.rows.length === 0) {
      return res.json({ valid: false, message: "Ticket not found." });
    }

    const ticket = result.rows[0];

    console.log("Ticket info from DB:", ticket);

    if (ticket.rides_left <= 0) {
      return res.json({ valid: false, message: "No rides left on this ticket." });
    }

    // Reduce rides_left by 1
    await pool.query("UPDATE tickets SET rides_left = rides_left - 1 WHERE id = $1", [
      ticket_id,
    ]);

    res.json({
      valid: true,
      message: "Ticket validated successfully!",
      rides_left: ticket.rides_left - 1,
    });
  } catch (error) {
    console.error("Error validating ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
