import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code"; // Using react-qr-code
import "./pop-styles.css";
const TicketSection = () => {
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          } else {
            entry.target.classList.remove("animate");
          }
        });
      },
      { threshold: 0.1 }
    );

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
                <strong>Departure:</strong> {ticketInfo.departure}
              </p>
              <p>
                <strong>Destination:</strong> {ticketInfo.destination}
              </p>
              <p>
                <strong>Class:</strong> {ticketInfo.class}
              </p>
            </div>
            <div className="ticket-info">
              <p>
                <strong>Seat Number:</strong> {ticketInfo.seatNumber}
              </p>
              <p>
                <strong>Bus Number:</strong> {ticketInfo.busNumber}
              </p>
              <p>
                <strong>Ticket Price:</strong> {ticketInfo.ticketPrice}
              </p>
            </div>
            <div className="ticket-info">
              <p>
                <strong>Departure Time:</strong> {ticketInfo.departureTime}
              </p>
              <p>
                <strong>Date:</strong> {ticketInfo.date}
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

export default TicketSection;
