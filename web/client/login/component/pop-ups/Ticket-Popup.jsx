import "./ticket-popups.css"; // Import your CSS
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const TicketPopUp = ({
  isPopupOpen,
  setIsPopupOpen,
  ticketData,
  setTicketData,
  userState,
  pricingData,
}) => {
  const [responseMessage, setResponseMessage] = useState("");

  if (!isPopupOpen) return null; // Don't render the popup if it's not open
  // Get the selected ticket based on the touched flag
  const selectedTicket = pricingData.find((ticket) => ticket.touched);

  const handleGenerateTicket = async () => {
    try {
      if (selectedTicket) {
        setTicketData({
          ...ticketData,
          ticketType: selectedTicket.ticketType,
          model: selectedTicket.model,
          price: selectedTicket.price,
          rides_left: selectedTicket.rides_left,
          user_id: userState.userID,
        });
        console.log("Requesting with ticketData:", ticketData);

        const response = await axios.post(
          "http://localhost:5000/api/addticket",
          {
            ...ticketData,
          }
        );
        setResponseMessage(
          `Ticket created successfully! Ticket ID: ${response.data.id}`
        );
        setResponseMessage(
          `Ticket created successfully! Ticket ID: ${response.data.id}`
        );
        setIsPopupOpen(false); // Close the popup on success
      } else {
        setResponseMessage("Please select a valid ticket.");
      }
    } catch (error) {
      console.error("Error generating ticket:", error);
      setResponseMessage("Failed to create ticket. Please try again.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Ticket Details</h2>

        {/* User Information */}
        <div className="info-section">
          <p>
            <strong>Passenger Name:</strong> {userState.username}
          </p>
          <p>
            <strong>Email:</strong> {userState.email}
          </p>
        </div>

        {/* Ticket Information */}
        {selectedTicket && (
          <div className="info-section">
            <p>
              <strong>Ticket Type:</strong> {selectedTicket.ticketType}
            </p>
            <p>
              <strong>Price:</strong> ${selectedTicket.price}
            </p>
            <p>
              <strong>Rides Left:</strong> {selectedTicket.rides_left}
            </p>
          </div>
        )}

        {/* Payment Details Card */}
        <div className="payment-card">
          <h3>Payment Method</h3>
          <p>Card Number: **** **** **** 1234</p>
          <p>Card Holder: John Doe</p>
          <p>Expiry Date: 12/25</p>
        </div>

        {/* Confirm and Cancel Buttons */}
        <div className="popup-buttons">
          <button className="confirm-button" onClick={handleGenerateTicket}>
            Confirm
          </button>
          <button
            className="cancel-button"
            onClick={() => setIsPopupOpen(false)}
          >
            Cancel
          </button>
        </div>

        {/* Response Message */}
        {responseMessage && (
          <p className="response-message">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

TicketPopUp.propTypes = {
  isPopupOpen: PropTypes.bool.isRequired,
  setIsPopupOpen: PropTypes.func.isRequired,
  pricingData: PropTypes.array.isRequired,
  ticketData: PropTypes.object.isRequired,
  setTicketData: PropTypes.func.isRequired,
  userState: PropTypes.object,
};

export default TicketPopUp;
