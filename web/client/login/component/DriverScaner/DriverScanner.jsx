import { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import "./scanner.css";

const DriverScanner = () => {
  const [message, setMessage] = useState("");
  const [passengerCount, setPassengerCount] = useState(0);

  const handleScan = async (result) => {
    if (result) {
      try {
        const scannedData = JSON.parse(result.text); // Parse QR Code Data
        const { ticketID } = scannedData; // Extract ticket_id

        if (!ticketID) {
          setMessage("❌ Invalid QR Code: Missing Ticket ID");
          return;
        }

        // Step 1: Validate the ticket
        const validationResponse = await axios.post(
          "http://localhost:5000/api/validate-ticket",
          { ticket_id: ticketID }
        );

        if (!validationResponse.data.valid) {
          setMessage("❌ Invalid ticket. Please try again.");
          return;
        }

        // Step 2: Check rides_left
        const { rides_left } = validationResponse.data;
        if (rides_left <= 0) {
          setMessage("⚠️ No rides left on this ticket.");
          return;
        }

        // Step 3: Reduce rides_left by 1
        const updateResponse = await axios.post(
          "http://localhost:5000/api/reduce-ride",
          { ticket_id: ticketID }
        );

        if (updateResponse.data.success) {
          setPassengerCount((prevCount) => prevCount + 1); // Increment passenger count
          setMessage("✅ Ticket validated successfully! Ride deducted.");
        } else {
          setMessage("⚠️ Failed to update ticket. Try again.");
        }
      } catch (error) {
        console.error("Error processing QR Code:", error);
        setMessage("⚠️ Error processing QR Code. Try again.");
      }
    }
  };
  const handleError = (err) => {
    console.error("Scanner Error:", err);
    setMessage("⚠️ Error accessing the camera.");
  };

  return (
    <div className="scanner-container">
      <h1 className="scanner-title">Driver QR Scanner</h1>

      <div className="scanner-frame">
        <div className="scanner-view">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
          />
        </div>
        <div className="scanner-overlay">
          <p>Align QR Code within the frame</p>
        </div>
      </div>

      {/* Passenger count */}
      <div className="passenger-info">
        <h2 className="passenger-count">
          🚌 Passengers Onboard: {passengerCount}
        </h2>
      </div>

      {/* Message Feedback */}
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default DriverScanner;
