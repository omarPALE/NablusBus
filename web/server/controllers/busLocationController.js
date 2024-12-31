import pool from "../db.js"; // Assuming you're using a PostgreSQL connection pool

/**
 * Controller to update the location of a bus
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const updateBusLocation = async (req, res) => {
  const { bus_id, latitude, longitude } = req.body;

  // Validate input
  if (!bus_id || !latitude || !longitude) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Insert the new location into the bus_locations table
    await pool.query(
      `INSERT INTO bus_locations (bus_id, latitude, longitude)
       VALUES ($1, $2, $3)`,
      [bus_id, latitude, longitude]
    );

    // Respond with a success message
    res.status(201).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error updating bus location:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
