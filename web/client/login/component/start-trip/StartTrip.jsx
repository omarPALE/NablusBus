import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./start-trip.css"; // Import the CSS file

const StartTripCard = ({
  busNumber,
  availableRoutes,
  driverId,
  onStartTrip,
}) => {
  const [route, setRoute] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(availableRoutes);
  const [passengerCount, setPassengerCount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isFocused, setIsFocused] = useState(false); // To handle dropdown visibility

  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toLocaleString(); // e.g., "12/12/2024, 10:00:00 AM"
    setStartTime(formattedTime);
  }, []);

  const handleSearch = (searchText) => {
    const filtered = availableRoutes.filter((route) =>
      route.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredRoutes(filtered);
    setRoute(searchText); // Keep the input value updated
  };

  const handleSelectRoute = (selectedRoute) => {
    setRoute(selectedRoute);
    setFilteredRoutes(availableRoutes); // Reset to show all routes again
    setIsFocused(false); // Hide dropdown after selection
  };

  const handleStartTrip = async () => {
    if (route && passengerCount) {
      // Prepare data for API request
      const tripData = {
        bus_id: busNumber,
        driver_id: driverId,
        start_time: startTime,
        passenger_count: passengerCount,
        route,
        status: "ongoing",
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/trips/trip",
          { ...tripData }
        );

        if (response.status === 200) {
          // Handle successful response
          console.log("Trip started successfully:", response.data);
          onStartTrip(tripData); // Optional: Call the parent callback if necessary
        } else {
          // Handle failure (e.g., server error)
          console.error("Error starting trip:", response.data);
          alert("Error starting the trip. Please try again.");
        }
      } catch (error) {
        console.error("Error during the request:", error);
        alert("Network error. Please try again.");
      }

      // Reset form fields
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
            onFocus={() => setIsFocused(true)} // Show dropdown on focus
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Hide dropdown on blur after a slight delay
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

// PropTypes for type checking
StartTripCard.propTypes = {
  busNumber: PropTypes.string.isRequired, // Bus number should be a string
  availableRoutes: PropTypes.arrayOf(PropTypes.string).isRequired, // Routes should be an array of strings
  driverId: PropTypes.string.isRequired, // Driver ID should be a string
  onStartTrip: PropTypes.func.isRequired, // Function to handle trip start
};

export default StartTripCard;
