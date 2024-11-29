import express from "express";
import pool from "../db.js";
import cors from "cors";
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
    firstName,
    lastName,
    phone,
    email,
    password,
    role = "passenger",
  } = req.body;

  const username = firstName + " " + lastName;

  const age = Math.floor(Math.random() * 100) + 18; // Generate a random age between 18 and 100
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role, age) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, email, password, role, age]
    );
    res.status(201).json(result.rows[0]); // Respond with the inserted user
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).send("Server Error");
  }
});
//update user
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  try {
    await pool.query(
      "UPDATE users SET username = $1, email = $2, password = $3, role=$4 WHERE id = $5",
      [username, email, password, role, id]
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

export default router;
