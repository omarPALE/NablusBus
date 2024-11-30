// Import PropTypes and Dropdown from 'react-bootstrap'
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./Home-component/ProfileMenu";
import TrackingDropdown from "./TrackingDropDown/TrackingDropDown";
export default function Nav(props) {
  const navigate = useNavigate();
  console.log(props.userState);
  const user = {
    name: "Omar",
    email: "omar@example.com",
    avatar: "https://via.placeholder.com/150", // Optional profile picture URL
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <img
          alt=""
          src="./img/logo.jpg"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        <a
          className="navbar-brand"
          onClick={() => navigate("/home")}
          cursor="pointer"
        >
          Nablus Bus
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li>
              <a
                className="btn btn-outline-success"
                onClick={() => navigate("subscription")}
              >
                Subscription
              </a>
            </li>
            <li>
              <a
                className="btn btn-outline-success"
                onClick={() => navigate("ticket")}
              >
                Ticket
              </a>
            </li>
            <li>
              <TrackingDropdown />
            </li>
          </ul>
          {!props.userState?.loggedIn && (
            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          )}
          {!props.userState?.loggedIn && (
            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          )}
          {props.userState?.loggedIn && <ProfileMenu user={user} />}
        </div>
      </div>
    </nav>
  );
}

Nav.propTypes = {
  userState: PropTypes.func.isRequired,
};
