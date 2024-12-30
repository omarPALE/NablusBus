import { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";

import {
  GoogleMap,
  Marker,
  useLoadScript,
  Circle,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const GoogleMaps = ({
  radius,
  setLatitude,
  style,
  address,
  setAddress,
  latitude,
  longitude,
  setLongitude,
}) => {
  const [map, setMap] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOTXuigdl1ZWQw2bNYFXUhh5cgoHYJ2qQ", // Replace with your API key
    libraries: ["places"],
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  const inputRef = useRef();

  const mapStyles = [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }], // Hide points of interest
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }], // Hide transit stations
    },
  ];

  useEffect(() => {
    if (map) {
      map.panTo({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, map]);

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      setAddress(place.formatted_address);
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  const changeCoordinate = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <div className="w-full height-96">
      {isLoaded ? (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
          options={{ styles: mapStyles }} // Apply the custom map styles
          onLoad={(map) => setMap(map)}
          style={{
            heigh: "600px",
          }}
        >
          <StandaloneSearchBox
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}
          >
            <div className="relative ml-48 mt-[10px] w-[500px]">
              <input
                type="text"
                className={`form-control text-black rounded-full bg-white ${style}`}
                value={address}
                placeholder="Search Location..."
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </StandaloneSearchBox>

          <button
            className="z-50 flex justify-center items-center w-12 h-12 transition duration-300 rounded-full"
            onClick={() => map.panTo({ lat: latitude, lng: longitude })}
          >
            <span className="text-xs text-black">Click Me!</span>
          </button>

          <Marker
            draggable
            onDragEnd={changeCoordinate}
            position={{ lat: latitude, lng: longitude }}
          />

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
      ) : (
        <h1>Loading....</h1>
      )}
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
};

export default GoogleMaps;
