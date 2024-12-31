import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./start-trip.css";
import { SocketContext } from "../../src/App"; // Import the SocketContext from App

const StartTripCard = ({ availableRoutes, onStartTrip, userState }) => {
  const [busNumber, setBusNumber] = useState("");
  const [route, setRoute] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(availableRoutes);
  const [passengerCount, setPassengerCount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [busId, setBusId] = useState(0);
  const socket = useContext(SocketContext); // Access the shared WebSocket instance

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

  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    setStartTime(formattedTime);
  }, []);

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
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Send location to the backend via WebSocket
        if (socket) {
          socket.emit("location-update", {
            bus_id: busId,
            latitude,
            longitude,
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleStartTrip = async () => {
    console.log("at start of start trip  the bus id is :", busId);
    if (route && passengerCount) {
      const tripData = {
        bus_id: busNumber,
        driver_id: userState.work_id,
        start_time: startTime,
        passenger_count: passengerCount,
        route,
        status: "ongoing",
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/trips/trip",
          tripData
        );

        if (response.status === 201) {
          alert("Trip started successfully");
          // onStartTrip(tripData);

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
            onChange={(e) => setPassengerCount(e.target.value)}
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
    </div>
  );
};

StartTripCard.propTypes = {
  availableRoutes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onStartTrip: PropTypes.func.isRequired,
  userState: PropTypes.object.isRequired,
};

export default StartTripCard;
