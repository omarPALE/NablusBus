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

export const getTripByDriverId = async (req,res) =>{
  const { driver_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT bus_number FROM bus WHERE driver_worker_id = $1`,
      [driver_id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ message: "No bus found for this driver" });
    }
    


}