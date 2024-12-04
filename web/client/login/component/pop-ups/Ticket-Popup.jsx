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
  const [isTicketCreated, setIsTicketCreated] = useState(false);

  if (!isPopupOpen) return null; // Don't render the popup if it's not open

  const selectedTicket = pricingData.find((ticket) => ticket.touched);

  const handleGenerateTicket = async () => {
    const undefinedFields = Object.entries(ticketData)
      .filter(([key, value]) => value === undefined)
      .map(([key]) => key);

    try {
      if (undefinedFields.length > 0) {
        console.log("The following fields are undefined:", undefinedFields);
      } else {
        console.log("All fields in ticketData are defined");
      }

      if (selectedTicket) {
        setTicketData((prevData) => ({
          ...prevData,
          ticketType: selectedTicket.ticketType,
          model: selectedTicket.model,
          price: selectedTicket.price,
          rides_left: selectedTicket.rides_left,
          user_id: userState.user_id,
        }));

        // Avoid accessing `ticketData` immediately after `setTicketData`.
        const response = await axios.post(
          "http://localhost:5000/api/addticket",
          {
            ...ticketData,
          }
        );
        setResponseMessage(
          `🎉 Ticket created successfully! Ticket ID: ${response.data.id}`
        );
        setIsTicketCreated(true);

        // Automatically close the popup after 3 seconds
        setTimeout(() => {
          setIsPopupOpen(false);
          setIsTicketCreated(false); // Reset the success state
        }, 3000);
      } else {
        setResponseMessage("Please select a valid ticket.");
      }
    } catch (error) {
      if (undefinedFields.length > 0) {
        setResponseMessage(
          `The following fields are undefined: ${undefinedFields.join(", ")}`
        );
      }
      console.error(
        "Error generating ticket:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {isTicketCreated ? (
          <div className="success-message">
            <h2>🎉 Ticket Created Successfully! 🎉</h2>
            <p>
              Thank you, <strong>{userState.username}</strong>. Your ticket has
              been created.
            </p>
            <p>
              <strong>Ticket ID:</strong>{" "}
              {responseMessage.split("Ticket ID: ")[1]}
            </p>
          </div>
        ) : (
          <>
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
          </>
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
