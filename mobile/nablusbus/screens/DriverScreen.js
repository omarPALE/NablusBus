import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView } from "expo-camera";
import axios from "axios";

const DriverScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setMessage("Processing...");
    try {
      const scannedData = JSON.parse(data); // Parse JSON from QR Code
      const ticketID = scannedData.ticket_id; // Extract ticket_id
      console.log("hi from back end :validate");
      if (!ticketID) {
        setMessage("❌ Invalid QR Code: Missing Ticket ID");
        return;
      }

      const response = await axios.post(
        "http://192.168.1.3:5000/api/scanner/validate-ticket",
        { ticket_id: ticketID }
      );
      console.log("the responce is :", ticketID);
      if (response.data.valid) {
        setMessage(
          `✅ Ticket validated successfully! Remaining rides: ${response.data.rides_left}`
        );
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      setMessage("⚠️ Error processing QR Code. Try again.");
      console.error("Error processing QR Code:", error);
    }
  };

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tripCard}>
        <Text style={styles.title}>Driver QR Scanner</Text>
        {message && <Text style={styles.message}>{message}</Text>}
        <Button
          title="Scan Passenger Ticket"
          onPress={() => setScannerVisible(true)}
        />
      </View>

      {scannerVisible && (
        <View style={styles.scannerContainer}>
          <CameraView
            barCodeScannerSettings={{ barCodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => {
              setScannerVisible(false);
              setScanned(false);
            }}
          >
            <Text style={styles.exitButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  tripCard: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
    marginVertical: 10,
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
});

export default DriverScreen;
