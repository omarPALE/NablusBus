import express from "express";
import pool from "./db.js";
import usersRouter from "./routes/users.js";
import ticketRoutes from "./routes/addTicket.js";

import cors from "cors";

const app = express();
app.use("/users", usersRouter);
app.use("/api", ticketRoutes);

// Middleware
app.use(express.json());
app.use(cors());
// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err.stack);
  } else {
    console.log("Database connected successfully:", res.rows[0]);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
