import { useState, useEffect } from "react";
import axios from "axios";
import TicketSection from "../Subscription-component/Ticket-section"; // Import the reusable TicketSection component
import "./TicketManagement.css";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]); // State to hold tickets data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors
  const [isTicketPage] = useState(true); // Boolean flag to indicate if it's a ticket page

  // Fetch ticket data from the database
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tickets");
        setTickets(response.data); // Assuming the backend returns a list of tickets
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch tickets. Please try again later." + err);
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

  return (
    <div className="ticket-management-container">
      <h1>Ticket Management</h1>
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <TicketSection
            key={ticket.id} // Use ticket.id for unique key
            ticket={ticket} // Pass individual ticket object
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
            isMyTicket={isTicketPage} // Flag to determine if the ticket belongs to the user
          />
        ))}
      </div>
    </div>
  );
};

export default TicketManagement;
