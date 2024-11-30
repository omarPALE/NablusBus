import express from "express";
import pool from "../db.js";
import cors from "cors";
import bcrypt from "bcrypt";
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
//get by email
router.get("/email", async (req, res) => {
  const resEmail = req.query.email; // Extract email and password from request body
  const resPassword = req.query.password; //
  try {
    const result = await pool.query(
      "SELECT email, password FROM users WHERE email = $1",
      [resEmail]
    );
    if (result.rows.length > 0) {
      console.log("data base password: ", result.rows[0].password);
      const isPasswordValid = await bcrypt.compare(
        resPassword,
        result.rows[0].password
      );

      if (isPasswordValid) {
        // Respond with success status and user details
        return res
          .status(200)
          .json({ message: "Authentication successful", email: resEmail });
      } else {
        // Respond with invalid credentials message
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      // Respond with user not found message
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
