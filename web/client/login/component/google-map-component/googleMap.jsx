import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { GoogleMap, useLoadScript, Circle } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import axios from "axios";

const libraries = ["places"];

const GoogleMaps = ({
  radius,
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
  const [busLocations, setBusLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOTXuigdl1ZWQw2bNYFXUhh5cgoHYJ2qQ",
    libraries,
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  const fetchAllRecentLocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/bus-locations/recent"
      );
      console.log("Fetched all recent locations successfully:", response.data);
      console.log(
        "Invalid locations:",
        response.data.filter(
          (loc) =>
            isNaN(parseFloat(loc.latitude)) || isNaN(parseFloat(loc.longitude))
        )
      );

      setBusLocations(
        response.data.map((loc) => ({
          bus_id: loc.bus_id,
          lat: parseFloat(loc.latitude),
          lng: parseFloat(loc.longitude),
        }))
      );
      setErrorMessage(null); // Clear previous errors
    } catch (error) {
      console.error("Error fetching all recent locations:", error);
      setErrorMessage(
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred while fetching recent bus locations."
      );
    }
  };

  useEffect(() => {
    fetchAllRecentLocations();
    const interval = setInterval(fetchAllRecentLocations, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  useEffect(() => {
    if (map && busLocations.length > 0) {
      const markers = busLocations.map((loc) => {
        return new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          title: `Bus ID: ${loc.bus_id}`,
          icon: {
            url: "https://maps.google.com/mapfiles/kml/shapes/bus.png",
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });
      });

      const markerCluster = new MarkerClusterer({ markers, map });
      return () => markerCluster.clearMarkers();
    }
  }, [map, busLocations]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="w-full height-96">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={10}
        options={{
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
        }}
        onLoad={(map) => setMap(map)}
      >
        <Circle
          options={{
            fillColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeColor: "#FF0000",
            strokeWeight: 2,
            fillOpacity: 0.35,
          }}
          center={center}
          radius={radius}
        />
      </GoogleMap>
    </div>
  );
};

GoogleMaps.propTypes = {
  style: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  setAddress: PropTypes.func.isRequired,
  radius: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  setLatitude: PropTypes.func.isRequired,
  setLongitude: PropTypes.func.isRequired,
  userState: PropTypes.object.isRequired,
};

export default GoogleMaps;
