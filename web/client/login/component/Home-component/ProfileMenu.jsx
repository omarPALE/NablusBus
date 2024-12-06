import { useState } from "react";
import "./profileMenu.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  const logOut = () => {
    props.setUserState((prevState) => ({
      ...prevState,
      loggedIn: false,
      email: "",
      username: "",
    }));
    localStorage.removeItem("user");
    sessionStorage.removeItem("user"); // or any other storage you use

    navigate("/login");
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
          <button className="profile-dropdown-item" onClick={logOut}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

ProfileMenu.propTypes = {
  avatar: PropTypes.string, // Optional string
  name: PropTypes.string.isRequired, // Required string
  email: PropTypes.string.isRequired, // Required string
  setUserState: PropTypes.func.isRequired, // Function
};
