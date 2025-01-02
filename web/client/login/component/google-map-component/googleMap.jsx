import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useLoadScript } from "@react-google-maps/api";
import getSocket from "../socket/socketService";

const libraries = ["marker"]; // Required for AdvancedMarkerElement

const GoogleMaps = ({ latitude, longitude, busLocations }) => {
  const mapContainerRef = useRef(null); // Ref for map container
  const mapRef = useRef(null); // Ref to store map instance
  const markersRef = useRef(new Map()); // To store markers keyed by bus_id

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOTXuigdl1ZWQw2bNYFXUhh5cgoHYJ2qQ", // Replace with your API key
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;

    // Initialize the map if it hasn't been initialized
    if (!mapRef.current) {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        zoom: 10,
        center: { lat: latitude - 0.0822553, lng: longitude + 0.1459544 },
        mapId: "93841342ef5456f5", // Replace with your valid Map ID
      });
      mapRef.current = map;
    }

    const map = mapRef.current;

    // WebSocket Logic
    const socket = getSocket();
    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("bus-location", (data) => {
      const { bus_id, latitude, longitude } = data;

      // Validate received coordinates
      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        isNaN(latitude) ||
        isNaN(longitude)
      ) {
        console.error(`Invalid coordinates for bus ID ${bus_id}:`, data);
        return;
      }

      console.log("Bus location received:", latitude, ",", longitude);

      if (!markersRef.current.has(bus_id)) {
        console.log("Creating new marker for bus:", bus_id);

        // Create a new AdvancedMarkerElement
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: latitude, lng: longitude }, // Use the provided coordinates
          map,
          title: `Bus ID: ${bus_id}`,
        });
        markersRef.current.set(bus_id, marker);
      } else {
        console.log("Updating marker position for bus:", bus_id);

        // Update the position of the existing marker
        const marker = markersRef.current.get(bus_id);
        if (marker) {
          marker.position = new window.google.maps.LatLng(latitude, longitude);
        } else {
          console.warn(`Marker not found for bus ID: ${bus_id}`);
        }
      }
    });

    return () => {
      socket.off("bus-location");
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current.clear();
    };
  }, [isLoaded, mapContainerRef]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%", // Full-width container
        height: "100vh", // Full-height container
      }}
    />
  );
};

GoogleMaps.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  busLocations: PropTypes.array, // For additional custom data, if needed
};

export default GoogleMaps;
