import express from "express";
import pool from "../db.js";
import cors from "cors";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import RateLimiter from "../rateLimiter.js"; // Optional: Middleware for rate-limiting

const router = express.Router();
// Middleware
router.use(express.json());
router.use(cors());

// Fetch all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//add user
router.post("/add", async (req, res) => {
  const {
    username,
    phone,
    email,
    password,
    work_id,
    role = "passenger",
  } = req.body;
  console.log("the data from mobile is :", req.body);
  const hashedPassword = await bcrypt.hash(password, 10);

  const age = Math.floor(Math.random() * 100) + 18; // Generate a random age between 18 and 100
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role, age, work_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [username, email, hashedPassword, role, age, work_id]
    );

    res.status(201).json(result.rows[0]); // Respond with the inserted user
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).send("duplicate key value violates");
    } else {
      console.error("Error inserting user:", err.message);
      res.status(500).send("Server Error");
    }
  }
});
//update user
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "UPDATE users SET username = $1, email = $2, password = $3, role=$4 WHERE id = $5",
      [username, email, hashedPassword, role, id]
    );
    res.send("User updated successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//delete user
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.send("User deleted successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//get by email
router.post("/email", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT email, password, username, role, id, work_id FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const isPasswordValid = await bcrypt.compare(
        password,
        result.rows[0].password
      );
      console.log("hi from back end ", result.rows[0]);
      if (isPasswordValid) {
        console.log("from data base response on email " + result.rows[0].id);
        return res.status(200).json({
          message: "Authentication successful",
          email: result.rows[0].email,
          username: result.rows[0].username,
          id: result.rows[0].id,
          role: result.rows[0].role,
          work_id: result.rows[0].work_id,
        });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Rate limiter to prevent abuse (if implemented)
const resetPasswordRateLimiter = RateLimiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit to 3 requests per window
});

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail", // Change to your email service
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// POST /forgot-password
router.post("/forgot-password", resetPasswordRateLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "User with this email does not exist." });
    }

    const user = rows[0];

    // Generate a random reset code
    const resetCode = crypto.randomBytes(3).toString("hex");

    // Store the reset code and its expiration time in the database
    // await pool.query(
    //   "UPDATE users SET reset_password_code = $1, reset_password_expiry = $2 WHERE email = $3",
    //   [resetCode, Date.now() + 15 * 60 * 1000, email]
    // );

    // Send the reset code via email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Your password reset code is: ${resetCode}. It is valid for 15 minutes. If you didn't request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Reset code sent to email.",
      resetCode, // Include the reset code in the response
    });
  } catch (error) {
    console.error("Error sending reset code:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// Endpoint to reset the password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "An error occurred while resetting the password." });
  }
});

export default router;
