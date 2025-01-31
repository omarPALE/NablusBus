import TicketSection from "../Subscription-component/Ticket-section"; // Import the reusable TicketSection component
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./TicketManagement.css";
import axios from "axios";

const TicketManagement = ({ userState }) => {
  const [tickets, setTickets] = useState([]); // State to hold tickets data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors
  const [isTicketPage] = useState(true); // Boolean flag to indicate if it's a ticket page
  // Fetch ticket data from the database
  useEffect(() => {
    const fetchTicket = async () => {
      if (!userState?.user_id) {
        setError("User ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/ticket/${userState.user_id}`
        );
        console.log(response.data);

        if (response.status === 200) {
          setTickets(response.data); // Should be just the `qrCode` based on your backend
        } else {
          setError("Ticket not found.");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No active ticket found. Please buy a ticket to continue.");
        } else {
          setError(
            "Failed to fetch ticket. Please try again later. " + err.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [userState?.user_id]); // Depend on `userState.userID` to refetch if it changes
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
        {tickets.map((ticket) => {
          console.log(ticket.id);
          return (
            <TicketSection
              key={ticket.id} // Use ticket.id for unique key
              ticket_id={ticket.id}
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
          );
        })}
      </div>
    </div>
  );
};

TicketManagement.propTypes = {
  userState: PropTypes.Obj,
  setUserState: PropTypes.func,
};

export default TicketManagement;
