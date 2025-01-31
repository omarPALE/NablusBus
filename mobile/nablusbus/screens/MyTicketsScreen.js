import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Ticket from "../components/Ticket"; // Import the Ticket component

const MyTicketsScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [userState?.user_id]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6000" />
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
    <View style={styles.container}>
      <Text style={styles.title}>My Tickets</Text>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Ticket ticket={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
});

export default MyTicketsScreen;
