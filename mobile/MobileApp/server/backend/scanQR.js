const express = require("express");
const db = require("../db");
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// Endpoint to validate the ticket
app.post("/validate-ticket", async (req, res) => {
  const { qrCode } = req.body;

  try {
    // Query to find the ticket by QR code
    const result = await db.query("SELECT * FROM tickets WHERE qr_code = $1", [
      qrCode,
    ]);

    if (result.rows.length > 0) {
      const ticket = result.rows[0];

      if (ticket.valid) {
        // Update the ticket as used
        await db.query("UPDATE tickets SET valid = FALSE WHERE qr_code = $1", [
          qrCode,
        ]);
        res.json({ valid: true });
      } else {
        res.json({ valid: false, message: "Ticket already used." });
      }
    } else {
      res.json({ valid: false, message: "Ticket not found." });
    }
  } catch (error) {
    console.error("Error validating ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});