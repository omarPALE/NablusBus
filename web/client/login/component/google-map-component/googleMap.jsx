import { useEffect, useRef, useState } from "react";
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
  const infoWindowRef = useRef(null); // Ref for the info window
  const [selectedBus, setSelectedBus] = useState(null); // Store selected bus data
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOTXuigdl1ZWQw2bNYFXUhh5cgoHYJ2qQ", // Replace with your API key
    libraries,
  });

  // Mock trip data

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

    // Initialize the info window
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }

    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("bus-location", (data) => {
      const { bus_id, latitude, longitude, tripData } = data;
      console.log("Trip data are :", tripData);
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

      // Custom SVG icon content
      const busSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#4285F4">
          <path d="M5 16v-6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v6h1v2h-1v1h-3v-1h-8v1h-3v-1h-1v-2h1zm2-1h2v-4h-2v4zm6 0h2v-4h-2v4zm-8-11c-1.1 0-2 .9-2 2h16c0-1.1-.9-2-2-2h-12z"/>
        </svg>
      `;

      // Add or update markers
      if (!markersRef.current.has(bus_id)) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: latitude, lng: longitude },
          content: new DOMParser().parseFromString(busSvg, "text/html").body
            .firstChild, // Parse SVG to DOM element
        });

        marker.addListener("click", () => {
          console.log("bus clickerd!!!!!:  ", tripData);

          if (tripData) {
            setSelectedBus(tripData); // Update the state with selected trip data
          }
        });

        markersRef.current.set(bus_id, { marker, bus_id }); // Store marker and bus_id in markersRef
        marker.setMap(map);
      } else {
        const markerData = markersRef.current.get(bus_id);
        if (markerData?.marker) {
          markerData.marker.position = new window.google.maps.LatLng(
            latitude,
            longitude
          );
        }
      }

      // Refresh the MarkerClusterer
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }

      clustererRef.current = new MarkerClusterer({
        map,
        markers: Array.from(markersRef.current.values()).map(
          (data) => data.marker
        ),
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
    <>
      <div
        ref={mapContainerRef}
        style={{
          width: "100%", // Full-width container
          height: "100vh", // Full-height container
        }}
      />

      {selectedBus && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "0",
            width: "300px",
            background: "#fff",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <h3>Trip Info</h3>
          <p>
            <strong>Bus ID:</strong> {selectedBus.bus_id}
          </p>
          <p>
            <strong>Driver:</strong> {selectedBus.username}
          </p>
          <p>
            <strong>Route:</strong> {selectedBus.route}
          </p>
          <p>
            <strong>Passengers:</strong> {selectedBus.passenger_count}
          </p>
          <p>
            <strong>Start Time:</strong> {selectedBus.start_time}
          </p>
          <p>
            <strong>End Time:</strong> {selectedBus.end_time}
          </p>
          {/* <h4>Stops</h4>
          <ul>
            {selectedBus.stops.map((stop, index) => (
              <li key={index}>{stop}</li>
            ))}
          </ul> */}
          <button onClick={() => setSelectedBus(null)}>Close</button>
        </div>
      )}
    </>
  );
};

GoogleMaps.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};

export default GoogleMaps;
