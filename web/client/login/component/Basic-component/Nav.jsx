// Import PropTypes and Dropdown from 'react-bootstrap'
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../Home-component/ProfileMenu";
import TrackingDropdown from "../TrackingDropDown/TrackingDropDown";
export default function Nav(props) {
  const navigate = useNavigate();
  const user = {
    name: props.userState.username,
    email: props.userState.email,
    loggedIn: true,
    user_id: props.userState.id,
    role: props.userState.role,
    work_id: props.userState.work_id,
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
          cursor="pointer"
          onClick={() => navigate("/home")}
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
            {props.userState.loggedIn &&
              (props.userState.role === "passenger" ||
                props.userState.role === "adminstrater") && (
                <li>
                  <a
                    className="btn btn-outline-success"
                    onClick={() => navigate("tracking")}
                  >
                    Tracking
                  </a>
                </li>
              )}
            {props.userState.loggedIn &&
              props.userState.role === "passenger" && (
                <li>
                  <a
                    className="btn btn-outline-success"
                    onClick={() => navigate("ticket")}
                  >
                    My Ticket
                  </a>
                </li>
              )}
            {props.userState.loggedIn && props.userState.role === "driver" && (
              <li>
                <a
                  className="btn btn-outline-success"
                  onClick={() => navigate("scan")}
                >
                  Scanner
                </a>
              </li>
            )}
            {props.userState.loggedIn && props.userState.role === "driver" && (
              <li>
                <a
                  className="btn btn-outline-success"
                  onClick={() => {
                    navigate("/trip");
                    props.setStart(true);
                  }}
                >
                  Start Trip
                </a>
              </li>
            )}
            {props.userState.loggedIn &&
              props.userState.role === "administrator" && (
                <li>
                  <a
                    className="btn btn-outline-success"
                    onClick={() => navigate("admin/dashboard")}
                  >
                    Dash board
                  </a>
                </li>
              )}
            <li>
              <TrackingDropdown onClick={() => navigate("tracking")} />
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
          {props.userState?.loggedIn && (
            <ProfileMenu
              name={user.name}
              email={user.email}
              setUserState={props.setUserState}
            />
          )}
        </div>
      </div>
    </nav>
  );
}

Nav.propTypes = {
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.func.isRequired,
  setStart: PropTypes.func.isRequired,
};
