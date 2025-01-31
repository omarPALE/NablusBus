import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CameraView, CameraType } from "expo-camera";

const DriverScreen = ({ userState }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [tripInfo, setTripInfo] = useState({
    route: "Route A",
    status: "Ongoing",
    passengerCount: 12,
  });

  const [ridesLeft, setRidesLeft] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);

  React.useEffect(() => {
    async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      console.log("hi with", hasPermission);
    };
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const ticketData = JSON.parse(data);
    console.log(ticketData);
    if (ticketData.rides_left > 0) {
      setRidesLeft(ticketData.rides_left - 1);
      Alert.alert(
        "Success",
        `Ride validated! Rides left: ${ticketData.rides_left - 1}`,
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } else {
      Alert.alert("Failure", "No rides left on this ticket.", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }
  };

  // if (hasPermission === null) {
  //   return <Text>Requesting camera permission...</Text>;
  // }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tripCard}>
        <Text style={styles.title}>Trip Management</Text>
        <Text>Route: {tripInfo.route}</Text>
        <Text>Status: {tripInfo.status}</Text>
        <Text>Passenger Count: {tripInfo.passengerCount}</Text>
        <Button
          title="Finish Trip"
          color="red"
          onPress={() => Alert.alert("Trip Finished", "This trip has ended.")}
        />
        <Button
          title="Scan Passenger Ticket"
          onPress={() => setScannerVisible(true)}
        />
      </View>

      {scannerVisible && (
        <View style={styles.scannerContainer}>
          <CameraView
            barCodeScannerSettings={{
              barCodeTypes: ["qr"], // Enable only QR codes
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
