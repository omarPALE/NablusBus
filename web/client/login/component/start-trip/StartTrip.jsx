import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./start-trip.css";
import { SocketContext } from "../../src/App"; // Import the SocketContext from App
import ShowErrorPopup from "./showErrorPopup";

const StartTripCard = ({
  availableRoutes,
  onStartTrip,
  userState,
  start,
  setStart,
}) => {
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(availableRoutes);
  const [passengerCount, setPassengerCount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [busId, setBusId] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const socket = useContext(SocketContext); // Access the shared WebSocket instance
  const [tripData, setTripData] = useState({});
  //fetch bus number
  useEffect(() => {
    const fetchBusNumber = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/buses/driver/${userState.work_id}`
        );
        if (response.status === 200) {
          setBusNumber(response.data.busNumber);
          setBusId(response.data.busId);
          console.log("bus id is ", response.data.busId);
        } else {
          alert("Could not retrieve the bus number. Please try again.");
        }
      } catch (error) {
        alert(
          "Error retrieving bus number. Please check your network connection."
        );
      }
    };

    if (userState?.work_id) {
      fetchBusNumber();
    }
  }, [userState?.work_id]);
  //init trip start time
  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    setStartTime(formattedTime);
  }, []);
  //avaliable routes
  const handleSearch = (searchText) => {
    const filtered = availableRoutes.filter((route) =>
      route.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredRoutes(filtered);
    setRoute(searchText);
  };

  const handleSelectRoute = (selectedRoute) => {
    setRoute(selectedRoute);
    setFilteredRoutes(availableRoutes);
    setIsFocused(false);
  };

  const startLocationUpdates = () => {
    let lastRecordedLocation = null; // To store the last recorded location
    console.log("wellcom to fetch last location");
    const fetchLastLocation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/bus-locations/recent/${busId}`
        );
        if (response.status === 200 && response.data) {
          const { latitude, longitude } = response.data;
          lastRecordedLocation = {
            latitude,
            longitude,
          };
          console.log("Last recorded location:", lastRecordedLocation);
        } else {
          console.warn("No previous location found for bus ID:", busId);
        }
      } catch (error) {
        console.error("Error fetching last location:", error);
      }
    };

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3; // Radius of Earth in meters
      const toRadians = (degrees) => (degrees * Math.PI) / 180;

      const φ1 = toRadians(lat1);
      const φ2 = toRadians(lat2);
      const Δφ = toRadians(lat2 - lat1);
      const Δλ = toRadians(lon2 - lon1);

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in meters
    };

    const updateLocation = async (latitude, longitude) => {
      const shouldUpdate =
        !lastRecordedLocation ||
        haversineDistance(
          lastRecordedLocation.latitude,
          lastRecordedLocation.longitude,
          latitude,
          longitude
        ) >= 0;

      if (!shouldUpdate) {
        console.log("Location change is less than 20 meters. No update sent.");
        return false;
      }

      try {
        await axios.post("http://localhost:5000/api/bus-locations/update", {
          bus_id: busId,
          latitude,
          longitude,
        });
        console.log("Location update sent to database");

        // Update the last recorded location
        lastRecordedLocation = { latitude, longitude };
        return true;
      } catch (error) {
        console.error("Error updating location in database:", error);
        return false;
      }
    };

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Fetch the most recent location when the function starts
    fetchLastLocation();

    navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(
          `Current Position: Latitude ${latitude}, Longitude ${longitude}, Accuracy: ${accuracy} meters`
        );

        // Check if the accuracy is acceptable (e.g., less than 50 meters)
        // if (accuracy < 5000000) {
        //   console.warn("Location accuracy is too low. Skipping update.");
        //   return;
        // }

        // Update only if the location has changed significantly (>= 20 meters)
        const locationUpdated = await updateLocation(latitude, longitude);

        if (locationUpdated && socket) {
          console.log("Sending location update via WebSocket...");
          socket.emit("location-update", {
            bus_id: busId,
            latitude,
            longitude,
            tripData,
          });
          console.log("Location update sent via WebSocket");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        // Optional: Handle specific geolocation errors
        setErrorCode(error.code);
        setShowPopup(true);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          default:
            console.error("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true, // Requests GPS-level accuracy
        maximumAge: 0, // Avoid using cached location data
        timeout: 10000, // Timeout after 10 seconds
      }
    );
  };

  const handleStartTrip = async () => {
    console.log("at start of start trip  the bus id is :", busId);
    if (route && passengerCount) {
      setTripData({
        bus_id: busNumber,
        driver_id: userState.work_id,
        username: userState.username,
        start_time: startTime,
        passenger_count: passengerCount,
        route,
        status: "ongoing",
      });

      try {
        const response = await axios.post(
          "http://localhost:5000/api/trips/trip",
          tripData
        );

        if (response.status === 201) {
          // Start sending location updates after trip is started
          startLocationUpdates();
        } else {
          alert("Error starting the trip. Please try again.");
        }
      } catch (error) {
        let errorMessage = "Network error. Please try again.";

        if (error.response) {
          // Errors from the server
          errorMessage += `\nStatus: ${error.response.status}\nMessage: ${
            error.response.data.message || error.response.statusText
          }`;
        } else if (error.request) {
          // No response was received
          errorMessage += "\nNo response received from the server.";
        } else {
          // Errors during request setup
          errorMessage += `\nError Message: ${error.message}`;
        }

        console.error("Error details:", error); // Log the full error object to the console
        alert(errorMessage);
      }

      setRoute("");
      setPassengerCount("");
    } else {
      alert("Please select a route and set the passenger number.");
    }
  };

  return (
    <div className="start-trip-card">
      <h3>Start Trip</h3>
      <form>
        <div className="form-group">
          <label htmlFor="route">Route</label>
          <input
            type="text"
            id="route"
            value={route}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search for a route"
          />
          {isFocused && filteredRoutes.length > 0 && (
            <ul className="route-dropdown">
              {filteredRoutes.map((r, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectRoute(r)}
                  className="route-item"
                >
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="busNumber">Bus Number</label>
          <input type="text" id="busNumber" value={busNumber} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="passengerCount">Passenger Number</label>
          <input
            type="number"
            id="passengerCount"
            value={passengerCount}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (value > 0 || e.target.value === "") {
                setPassengerCount(e.target.value);
              }
            }}
            placeholder="Enter passenger count"
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input type="text" id="startTime" value={startTime} disabled />
        </div>
        <button
          type="button"
          className="start-trip-button"
          onClick={handleStartTrip}
        >
          Start Trip
        </button>
      </form>
      <div>
        {showPopup && (
          <ShowErrorPopup
            errorCode={errorCode}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
    </div>
  );
};

StartTripCard.propTypes = {
  availableRoutes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onStartTrip: PropTypes.func.isRequired,
  userState: PropTypes.object.isRequired,
  start: PropTypes.bool.isRequired,
  setStart: PropTypes.func.isRequired,
};

export default StartTripCard;
