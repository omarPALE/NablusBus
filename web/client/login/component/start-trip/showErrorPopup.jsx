import "./PopupStyles.css"; // Import the external CSS file
import PropTypes from "prop-types";

const ShowErrorPopup = ({ errorCode, onClose }) => {
  const getMessage = () => {
    if (errorCode === 1) {
      return "Location is turned off. Please enable it.";
    }
    return "Unable to access your location. Please try again.";
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <p className="popup-message">{getMessage()}</p>
        <button
          className="popup-button enable-button"
          onClick={() =>
            alert(
              "Please enable location services from your browser or device settings."
            )
          }
        >
          Enable Location
        </button>
        <button className="popup-button close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ShowErrorPopup;

ShowErrorPopup.propTypes = {
  errorCode: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
