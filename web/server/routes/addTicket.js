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

export default router;
