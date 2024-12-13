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
    username,
    phone,
    email,
    password,
    work_id,
    role = "passenger",
  } = req.body;

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
      "SELECT email, password, username, role, id FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const isPasswordValid = await bcrypt.compare(
        password,
        result.rows[0].password
      );

      if (isPasswordValid) {
        console.log("from data base response on email " + result.rows[0].id);
        return res.status(200).json({
          message: "Authentication successful",
          email: result.rows[0].email,
          username: result.rows[0].username,
          id: result.rows[0].id,
          role: result.rows[0].role,
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

export default router;
