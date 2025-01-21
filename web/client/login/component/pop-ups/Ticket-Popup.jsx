import "./ticket-popups.css"; // Import your CSS
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const TicketPopUp = ({
  setIsPopupOpen,
  ticketData,
  setTicketData,
  userState,
  pricingData,
  qrCode,
}) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [isTicketCreated, setIsTicketCreated] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const selectedTicket = pricingData.find((ticket) => ticket.touched) || {};

  const isConfirmDisabled = !(
    selectedTicket &&
    (selectedTicket.ticketType === "half" ||
      selectedTicket.ticketType === "full")
  );

  useEffect(() => {
    console.log("TicketSection qrCode received:", qrCode);
  }, [qrCode]); // Log qrCode when it changes

  const qrValue = JSON.stringify({
    price: selectedTicket.ticketPrice,
    departure: selectedTicket.departure || "Downtown",
    destination: selectedTicket.destination || "Najah",
    classType: selectedTicket.classType || "Full",
    seatNumber: selectedTicket.seatNumber || "B16",
    busNumber: selectedTicket.busNumber || "98",
    rides_left: selectedTicket.rides_left,
  });

  const handleGenerateTicket = async () => {
    if (isConfirmDisabled) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
      return;
    }

    const undefinedFields = Object.entries(ticketData)
      .filter(([value]) => value === undefined)
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
          qr_code: qrValue,
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

  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsTicketCreated(false);
    setResponseMessage("");
    setShowToast(false);
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
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>

            {/* Toast Popup */}
            {showToast && (
              <div className="toast-popup">
                Please select a valid ticket type (half or full) to proceed.
              </div>
            )}

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
  setIsPopupOpen: PropTypes.func.isRequired,
  pricingData: PropTypes.array.isRequired,
  ticketData: PropTypes.object.isRequired,
  setTicketData: PropTypes.func.isRequired,
  userState: PropTypes.object,
  qrCode: PropTypes.string,
};

export default TicketPopUp;
