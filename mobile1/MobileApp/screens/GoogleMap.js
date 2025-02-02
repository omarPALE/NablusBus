import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import getSocket from "../screens/SocketService";

const GoogleMaps = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("bus-location", (data) => {
      const { bus_id, latitude, longitude, tripData } = data;
      console.log("sending trip data", data.tripData);
      if (isNaN(latitude) || isNaN(longitude)) {
        console.error(`Invalid coordinates for bus ID ${bus_id}:`, data);
        return;
      }

      setMarkers((prevMarkers) => {
        const existingMarker = prevMarkers.find((m) => m.bus_id === bus_id);
        if (existingMarker) {
          return prevMarkers.map((m) =>
            m.bus_id === bus_id ? { ...m, latitude, longitude } : m
          );
        } else {
          return [...prevMarkers, { bus_id, latitude, longitude, tripData }];
        }
      });
    });

    return () => {
      socket.off("bus-location");
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.bus_id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => setSelectedBus(marker.tripData)}
          />
        ))}
      </MapView>

      {selectedBus && (
        <View style={styles.popup}>
          <Text style={styles.popupTitle}>Trip Info</Text>
          <Text>Bus ID: {selectedBus.bus_id}</Text>
          <Text>Driver: {selectedBus.username}</Text>
          <Text>Route: {selectedBus.route}</Text>
          <Text>Passengers: {selectedBus.passenger_count}</Text>
          <Text>Start: {selectedBus.start_time}</Text>
          <Text>End: {selectedBus.end_time}</Text>
          <Text style={styles.closeButton} onPress={() => setSelectedBus(null)}>
            ✖
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  popup: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 16,
    color: "#999",
  },
});

export default GoogleMaps;
