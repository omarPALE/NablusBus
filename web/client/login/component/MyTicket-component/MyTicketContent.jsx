import TicketSection from "../Subscription-component/Ticket-section"; // Import the reusable TicketSection component
import "./TicketManagement.css";

const TicketManagement = () => {
  const tickets = [
    {
      id: 1,
      departure: "Chicago",
      destination: "Madison",
      classType: "Standard",
      seatNumber: "16B",
      busNumber: "A-12345",
      ticketPrice: "$7",
      departureTime: "10:00 AM",
      date: "September 20, 2024",
      status: "Completed",
    },
    {
      id: 2,
      departure: "Chicago",
      destination: "Madison",
      classType: "Premium",
      seatNumber: "12A",
      busNumber: "B-54321",
      ticketPrice: "$10",
      departureTime: "2:00 PM",
      date: "September 21, 2024",
      status: "Upcoming",
    },
  ];

  return (
    <div className="ticket-management-container">
      <h1>Ticket Management</h1>
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <TicketSection
            key={ticket.id}
            departure={ticket.departure}
            destination={ticket.destination}
            classType={ticket.classType}
            seatNumber={ticket.seatNumber}
            busNumber={ticket.busNumber}
            ticketPrice={ticket.ticketPrice}
            departureTime={ticket.departureTime}
            date={ticket.date}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketManagement;
