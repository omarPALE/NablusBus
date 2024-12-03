import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import QRCode from "react-qr-code"; // Using react-qr-code
import "./pop-styles.css";
const TicketSection = (props) => {
  const ticketRef = useRef(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [ticketInfo] = useState({
    departure: "Chicago",
    destination: "Madison",
    class: "Standard",
    seatNumber: "16B",
    busNumber: "A-12345",
    ticketPrice: "$7",
    departureTime: "10:00 AM",
    date: "September 20, 2024",
  });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.7, // 50% of the element must be visible to trigger the animation
      rootMargin: "0px 0px -100px 0px", // Adds an offset to delay animation triggering
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        } else {
          entry.target.classList.remove("animate");
        }
      });
    }, observerOptions);

    if (ticketRef.current) observer.observe(ticketRef.current);

    return () => {
      if (ticketRef.current) observer.unobserve(ticketRef.current);
    };
  }, []);

  const handlePopupOpen = () => setPopupVisible(true);
  const handlePopupClose = () => setPopupVisible(false);

  return (
    <section className="ticket-section">
      <div className="ticket-title">
        <h2>Ticket Details</h2>
      </div>
      <div className="ticket-container" ref={ticketRef}>
        <div className="ticket-header">
          <h2>Bus Transportation Pass</h2>
        </div>
        <div className="ticket-body">
          <div className="ticket-details">
            <div className="ticket-info">
              <p>
                <strong>Departure:</strong>{" "}
                {ticketInfo.departure || props.departure}
              </p>
              <p>
                <strong>Destination:</strong>{" "}
                {ticketInfo.destination || props.destination}
              </p>
              <p>
                <strong>Class:</strong> {ticketInfo.class || props.classType}
              </p>
            </div>
            <div className="ticket-info">
              <p>
                <strong>Seat Number:</strong>{" "}
                {ticketInfo.seatNumber || props.seatNumber}
              </p>
              <p>
                <strong>Bus Number:</strong>{" "}
                {ticketInfo.busNumber || props.busNumber}
              </p>
              <p>
                <strong>Ticket Price:</strong>{" "}
                {ticketInfo.ticketPrice || props.ticketPrice}
              </p>
            </div>
            <div className="ticket-info">
              <p>
                <strong>Departure Time:</strong>{" "}
                {ticketInfo.departureTime || props.departureTime}
              </p>
              <p>
                <strong>Date:</strong> {ticketInfo.date || props.date}
              </p>
            </div>
          </div>
          <div className="ticket-barcode">
            <button className="qr-code-btn" onClick={handlePopupOpen}>
              QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Popup for QR Code */}
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={handlePopupClose}>
              Close
            </button>
            <h3>QR Code for Ticket</h3>
            <QRCode
              value={JSON.stringify(ticketInfo)} // QR Code data
              size={200} // Size of the QR Code
            />
            <p>
              <strong>Trip Info:</strong> {ticketInfo.departure} to{" "}
              {ticketInfo.destination}, Seat: {ticketInfo.seatNumber}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

// Define PropTypes for the component
TicketSection.propTypes = {
  departure: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  classType: PropTypes.string.isRequired,
  seatNumber: PropTypes.string.isRequired,
  busNumber: PropTypes.string.isRequired,
  ticketPrice: PropTypes.string.isRequired,
  departureTime: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
export default TicketSection;
