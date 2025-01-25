import { Card, message } from "antd";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useSprings, animated, config } from "@react-spring/web";
import "./styles/User.css";

const Users = ({ showlink1, showlink2, showlink3, showlink4 }) => {
  const [users, setUsers] = useState([]);
  const [selectedRoleDetails, setSelectedRoleDetails] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [activeRole, setActiveRole] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/users"
        );
        if (response.status === 200) {
          const userArray = Object.entries(response.data).flatMap(
            ([key, value]) =>
              key === "roles" && Array.isArray(value)
                ? value.map(({ role, count }) => ({
                    role,
                    count: Number(count),
                  }))
                : []
          );
          setUsers(userArray);
        } else {
          console.error("Unexpected response code:", response.status);
          message.error(
            "Failed to fetch users. Unexpected response from the server."
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, []);

  const fetchRoleDetails = async (role) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/users/${role}`
      );
      if (response.status === 200) {
        setSelectedRoleDetails(response.data);
        setSelectedRole(role);
        setActiveRole(role);
      } else {
        message.error("Failed to fetch role details.");
      }
    } catch (error) {
      console.error(`Error fetching details for role: ${role}`, error);
      message.error("Failed to fetch role details. Please try again later.");
    }
  };

  // Precompute animations for all cards
  const springs = useSprings(
    users.length,
    users.map((user) => ({
      transform: activeRole === user.role ? "scale(1.05)" : "scale(1)",
      boxShadow:
        activeRole === user.role
          ? "0px 10px 30px rgba(0, 0, 0, 0.3)"
          : "0px 4px 15px rgba(0, 0, 0, 0.1)",
      config: config.wobbly,
    }))
  );

  const renderUsersList = (userList) => {
    if (!Array.isArray(userList)) {
      console.error("userList is not an array:", userList);
      return <p>Invalid data format.</p>;
    }

    return userList.length === 0 ? (
      <p>No users available.</p>
    ) : (
      userList.map((user, index) => (
        <animated.div style={springs[index]} key={index}>
          <Card
            className={`user-item ${activeRole === user.role ? "active" : ""}`}
            bordered
            onClick={() =>
              user.role === "administrator" || user.role === "driver"
                ? fetchRoleDetails(user.role)
                : null
            }
          >
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Count:</strong> {user.count}
            </p>
          </Card>
        </animated.div>
      ))
    );
  };

  const renderRoleDetails = () => {
    if (selectedRoleDetails.length === 0) {
      return <p>No details available for the selected role.</p>;
    }

    return (
      <div className="role-details">
        <h3>{`Details for ${
          selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
        }s`}</h3>
        {selectedRoleDetails.map((detail, index) => (
          <Card
            key={index}
            className={`role-item ${
              activeRole === selectedRole ? "visible" : ""
            }`}
            bordered
          >
            <p>
              <strong>ID:</strong> {detail.work_id || detail.id}
            </p>
            <p>
              <strong>Name:</strong> {detail.username}
            </p>
            <p>
              <strong>Email:</strong> {detail.email}
            </p>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="users-container">
      <h2 className="users-header">Manage Users</h2>
      <p className="users-description">
        View and manage users based on their roles.
      </p>
      <div className="users-cards">
        {showlink1 && !showlink2 && !showlink3 && !showlink4 && (
          <Card className="users-card" title="All Users" bordered>
            {renderUsersList(users)}
          </Card>
        )}

        {!showlink1 && showlink2 && !showlink3 && !showlink4 && (
          <Card className="users-card" title="Passengers" bordered>
            {renderUsersList(users.filter((user) => user.role === "passenger"))}
          </Card>
        )}

        {!showlink1 && !showlink2 && showlink3 && !showlink4 && (
          <Card className="users-card" title="Drivers" bordered>
            {renderUsersList(users.filter((user) => user.role === "driver"))}
          </Card>
        )}

        {!showlink1 && !showlink2 && !showlink3 && showlink4 && (
          <Card className="users-card" title="Admins" bordered>
            {renderUsersList(
              users.filter((user) => user.role === "administrator")
            )}
          </Card>
        )}
      </div>

      {selectedRole && (
        <div className="role-details-section">{renderRoleDetails()}</div>
      )}
    </div>
  );
};

Users.propTypes = {
  showlink1: PropTypes.bool,
  showlink2: PropTypes.bool,
  showlink3: PropTypes.bool,
  showlink4: PropTypes.bool,
};

export default Users;
