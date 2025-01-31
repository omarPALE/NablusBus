import pool from "../db.js";

export const getUsersAndRolesCount = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) OVER() AS total_users,
        role,
        COUNT(*) AS role_count
      FROM 
        users
      GROUP BY 
        role;
    `;

    const result = await pool.query(query);

    const response = {
      total_users: result.rows[0]?.total_users || 0,
      roles: result.rows.map((row) => ({
        role: row.role,
        count: row.role_count,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user and role counts:", error);
    res.status(500).json({ error: "Failed to fetch user and role counts" });
  }
};

// Get active tickets
export async function getActiveTickets(req, res) {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS active_tickets FROM tickets WHERE rides_left > 0"
    );
    const tickets = await pool.query(
      "SELECT model, COUNT(*) AS count FROM tickets GROUP BY model"
    );
    res.json({
      active_tickets: result.rows[0].active_tickets,
      tickets: tickets.rows, // Ensure this is part of the response
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
}

// Get buses on trip
export async function getBusesOnTrip(req, res) {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS buses_on_trip FROM buses WHERE status = 'on_trip'"
    );
    res.status(200).json({ buses_on_trip: result.rows[0].buses_on_trip });
  } catch (error) {
    res.status(500).json({ error: "Error fetching buses on trip" });
  }
}

// Get revenue for today
export async function getRevenueToday(req, res) {
  try {
    const result = await pool.query(
      "SELECT SUM(amount) AS revenue_today FROM transactions WHERE DATE(created_at) = CURRENT_DATE"
    );
    res.status(200).json({ revenue_today: result.rows[0].revenue_today || 0 });
  } catch (error) {
    res.status(500).json({ error: "Error fetching revenue for today" });
  }
}

// Get all trips
export async function getAllTrips(req, res) {
  try {
    const result = await pool.query("SELECT * FROM trips");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching trips" });
  }
}

// Add a new driver
export async function addDriver(req, res) {
  const { name, email, phone, license_number } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO drivers (name, email, phone, license_number) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, license_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error adding driver" });
  }
}

// Get driver by Work ID

export const checkDriverIdExists = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `SELECT EXISTS (SELECT 1 FROM users WHERE work_id = $1) AS exists`;
    const result = await pool.query(query, [id]);
    const exists = result.rows[0]?.exists || false;

    res.status(200).json({ exists });
  } catch (error) {
    console.error("Error checking driver ID existence:", error);
    res.status(500).json({ error: "Failed to check driver ID existence" });
  }
};

// Add a new Bus
export const addBus = async (req, res) => {
  const { bus_number, capacity, area, driver_work_id, status } = req.body;

  try {
    // Insert the bus into the database
    const result = await pool.query(
      "INSERT INTO buses (bus_number, capacity, area, driver_work_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [bus_number, capacity, area, driver_work_id, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding bus:", error); // Log the actual error
    res.status(500).json({ error: "Error adding Bus" });
  }
};

// Get total users
export async function getTotalUsers(req, res) {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );
    res.status(200).json({ total_users: result.rows[0].total_users });
  } catch (error) {
    res.status(500).json({ error: "Error fetching total users" });
  }
}

export const updateBus = async (req, res) => {
  const { bus_id, driver_work_id, status, area } = req.body;
  console.log("driver workid is: ", driver_work_id);
  if (!bus_id) {
    return res.status(400).json({ error: "Bus ID is required for updates." });
  }

  try {
    const fieldsToUpdate = [];
    const values = [];
    let paramIndex = 1; // Keeps track of the positional parameters for the query.

    // Validate and check if the driver exists if `driver_work_id` is provided.
    if (driver_work_id) {
      const driverCheckQuery = `
        SELECT COUNT(*) 
        FROM users 
        WHERE work_id = $1;
      `;
      const driverCheckResult = await pool.query(driverCheckQuery, [
        driver_work_id,
      ]);

      if (parseInt(driverCheckResult.rows[0].count, 10) === 0) {
        return res
          .status(400)
          .json({ error: "Driver Work ID does not exist in the database." });
      }

      fieldsToUpdate.push(`driver_work_id = $${paramIndex++}`);
      values.push(driver_work_id);
    }

    // Add optional fields to update if provided.
    if (status) {
      fieldsToUpdate.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (area) {
      fieldsToUpdate.push(`area = $${paramIndex++}`);
      values.push(area);
    }

    // If no fields provided for update, return an error.
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No fields provided to update." });
    }

    // Add bus_id as the last parameter.
    values.push(bus_id);

    const query = `
      UPDATE buses
      SET ${fieldsToUpdate.join(", ")}
      WHERE bus_number = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res
        .status(200)
        .json({ message: "Bus updated successfully!", bus: result.rows[0] });
    } else {
      res.status(404).json({ error: "Bus not found." });
    }
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ error: "Error updating bus." });
  }
};

// Get all buses
export const getAllBuses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM buses");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: "Failed to fetch buses" });
  }
};

// Controller function to get users by role
export const getUsersByRole = async (req, res) => {
  const { role } = req.params; // Get the role from the URL parameter

  try {
    // Query to get users based on their role
    const result = await pool.query("SELECT * FROM users WHERE role = $1", [
      role,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `No users found for the role: ${role}` });
    }

    // Respond with the list of users
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch users. Please try again later." });
  }
};
