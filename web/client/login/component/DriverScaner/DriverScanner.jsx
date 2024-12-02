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
        // Call the backend API to validate the QR code
        const response = await axios.post(
          "http://localhost:5000/validate-ticket",
          {
            qrCode: result.text,
          }
        );

        if (response.data.valid) {
          setPassengerCount((prevCount) => prevCount + 1); // Increment passenger count
          setMessage("✅ Ticket validated successfully!");
        } else {
          setMessage("❌ Invalid ticket. Please try again.");
        }
      } catch (error) {
        console.error("Error validating ticket:", error);
        setMessage("⚠️ Error connecting to the server.");
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
