import { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import "./scanner.css";

const DriverScanner = () => {
  const [message, setMessage] = useState("");
  const [passengerCount, setPassengerCount] = useState(0);
  const [scanned, setScanned] = useState(false); // Prevents continuous scanning

  const handleScan = async (result) => {
    if (scanned || !result) return; // Prevent duplicate scans

    setScanned(true);
    try {
      const scannedData = JSON.parse(result.text); // Parse QR Code Data
      const { ticketID } = scannedData; // Extract ticket_id

      if (!ticketID) {
        setMessage("❌ Invalid QR Code: Missing Ticket ID");
        return;
      }

      // Step 1: Validate the ticket
      const validationResponse = await axios.post(
        "http://localhost:5000/api/scanner/validate-ticket",
        { ticket_id: ticketID }
      );

      if (validationResponse.data.valid) {
        setMessage(
          `✅ Ticket validated successfully! Remaining rides: ${validationResponse.data.rides_left}`
        );
        setPassengerCount((prevCount) => prevCount + 1);
      } else {
        setMessage(`❌ ${validationResponse.data.message}`);
      }
    } catch (error) {
      setMessage("⚠️ Error processing QR Code. Try again.");
      console.error("Error processing QR Code:", error);
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
        {!scanned && (
          <div className="scanner-view">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
          </div>
        )}
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

      {/* Scan Again Button */}
      {scanned && (
        <button
          className="scan-again-btn"
          onClick={() => {
            setScanned(false);
            setMessage(""); // Clear message on rescan
          }}
        >
          Scan Again
        </button>
      )}
    </div>
  );
};

export default DriverScanner;
