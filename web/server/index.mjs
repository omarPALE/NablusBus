import express from "express";
import pool from "./db.js";
import usersRouter from "./routes/users.js";
import ticketRoutes from "./routes/Ticket.js";
import adminRoutes from "./routes/admin.js";
import tripRoutes from "./routes/tripRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import scanQR from "./routes/scanQR.js";
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
app.use("/api/scanner", scanQR);
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

  socket.on("join-user-room", ({ userId }) => {
    const roomName = `user-${userId}`;
    socket.join(roomName);
    console.log(`User ${userId} joined room: ${roomName}`);
  });

  socket.emit("update", { text: "A new user has joined!" });
  console.log("A driver connected");
  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });
  socket.on("location-update", async (data) => {
    console.log("Location update received from client:", data);
    const { bus_id, latitude, longitude } = data;
    try {
      // Call the controller to handle the logic
      await updateBusLocation({
        body: data, // Simulate the Express request object
      });
      console.log("update location for all users ", data);
      // Optionally broadcast the location update to passengers
      io.emit("bus-location", data);
      console.log("update location for all users ");
      // 1) Get all active subscriptions for this bus
      const { rows: subscriptions } = await pool.query(
        `SELECT user_id, lat, lng
         FROM notifications
         WHERE bus_id = $1 AND is_active = TRUE`,
        [bus_id]
      );

      // 2) For each subscription, calculate distance
      for (let sub of subscriptions) {
        console.log(sub);
        const distance = haversine(
          { lat: latitude, lng: longitude },
          { lat: sub.lat, lng: sub.lng }
        );
        console.log("bus  is far away by :", distance);
        // If bus is within 300 meters, send notification
        if (distance < 40) {
          // 0.3 km = 300 meters
          // 3) Insert row in `notifications` table
          const message = `Bus #${bus_id} is near your location!`;
          await pool.query(
            `UPDATE notifications 
             SET message = $1, sent_at = NOW()
             WHERE user_id = $2`,
            [message, sub.user_id]
          );

          // console.log("i am here!!!");
          const roomName = `user-${sub.user_id}`;
          io.to(roomName).emit("bus-nearby", { bus_id, message });
        }
      }
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

function haversine(coord1, coord2) {
  console.log("first point", coord1);
  console.log("second point", coord2);

  const R = 6371; // Earth radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);
  console.log();
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
