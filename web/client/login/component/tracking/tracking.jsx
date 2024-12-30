import { useState } from "react";
import PropTypes from "prop-types";
import GoogleMaps from "../google-map-component/googleMap";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: 24.799448,
    longitude: 54.979021,
    radius: 500,
  });

  const [latitude, setLatitude] = useState(24.799448);
  const [longitude, setLongitude] = useState(54.979021);
  const [address, setAddress] = useState("");

  const mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500">
      <div className="flex flex-col w-full items-center gap-y-4">
        <span className="text-6xl text-gray-700 font-bold">
          Next.js Google Maps!
        </span>
        <div className="w-[30%] h-96">
          <GoogleMaps
            style="w-[50%] px-4 py-2 border-b-[1px] border-[#E5E5E3]"
            address={address}
            setAddress={setAddress}
            radius={form.radius}
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            mapStyles={mapStyles}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl">Address: {address}</span>
          <span className="text-xl">Latitude: {latitude}</span>
          <span className="text-xl">Longitude: {longitude}</span>
        </div>
      </div>
    </div>
  );
}

GoogleMaps.propTypes = {
  style: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  setAddress: PropTypes.func.isRequired,
  radius: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  setLatitude: PropTypes.func.isRequired,
  setLongitude: PropTypes.func.isRequired,
  mapStyles: PropTypes.array,
};
