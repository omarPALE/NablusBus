import { useState } from "react";
import PropTypes from "prop-types";
import GoogleMaps from "../google-map-component/googleMap";
import "./Home.css";

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
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="sidebar-title">Admin Dashboard</h1>
        <ul className="sidebar-list">
          <li className="sidebar-item">Overview</li>
          <li className="sidebar-item">Manage Users</li>
          <li className="sidebar-item">Reports</li>
          <li className="sidebar-item">Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <span className="main-title">Next.js Google Maps!</span>
        <div className="map-container">
          <GoogleMaps
            style="map-style"
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
        <div className="info-container">
          <span className="info-item">Address: {address}</span>
          <span className="info-item">Latitude: {latitude}</span>
          <span className="info-item">Longitude: {longitude}</span>
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
