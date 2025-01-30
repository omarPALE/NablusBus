import { StyleSheet } from "react-native";
import * as BarCodeScanner from 'expo-barcode-scanner';

const styles = StyleSheet.create({
  ticketCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  ticketHeader: {
    backgroundColor: "#ff6a00",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  ticketBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  ticketInfo: {
    flex: 1,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  qrButton: {
    backgroundColor: "#ff6a00",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  qrButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default styles;