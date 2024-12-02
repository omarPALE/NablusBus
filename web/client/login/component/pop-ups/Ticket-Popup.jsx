import "./ticket-popups.css"; // Create a separate CSS file for styling the popup
import PropTypes from "prop-types";

const TicketPopUp = ({
  isPopupOpen,
  setIsPopupOpen,
  ticketData,
  setTicketData,
  handleGenerateTicket,
  responseMessage,
}) => {
  if (!isPopupOpen) return null; // Don't render the popup if it isn't open

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create Ticket</h2>

        {/* Ticket Fields */}
        <div className="form-group">
          <label>
            User ID:
            <input
              type="text"
              value={ticketData.user_id}
              onChange={(e) =>
                setTicketData({ ...ticketData, user_id: e.target.value })
              }
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Ticket Type:
            <select
              value={ticketData.type}
              onChange={(e) =>
                setTicketData({ ...ticketData, type: e.target.value })
              }
            >
              <option value="">Select Type</option>
              <option value="multi-trip">Multi-Trip</option>
              <option value="single-trip">Single Trip</option>
              <option value="student">Student</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Rides Left:
            <input
              type="number"
              value={ticketData.rides_left}
              onChange={(e) =>
                setTicketData({ ...ticketData, rides_left: e.target.value })
              }
            />
          </label>
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
  ticketData: PropTypes.object.isRequired,
  setTicketData: PropTypes.func.isRequired,
  handleGenerateTicket: PropTypes.func.isRequired,
  responseMessage: PropTypes.string,
};

export default TicketPopUp;
