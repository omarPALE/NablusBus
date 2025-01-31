import express from "express";
import pool from "./db.js";
import usersRouter from "./routes/users.js";
import ticketRoutes from "./routes/Ticket.js";
import adminRoutes from "./routes/admin.js";
import tripRoutes from "./routes/tripRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import busLocationRoutes from "./routes/busLocationRoutes.js";
import updateBusLocation from "./controllers/busLocationController.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// Define routes
app.use("/users", usersRouter);
app.use("/api", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bus-locations", busLocationRoutes);

const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  socket.onAny((event, data) => {
    console.log(`Received event: ${event}`, data);
  });
  socket.emit("update", { text: "A new user has joined!" });
  console.log("A driver connected");
  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });
  socket.on("location-update", async (data) => {
    console.log("Location update received from client:", data);

    try {
      // Call the controller to handle the logic
      await updateBusLocation({
        body: data, // Simulate the Express request object
      });
      console.log("update location for all users ", data);
      // Optionally broadcast the location update to passengers
      io.emit("bus-location", data);
      console.log("update location for all users ");
    } catch (error) {
      console.error("Error handling location update:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A driver disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

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
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
