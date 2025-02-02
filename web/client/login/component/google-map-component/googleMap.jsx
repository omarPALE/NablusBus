import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useLoadScript } from "@react-google-maps/api";
import getSocket from "../socket/socketService";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import axios from "axios";
const libraries = ["marker"]; // Required for AdvancedMarkerElement

const GoogleMaps = ({ latitude, longitude, userState }) => {
  const mapContainerRef = useRef(null); // Ref for map container
  const mapRef = useRef(null); // Ref to store map instance
  const markersRef = useRef(new Map()); // To store markers keyed by bus_id
  const clustererRef = useRef(null); // Store the MarkerClusterer instance
  const infoWindowRef = useRef(null); // Ref for the info window
  const [sendRequest, setSendRequest] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null); // Store selected bus data
  const [tempBusId, setBusId] = useState();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOTXuigdl1ZWQw2bNYFXUhh5cgoHYJ2qQ", // Replace with your API key
    libraries,
  });
  // Mock trip data
  const [popupStyle, setPopStyles] = useState({});
  const handleNotifyMe = async (busId) => {
    setSendRequest(true);
    try {
      // (A) Get Passenger’s Current Location
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // If you have a logged-in user, you might have a "userId" from context or props
          const passengerId = userState.userState.user_id; // Example ID; replace with real passenger ID
          // console.log(
          //   busId,
          //   passengerId,
          //   userLat,
          //   userLng,
          //   userState.userState.user_id
          // );
          // (B) Send subscription to the server
          // Example: POST /api/subscribe with busId & passenger location
          if (sendRequest) {
            // Check if latitude or longitude is null or undefined
            if (userLat == null || userLng == null) {
              console.warn(
                "Subscription request not sent due to missing location data."
              );
              alert("Cannot subscribe: Missing location data.");
              setSendRequest(false);
              return;
            }

            try {
              const response = await axios.post(
                "http://localhost:5000/users/subscribe",
                {
                  busId,
                  passengerId,
                  userLat,
                  userLng,
                }
              );

              if (response.status !== 200) {
                console.error("Subscription failed:", response.data);
                alert("Failed to subscribe for notifications");
                return;
              }

              alert("You will be notified when the bus is near your location!");
            } catch (error) {
              console.error("Subscription error:", error);
              alert("An error occurred while subscribing for notifications.");
            }

            setSendRequest(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Could not retrieve your location. Please allow location access."
          );
        }
      );
    } catch (err) {
      console.error("Error in handleNotifyMe:", err);
      alert("An error occurred while subscribing for notifications.");
    }
  };
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
      socket.emit("join-user-room", { userId: userState.userState.user_id });
    });
    socket.on("bus-nearby", (data) => {
      console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiihhhhhhhhhhhhhhhhh");
      // Display a toast or modal
      alert("i am here");
      console.log("Bus near:", data);
      // toast.success(`Bus #${data.bus_id} is near your location!`);
    });
    socket.on("bus-location", (data) => {
      const { bus_id, latitude, longitude, tripDataForCallback } = data;
      // console.log("Trip data are :", data);
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
      setBusId(data.bus_id);
      console.log(
        `Bus ${bus_id} location received:`,
        latitude,
        longitude,
        tripDataForCallback
      );

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

        marker.addListener("click", (mapsMouseEvent) => {
          console.log("bus clickerd!!!!!:  ", tripDataForCallback);
          const mouseX = mapsMouseEvent.domEvent.clientX;
          const mouseY = mapsMouseEvent.domEvent.clientY;

          if (tripDataForCallback) {
            setSelectedBus(tripDataForCallback); // Update the state with selected trip data
            // Get the mouse coordinates relative to the map container
            console.log("trip info", tripDataForCallback);
            console.log("mouse location is :", mouseX, ",", mouseY);

            // Calculate offsets as needed
            const offsetX = 50;
            const offsetY = 10;

            // Calculate CSS position for the popup
            setPopStyles({
              position: "absolute",
              background: "#f9f9f9",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              fontFamily: "'Arial', sans-serif",
              fontSize: "14px",
              color: "#333",
              zIndex: 1000,
              left: `${mouseX + offsetX}px`,
              top: `${mouseY + offsetY}px`,
              transform: "translate(-50%, 0)", // Optional: Center horizontally
            });
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
          className="bus-popup"
          style={popupStyle} // Use the dynamic style here  popupStyle
        >
          <button
            onClick={() => setSelectedBus(null)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#999",
            }}
            title="Close"
          >
            ✖
          </button>
          <h4 style={{ marginBottom: "10px", fontSize: "16px", color: "#555" }}>
            Trip Info
          </h4>
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
            <strong>Start:</strong> {selectedBus.start_time}
          </p>
          <p>
            <strong>End:</strong> {selectedBus.end_time}
          </p>
          <button
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              backgroundColor: "#4285F4",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => handleNotifyMe(tempBusId)}
          >
            Notify Me
          </button>
        </div>
      )}
    </>
  );
};

GoogleMaps.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  userState: PropTypes.object.isRequired,
};

export default GoogleMaps;
