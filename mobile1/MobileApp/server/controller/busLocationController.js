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
export const getLastLocation = async (req, res) => {
  const { busId } = req.params;
  try {
    const result = await pool.query(
      `SELECT latitude, longitude
       FROM bus_locations
       WHERE bus_id = $1
       ORDER BY recorded_at DESC
       LIMIT 1`,
      [busId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No location found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching last location:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateLocation = async (req, res) => {
  const { bus_id, latitude, longitude } = req.body;
  try {
    await pool.query(
      `INSERT INTO bus_locations (bus_id, latitude, longitude)
       VALUES ($1, $2, $3)`,
      [bus_id, latitude, longitude]
    );
    res.status(201).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBusesLastLocation = async (req, res) => {
  try {
    // Query to get all recent bus locations, ordered by 'created_at'
    const result = await pool.query(`
      SELECT bus_id, latitude, longitude, recorded_at
      FROM bus_locations
      WHERE recorded_at >= NOW() - INTERVAL '15 minutes' -- Filter by recent entries
      ORDER BY recorded_at DESC
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No location found" });
    }
    res.status(200).json(result.rows); // Return the result as JSON
  } catch (error) {
    console.error("Error fetching recent bus locations:", error);
    res.status(500).json({ message: "Failed to fetch recent bus locations." });
  }
};

export default updateBusLocation;
