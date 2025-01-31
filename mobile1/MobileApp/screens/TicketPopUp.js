import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";

const TicketPopUp = ({
  setIsPopupOpen,
  ticketData,
  userState,
  setTicketData,
  pricingData,
  qr_code,
  setQRcode,
}) => {
  return (
    <View style={styles.popupOverlay}>
      <View style={styles.popupContent}>
        <Text style={styles.popupTitle}>Ticket Created Successfully!</Text>
        <Text style={styles.popupText}>
          <Text style={styles.label}>Ticket Type:</Text> {ticketData.ticketType}
        </Text>
        <Text style={styles.popupText}>
          <Text style={styles.label}>Price:</Text> NIS {ticketData.price}
        </Text>
        <Text style={styles.popupText}>
          <Text style={styles.label}>Rides Left:</Text> {ticketData.rides_left}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsPopupOpen(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  popupText: {
    marginTop: 8,
  },
  label: {
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ff6600",
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TicketPopUp;
