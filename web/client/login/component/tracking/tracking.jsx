import GoogleMaps from "../google-map-component/googleMap";
import { useState } from "react";

const Tracking = () => {
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
};

export default Tracking;
