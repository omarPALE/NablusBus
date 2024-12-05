import { useState, useEffect } from "react";
import axios from "axios";
import TicketSection from "../Subscription-component/Ticket-section"; // Import the reusable TicketSection component
import "./TicketManagement.css";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]); // State to hold tickets data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors

  // Fetch ticket data from the database
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tickets");
        setTickets(response.data); // Assuming the backend returns a list of tickets
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch tickets. Please try again later.", err);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }
  console.log("ticket data is:", tickets);

  return (
    <div className="ticket-management-container">
      <h1>Ticket Management</h1>
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <TicketSection
            key={ticket.id}
            ticketID={ticket.id}
            departure={ticket.departure}
            destination={ticket.destination}
            classType={ticket.model || "N/A"} // Model as classType
            seatNumber={ticket.seatNumber || "N/A"}
            busNumber={ticket.busNumber || "N/A"}
            ticketPrice={ticket.price || "N/A"}
            departureTime={ticket.departureTime || "N/A"}
            date={
              ticket.created_at
                ? new Date(ticket.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"
            }
            status={ticket.status || "N/A"} // Status of the ticket
          />
        ))}
      </div>
    </div>
  );
};

export default TicketManagement;
