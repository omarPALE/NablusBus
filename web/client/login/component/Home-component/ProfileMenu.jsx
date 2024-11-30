import { useState } from "react";
import "./profileMenu.css";
import PropTypes from "prop-types";

export default function ProfileMenu(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div
      className="profile-menu-container"
      onClick={(e) => {
        e.stopPropagation(); // Prevent interference from parent elements
        toggleDropdown();
      }}
    >
      {/* Profile Icon */}
      <div className="profile-icon">
        {props?.avatar ? (
          <img src={props.avatar} alt="Profile" className="profile-image" />
        ) : (
          <div className="profile-placeholder">
            {props?.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="profile-dropdown-menu">
          <div className="user-info">
            <p>{props?.name || "Guest"}</p>
            <p>{props?.email || "guest@example.com"}</p>
          </div>
          <hr />
          <button className="profile-dropdown-item">Settings</button>
          <button className="profile-dropdown-item">Log out</button>
        </div>
      )}
    </div>
  );
}

ProfileMenu.propTypes = {
  avatar: PropTypes.string, // Should be a string
  name: PropTypes.string, // Should be a string
  email: PropTypes.string, // Should be a string
};
