import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import QRCode from "react-qr-code"; // Using react-qr-code
// import axios from "axios";
import "./pop-styles.css";
const TicketSection = (props) => {
  const ticketRef = useRef(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [ticketInfo] = useState({
    departure: "Downtown",
    destination: "Madison",
    class: "Standard",
    seatNumber: "16B",
    busNumber: "A-12345",
    ticketPrice: "$7",
    departureTime: "10:00 AM",
    date: "September 20, 2024",
    qr_code: "", // Initialize qr_code as an empty string
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

  // useEffect(() => {
  //   if (!props.isMyTicket || !props.ticketID) {
  //     console.log("Effect skipped due to invalid conditions");
  //     return; // Prevent the effect from firing if conditions aren't met
  //   }

  //   const fetchQRCode = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/api/ticket/${props.ticketID}`
  //       );
  //       setTicketInfo((prevInfo) => ({
  //         ...prevInfo,
  //         qr_code: response.data.qr_code, // Update qr_code in ticketInfo
  //       }));
  //     } catch (error) {
  //       console.error("Error fetching QR code:", error);
  //     }
  //   };

  //   fetchQRCode();
  // }, [props.ticketID, props.isMyTicket]);

  const handlePopupOpen = () => setPopupVisible(true);
  const handlePopupClose = () => setPopupVisible(false);
  // = JSON.stringify({
  //   price: props.ticketPrice,
  //   departure: props.departure || ticketInfo.departure,
  //   destination: props.destination || ticketInfo.destination,
  //   classType: props.classType || ticketInfo.class,
  //   seatNumber: props.seatNumber || ticketInfo.seatNumber,
  //   busNumber: props.busNumber || ticketInfo.busNumber,
  // });

  // useEffect(() => {
  //   if (props.setQRcode) {
  //     props.setQRcode(ticketInfo.qr_code);
  //   }
  // }, [props.qrCode, props.setQRcode]); // Run only when qrValue changes

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
                {props.ticket.departure || ticketInfo?.departure}
              </p>
              <p>
                <strong>Destination:</strong>{" "}
                {props.ticket?.destination || ticketInfo.destination}
              </p>
              <p>
                <strong>Class:</strong>{" "}
                {props.ticket?.model || ticketInfo.class}
              </p>
            </div>
            <div className="ticket-info">
              <p>
                <strong>Seat Number:</strong>{" "}
                {props.ticket?.seatNumber || ticketInfo.seatNumber}
              </p>
              <p>
                <strong>Bus Number:</strong>{" "}
                {props.ticket?.busNumber || ticketInfo.busNumber}
              </p>
              <p>
                <strong>Ticket Price:</strong>{" "}
                {props.ticket?.price || ticketInfo.ticketPrice}
              </p>
            </div>
            <div className="ticket-info">
              <p>
                <strong>Departure Time:</strong>{" "}
                {props.ticket.departureTime || ticketInfo.departureTime}
              </p>
              <p>
                <strong>Date:</strong> {props.date || ticketInfo.date}
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
            {
              <QRCode
                value={props.ticket.qr_code} // QR Code dat
                size={200} // Size of the QR Code
              />
            }
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
  setQRcode: PropTypes.func.isRequired, // Function to set QR code value
  key: PropTypes.string.isRequired, // Unique key for the ticket
  ticketID: PropTypes.string.isRequired, // Unique key for the ticket
  isMyTicket: PropTypes.bool.isRequired, // Flag to show or hide the QR code section
  date: PropTypes.string.isRequired,
};

TicketSection.propTypes = { ticket: PropTypes.object.isRequired };
export default TicketSection;
