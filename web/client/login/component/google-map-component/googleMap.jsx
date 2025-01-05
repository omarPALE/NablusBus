import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useLoadScript } from "@react-google-maps/api";
import getSocket from "../socket/socketService";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const libraries = ["marker"]; // Required for AdvancedMarkerElement

const GoogleMaps = ({ latitude, longitude }) => {
  const mapContainerRef = useRef(null); // Ref for map container
  const mapRef = useRef(null); // Ref to store map instance
  const markersRef = useRef(new Map()); // To store markers keyed by bus_id
  const clustererRef = useRef(null); // Store the MarkerClusterer instance

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOTXuigdl1ZWQw2bNYFXUhh5cgoHYJ2qQ", // Replace with your API key
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;

    // Initialize the map
    if (!mapRef.current) {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        zoom: 10,
        center: { lat: latitude, lng: longitude },
        mapId: "93841342ef5456f5", // Replace with your map ID
      });
      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear existing markers if re-rendered
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("bus-location", (data) => {
      const { bus_id, latitude, longitude } = data;

      // Validate coordinates
      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        isNaN(latitude) ||
        isNaN(longitude)
      ) {
        console.error(`Invalid coordinates for bus ID ${bus_id}:`, data);
        return;
      }

      console.log(`Bus ${bus_id} location received:`, latitude, longitude);

      // Add or update markers
      if (!markersRef.current.has(bus_id)) {
        const marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          title: `Bus ID: ${bus_id}`,
        });
        markersRef.current.set(bus_id, marker);
      } else {
        const marker = markersRef.current.get(bus_id);
        if (marker) {
          marker.setPosition(
            new window.google.maps.LatLng(latitude, longitude)
          );
        }
      }

      // Refresh the MarkerClusterer
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      clustererRef.current = new MarkerClusterer({
        map,
        markers: Array.from(markersRef.current.values()),
        gridSize: 60, // Adjust clustering distance
        maxZoom: 15, // Stop clustering at this zoom level
      });
    });

    return () => {
      socket.off("bus-location");
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      markersRef.current.clear();
    };
  }, [isLoaded, latitude, longitude]);

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
};

export default GoogleMaps;
