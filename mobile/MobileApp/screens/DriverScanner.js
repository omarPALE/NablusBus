import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import * as BarCodeScanner from 'expo-barcode-scanner';
import axios from "axios";

const DriverScanner = () => {
  const [hasPermission, setHasPermission] = useState(null); // Camera permission
  const [scanned, setScanned] = useState(false); // QR code scanned state
  const [message, setMessage] = useState(""); // Message feedback
  const [passengerCount, setPassengerCount] = useState(0); // Passenger count

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Handle QR code scan
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      // Call the backend API to validate the QR code
      const response = await axios.post("http://localhost:5000/validate-ticket", {
        qrCode: data,
      });

      if (response.data.valid) {
        setPassengerCount((prevCount) => prevCount + 1); // Increment passenger count
        setMessage("✅ Ticket validated successfully!");
      } else {
        setMessage("❌ Invalid ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error validating ticket:", error);
      setMessage("⚠️ Error connecting to the server.");
    }
  };

  // Reset scanner after a delay
  useEffect(() => {
    if (scanned) {
      setTimeout(() => {
        setScanned(false);
        setMessage("");
      }, 2000); // Reset after 2 seconds
    }
  }, [scanned]);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera. Please enable camera permissions.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver QR Scanner</Text>

      {/* QR Scanner */}
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Align QR Code within the frame</Text>
        </View>
      </View>

      {/* Passenger Count */}
      <View style={styles.passengerInfo}>
        <Text style={styles.passengerCount}>🚌 Passengers Onboard: {passengerCount}</Text>
      </View>

      {/* Message Feedback */}
      {message && (
        <View style={[styles.message, message.includes("✅") ? styles.success : styles.error]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  scannerContainer: {
    width: 300,
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#007bff",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 14,
  },
  passengerInfo: {
    marginTop: 20,
  },
  passengerCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
  message: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  success: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
  },
  error: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DriverScanner;