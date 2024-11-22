import logo from "../../img/logo.jpg";
import PropTypes from "prop-types";

export default function Header(props) {
  // Add props validation

  return (
    <header className="header">
      <img className="sign-in-logo" src={logo} alt="Logo" width="100px" />
      <h3>{props.title}</h3>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};
