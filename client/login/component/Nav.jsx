// Import PropTypes and Dropdown from 'react-bootstrap'
import PropTypes from "prop-types";

export default function Nav(props) {
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
        <a className="navbar-brand" href="#">
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
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="/home"
                onClick={props.handleHome}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
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
                  Dropdown link
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a className="nav-link" href="#">
                Subscribtion
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
                Ticket
              </a>
            </li>
          </ul>

          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
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
