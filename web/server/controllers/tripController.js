// controllers/tripController.js
import pool from "../db.js";

// Controller function to add a new trip
export const addNewTrip = async (req, res) => {
  const {
    bus_id,
    driver_id,
    start_time,
    passenger_count,
    route,
    status = "ongoing",
  } = req.body;

  // Validate required fields
  if (!bus_id || !driver_id || !start_time || !passenger_count || !route) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Insert the trip data into the database using pool.query
    const query = `
      INSERT INTO trips (bus_id, driver_id, start_time, passengers_count, route, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      bus_id,
      driver_id,
      start_time,
      passenger_count,
      route,
      status,
    ];

    // Using the pool to execute the query
    const result = await pool.query(query, values);

    // Respond with the newly created trip data
    res.status(201).json({
      message: "Trip started successfully",
      trip: result.rows[0], // Return the new trip record
    });
  } catch (error) {
    console.error("Error adding trip:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllTrips = async (req, res) => {
  try {
    // Query to fetch all trips from the "trips" table
    const result = await pool.query("SELECT * FROM trips ORDER BY id ASC");

    // Send the retrieved trips as a JSON response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching trips:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch trips", error: error.message });
  }
};

export const updateEndTime = async (req, res) => {
  const { tripId } = req.params;
  const { end_time } = req.body;

  // Ensure end_time is provided
  if (!end_time) {
    return res.status(400).json({ message: "End time is required" });
  }

  try {
    // Update the end_time in the database
    const result = await pool.query(
      "UPDATE trips SET end_time = $1, status = 'completed' WHERE id = $2 RETURNING *",
      [end_time, tripId]
    );

    // Check if the trip exists
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Send success response with the updated trip
    res
      .status(200)
      .json({ message: "Trip finished successfully", trip: result.rows[0] });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
