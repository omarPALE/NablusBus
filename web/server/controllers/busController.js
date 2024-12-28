import pool from "../db.js";

// Function to get the bus number by driver_work_id
export const getBusNumberByDriverId = async (req, res) => {
  const { driver_work_id } = req.params;

  try {
    // Query the database using the pool
    const result = await pool.query(
      `SELECT bus_number 
       FROM buses 
       WHERE driver_work_id = $1`,
      [driver_work_id]
    );

    // If no result, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Bus not found for the given driver_work_id",
      });
    }

    // Send the bus_number as a response
    res.status(200).json({
      busNumber: result.rows[0].bus_number,
    });
  } catch (error) {
    console.error("Error fetching bus number:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
