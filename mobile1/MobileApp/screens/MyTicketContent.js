import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import TicketSection from "./TicketSection";
import * as BarCodeScanner from 'expo-barcode-scanner';

const MyTicketContent = () => {
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6600" />
        <Text>Loading tickets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Ticket Management</Text>
      <View style={styles.ticketList}>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  ticketList: {
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default MyTicketContent;