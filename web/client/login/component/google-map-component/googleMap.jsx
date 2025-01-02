import { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import getSocket from "../socket/socketService";

const libraries = ["marker"]; // Required for AdvancedMarkerElement

const GoogleMaps = ({
  style,
  address,
  setAddress,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  userState,
}) => {
  const [map, setMap] = useState(null);
  const markersRef = useRef(new Map()); // Store markers keyed by bus_id
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOTXuigdl1ZWQw2bNYFXUhh5cgoHYJ2qQ", // Replace with your API key
    libraries,
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  useEffect(() => {
    if (!map) {
      console.warn("Map is not initialized yet.");
      return;
    }

    console.log("Map is initialized:", map);

    // Proceed with WebSocket logic after map is ready
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("bus-location", (data) => {
      const { bus_id, latitude, longitude } = data;

      if (!markersRef.current.has(bus_id)) {
        // Create a new AdvancedMarkerElement
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: latitude, lng: longitude },
          map,
          title: `Bus ID: ${bus_id}`,
        });
        markersRef.current.set(bus_id, marker);
      } else {
        // Update the position of the existing marker
        const marker = markersRef.current.get(bus_id);
        marker.position = new window.google.maps.LatLng(latitude, longitude);
      }
    });

    return () => {
      socket.off("bus-location");
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current.clear();
    };
  }, [map]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%", // Set width of the container
        height: "100vh", // Set height of the container
      }}
      center={center}
      zoom={10}
      mapId="93841342ef5456f5"
      options={{
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
      }}
      onLoad={(map) => {
        console.log("Map loaded:", map);
        setMap(map);
      }}
    />
  );
};

GoogleMaps.propTypes = {
  style: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  setAddress: PropTypes.func.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  setLatitude: PropTypes.func.isRequired,
  setLongitude: PropTypes.func.isRequired,
  userState: PropTypes.object.isRequired,
};

export default GoogleMaps;
