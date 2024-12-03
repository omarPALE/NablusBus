import { useState } from "react";
import "./trackingDrobdown.css";
export default function TrackingDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <li className="nav-item custom-dropdown" onMouseLeave={closeDropdown}>
      {/* Dropdown Trigger */}
      <button
        className="btn btn-secondary dropdown-toggle"
        onClick={toggleDropdown}
      >
        Tracking
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="custom-dropdown-menu">
          <li>
            <a className="dropdown-item" href="#">
              South Line
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              North Line
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              East Line
            </a>
          </li>
        </ul>
      )}
    </li>
  );
}
