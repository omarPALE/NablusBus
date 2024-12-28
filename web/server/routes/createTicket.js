// const express = require("express");
// const app = express();
// app.use(express.json()); // Middleware to parse JSON request bodies

// // Mock database
// let tickets = [];
// let ticketIdCounter = 1;

// // POST endpoint for creating a ticket
// app.post("/api/tickets", (req, res) => {
//   const { user_id, type, rides_left } = req.body;

//   // Validate request data
//   if (!user_id || !type) {
//     return res.status(400).json({ error: "user_id and type are required." });
//   }

//   // Generate QR code (example using ticket data)
//   const qr_code = `QR-${user_id}-${type}-${ticketIdCounter}`;

//   // Create new ticket
//   const newTicket = {
//     id: ticketIdCounter++,
//     user_id,
//     type,
//     rides_left: rides_left || 0,
//     qr_code,
//   };

//   // Save ticket to database (mock implementation)
//   tickets.push(newTicket);

//   // Return the created ticket
//   res.status(201).json(newTicket);
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
