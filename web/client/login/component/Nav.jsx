// Import PropTypes and Dropdown from 'react-bootstrap'
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Nav(props) {
  const navigate = useNavigate();

  const homeNav = () => {
    navigate("/home");
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
        <a className="navbar-brand" onClick={homeNav} cursor="pointer">
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

            <li className="nav-item dropdown">
              <div className="dropdown">
                <a
                  className="btn btn-secondary dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Tracking
                </a>
                <ul className="dropdown-menu">
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
              </div>
            </li>
          </ul>
          <button
            className="btn btn-outline-success"
            onClick={props.handleSignIn}
          >
            Sign In
          </button>
          <button
            className="btn btn-outline-success"
            onClick={props.handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}

Nav.propTypes = {
  handleSignIn: PropTypes.func.isRequired,
  handleHome: PropTypes.func.isRequired,
  handleSignUp: PropTypes.func.isRequired,
};
