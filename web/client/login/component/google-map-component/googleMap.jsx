import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useLoadScript } from "@react-google-maps/api";
import getSocket from "../socket/socketService";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const libraries = ["marker"]; // Required for AdvancedMarkerElement

const GoogleMaps = ({ latitude, longitude, userState }) => {
  const mapContainerRef = useRef(null); // Ref for map container
  const mapRef = useRef(null); // Ref to store map instance
  const markersRef = useRef(new Map()); // To store markers keyed by bus_id
  const clustererRef = useRef(null); // Store the MarkerClusterer instance
  const infoWindowRef = useRef(null); // Ref for the info window

  // Removed sendRequest and added isSubscribed to track an active subscription
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null); // Store selected bus data
  const [tempBusId, setBusId] = useState();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOTXuigdl1ZWQw2bNYFXUhh5cgoHYJ2qQ", // Replace with your API key
    libraries,
  });
  // Popup style state for the bus info window
  const [popupStyle, setPopStyles] = useState({});

  // The Notify Me handler:
  // • Gets the user’s location,
  // • Calls your subscription endpoint,
  // • And, on success, sets isSubscribed to true.
  const handleNotifyMe = async (busId) => {
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const passengerId = userState.userState.user_id;
          if (userLat == null || userLng == null) {
            alert("Cannot subscribe: Missing location data.");
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
            // Set the subscription flag so that we start listening for the "bus-nearby" event.
            setIsSubscribed(true);
          } catch (error) {
            console.error("Subscription error:", error);
            alert("An error occurred while subscribing for notifications.");
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
    console.log(userState);
  }, [userState]);

  const socket = getSocket();

  // Initialize the map and info window once the Google Maps script is loaded.
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        zoom: 10,
        center: { lat: latitude, lng: longitude },
        mapId: "93841342ef5456f5", // Replace with your map ID
      });
      mapRef.current = map;
    }

    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }
  }, [isLoaded, latitude, longitude]);

  // When the socket connects, join the user's room.
  useEffect(() => {
    socket.on("connect", () => {
      console.log(
        "Connected to WebSocket server:",
        socket.id,
        userState.userState.user_id
      );
      socket.emit("join-user-room", { userId: userState.userState.user_id });
    });

    return () => {
      socket.off("connect");
    };
  }, [socket, userState]);

  // Listen for "bus-nearby" events only when the user is subscribed.
  useEffect(() => {
    if (!isSubscribed) return;
    const handleBusNearby = (data) => {
      alert(`Bus #${data.bus_id} is near your location!`);
      // toast.success(`🚍 Bus #${data.bus_id} is near your location!`, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
      // Clear the subscription flag so we stop listening.
      setIsSubscribed(false);
    };

    socket.on("bus-nearby", handleBusNearby);

    return () => {
      socket.off("bus-nearby", handleBusNearby);
    };
  }, [isSubscribed, socket]);

  // Listen for "bus-location" events and manage markers on the map.
  useEffect(() => {
    const handleBusLocation = (data) => {
      const { bus_id, latitude, longitude, tripDataForCallback } = data;

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

      // Save the bus id (used later by the Notify Me button)
      setBusId(bus_id);

      // Custom SVG icon for bus marker
      const busSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#4285F4">
        <path d="M5 16v-6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v6h1v2h-1v1h-3v-1h-8v1h-3v-1h-1v-2h1zm2-1h2v-4h-2v4zm6 0h2v-4h-2v4zm-8-11c-1.1 0-2 .9-2 2h16c0-1.1-.9-2-2-2h-12z"/>
      </svg>
    `;

      const map = mapRef.current;
      if (!map) return;

      // Add or update markers
      if (!markersRef.current.has(bus_id)) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: latitude, lng: longitude },
          content: new DOMParser().parseFromString(busSvg, "text/html").body
            .firstChild,
        });

        marker.addListener("click", (mapsMouseEvent) => {
          const mouseX = mapsMouseEvent.domEvent.clientX;
          const mouseY = mapsMouseEvent.domEvent.clientY;

          if (tripDataForCallback) {
            setSelectedBus(tripDataForCallback);
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
              left: `${mouseX + 50}px`,
              top: `${mouseY + 10}px`,
              transform: "translate(-50%, 0)",
            });
          }
        });

        markersRef.current.set(bus_id, { marker, bus_id });
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

      // Refresh the MarkerClusterer with the updated markers
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      clustererRef.current = new MarkerClusterer({
        map,
        markers: Array.from(markersRef.current.values()).map(
          (data) => data.marker
        ),
        gridSize: 60,
        maxZoom: 15,
      });
    };

    socket.on("bus-location", handleBusLocation);

    return () => {
      socket.off("bus-location", handleBusLocation);
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      markersRef.current.clear();
    };
  }, [socket]);

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
        <div className="bus-popup" style={popupStyle}>
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
