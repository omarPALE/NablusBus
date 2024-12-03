import "./ticket-popups.css"; // Import your CSS
import PropTypes from "prop-types";

const TicketPopUp = ({
  isPopupOpen,
  setIsPopupOpen,
  ticketData,
  userState,
  handleGenerateTicket,
  responseMessage,
}) => {
  if (!isPopupOpen) return null; // Don't render the popup if it's not open

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
        <div className="info-section">
          <p>
            <strong>Ticket Type:</strong> {ticketData.type}
          </p>
          <p>
            <strong>Ticket Price:</strong> ${ticketData.price}
          </p>
          <p>
            <strong>Rides Left:</strong> {ticketData.rides_left}
          </p>
        </div>

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
  ticketData: PropTypes.shape({
    type: PropTypes.string,
    price: PropTypes.number,
    rides_left: PropTypes.number,
  }).isRequired,
  userState: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  handleGenerateTicket: PropTypes.func.isRequired,
  responseMessage: PropTypes.string,
};

export default TicketPopUp;
