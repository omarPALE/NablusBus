import { Card, Col, Row, Button } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import "./OverviewMetrics.css";
import DropdownDetails from "./DropdownDetails";

const OverviewMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false); // Toggle user roles
  const [showTicketDetails, setShowTicketDetails] = useState(false); // Toggle ticket types
  const [tickets, setTickets] = useState([]); // State for tickets

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const userResponse = await axios.get(
          "http://localhost:5000/api/admin/users"
        );
        const ticketResponse = await axios.get(
          "http://localhost:5000/api/admin/tickets"
        );

        // Debugging the API responses
        console.log("User API Response:", userResponse.data);
        console.log("Ticket API Response:", ticketResponse.data);

        const { total_users, roles = [] } = userResponse.data || {};
        const { tickets = [] } = ticketResponse.data;

        // Set states
        setMetrics([{ title: "Total Users", value: total_users }]);
        setRoles(roles);
        setTickets(tickets);

        // Debugging the parsed tickets
        console.log("Parsed tickets:", tickets);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  const toggleUserDetails = () => {
    setShowUserDetails((prevState) => !prevState);
  };
  const toggleTicketDetails = () => {
    setShowTicketDetails((prevState) => !prevState);
  };
  return (
    <div>
      {/* Main Metrics */}
      <Row gutter={16} style={{ margin: "20px 0" }}>  
        {metrics.map((metric, index) => (
          <Col span={6} key={index}>
            <Card
              style={{
                border:
                  metric.title === "Total Users" ? "2px solid #1890ff" : "",
              }}
            >
              {metric.title === "Total Users" ? (
                <Button
                  type="link"
                  aria-label="Toggle User Roles"
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: showUserDetails ? "#1890ff" : "inherit",
                  }}
                  onClick={toggleUserDetails}
                >
                  {metric.title}
                </Button>
              ) : (
                <h3>{metric.title}</h3>
              )}
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                {metric.value}
              </p>
            </Card>
          </Col>
        ))}

        {/* Add a new card for tickets */}
        <Col span={6}>
          <Card style={{ border: "2px solid #52c41a" }}>
            <Button
              type="link"
              aria-label="Toggle Tickets Details"
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: showTicketDetails ? "#52c41a" : "inherit",
              }}
              onClick={toggleTicketDetails}
            >
              Tickets
            </Button>
            {/* Display total tickets value */}
            <p
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Total:{" "}
              {tickets.reduce(
                (total, ticket) => total + (ticket.count || 0),
                0
              )}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Drop-down details for User Roles */}
      <DropdownDetails
        show={showUserDetails}
        data={roles}
        cardStyle={{ background: "#f6f8fa" }}
        renderTitle={(role) =>
          role.role.charAt(0).toUpperCase() + role.role.slice(1)
        }
      />

      {/* Drop-down details for Ticket Types */}
      <DropdownDetails
        show={showTicketDetails}
        data={tickets}
        cardStyle={{ background: "#e6f7ff" }}
        renderTitle={
          (ticket) =>
            ticket.model
              ? ticket.model.charAt(0).toUpperCase() + ticket.model.slice(1)
              : "Unknown Type" // Fallback for missing type
        }
      />
    </div>
  );
};

export default OverviewMetrics;
