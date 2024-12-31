import pool from "../db.js"; // Assuming you're using a PostgreSQL connection pool

/**
 * Controller to update the location of a bus
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */

export const updateBusLocation = async (req) => {
  const { bus_id, latitude, longitude } = req.body;

  if (!bus_id || !latitude || !longitude) {
    throw new Error("Missing required fields");
  }

  try {
    await pool.query(
      `INSERT INTO bus_locations (bus_id, latitude, longitude)
       VALUES ($1, $2, $3)`,
      [bus_id, latitude, longitude]
    );
    console.log("Location saved to database");
  } catch (error) {
    console.error("Error saving location to database:", error.message);
    throw error;
  }
};

export default updateBusLocation;
