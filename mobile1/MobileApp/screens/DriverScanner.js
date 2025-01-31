import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, CameraType } from "expo-camera";
import axios from "axios";

const DriverScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState("");
  const [passengerCount, setPassengerCount] = useState(0);
  const [scannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/validate-ticket",
        {
          qrCode: data,
        }
      );

      if (response.data.valid) {
        setPassengerCount((prevCount) => prevCount + 1);
        Alert.alert("Success", "✅ Ticket validated successfully!");
      } else {
        Alert.alert("Failure", "❌ Invalid ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error validating ticket:", error);
      Alert.alert("Error", "⚠️ Error connecting to the server.");
    }

    setTimeout(() => {
      setScanned(false);
    }, 2000);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera. Please enable permissions.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver QR Scanner</Text>

      <View style={styles.passengerInfo}>
        <Text style={styles.passengerCount}>
          🚌 Passengers Onboard: {passengerCount}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => setScannerVisible(true)}
      >
        <Text style={styles.scanButtonText}>Scan Passenger Ticket</Text>
      </TouchableOpacity>

      {scannerVisible && (
        <View style={styles.scannerContainer}>
          <CameraView
            barCodeScannerSettings={{
              barCodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />

          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => setScannerVisible(false)}
          >
            <Text style={styles.exitButtonText}>Exit Scanner</Text>
          </TouchableOpacity>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  exitButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#ff6000",
    padding: 15,
    borderRadius: 10,
  },
  exitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scanButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  passengerInfo: {
    marginTop: 20,
  },
  passengerCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
});

export default DriverScanner;
