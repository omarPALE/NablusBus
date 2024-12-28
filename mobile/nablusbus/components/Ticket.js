import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import QRCode from "react-native-qrcode-svg";

const Ticket = ({ ticket }) => {
  const [isQrVisible, setQrVisible] = useState(false);

  const handleQrCodeToggle = () => {
    setQrVisible(!isQrVisible);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Bus Ticket</Text>
      <Text>Departure: {ticket.departure}</Text>
      <Text>Destination: {ticket.destination}</Text>
      <Text>Class: {ticket.class}</Text>
      <Text>Seat Number: {ticket.seatNumber}</Text>
      <Text>Bus Number: {ticket.busNumber}</Text>
      <Text>Price: {ticket.price}</Text>
      <Text>Date: {ticket.date}</Text>

      <TouchableOpacity style={styles.qrButton} onPress={handleQrCodeToggle}>
        <Text style={styles.qrButtonText}>Show QR Code</Text>
      </TouchableOpacity>

      <Modal visible={isQrVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.qrContainer}>
            <QRCode value={ticket.qr_code} size={200} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleQrCodeToggle}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  qrButton: { backgroundColor: "#ff6000", padding: 10, borderRadius: 5 },
  qrButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  qrContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff6000",
    borderRadius: 5,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});

export default Ticket;
