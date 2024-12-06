import { Router } from "express";
import pool from "../db.js";
import cors from "cors";
import express from "express";

// Create a new PostgreSQL pool instance
const router = express.Router();
// Middleware
router.use(express.json());
router.use(cors());
// Endpoint to add a ticket
router.post("/addticket", async (req, res) => {
  console.log("Incoming Request Body:", req.body);

  const { user_id, ticketType, model, price, rides_left, qr_code } = req.body;

  try {
    // Validate input data
    if (
      !user_id ||
      !ticketType ||
      !model ||
      !price ||
      !rides_left ||
      !qr_code
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Insert data into the database
    const result = await pool.query(
      `INSERT INTO tickets (user_id, type, model, price, rides_left, qr_code)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [user_id, ticketType, model, price, rides_left, qr_code]
    );

    // Send success response
    res
      .status(201)
      .json({ id: result.rows[0].id, message: "Ticket added successfully!" });
  } catch (error) {
    console.error("Error adding ticket:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//get all tickets
router.get("/Tickets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tickets");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/ticket/:id", async (req, res) => {
  const { id } = req.params;
  console.log("back end result");

  try {
    // Fetch full ticket details based on the ID
    const result = await pool.query(
      "SELECT qr_code AS qrCode FROM tickets WHERE id = $1",
      [id]
    );

    // Check if a ticket was found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    console.log("back end result" + result.rows[0].qr_code);
    // Return the first matching ticket
    res.json(result.rows[0].qr_code);
  } catch (err) {
    console.error("Error fetching ticket:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
