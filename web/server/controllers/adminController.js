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
