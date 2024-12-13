import { Layout, Menu } from "antd";
import PropTypes from "prop-types";
import "./Navbar.css";

const { Header } = Layout;

const Navbar = ({ links }) => {
  return (
    <Header
      style={{
        background: "#ff6000",
        color: "#000",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#000",
          fontSize: "24px",
          margin: 0,
        }}
      >
        NablusBus Admin Dashboard
      </h1>
      <Menu
        mode="horizontal"
        style={{
          background: "transparent",
          border: "none",
          overflow: "visible", // Ensure the links don't collapse
          flex: 1, // Allow Menu to take up remaining space
          justifyContent: "flex-start", // Align links to the right
          display: "flex", // Ensure links are displayed inline
          fontWeight: "bold",
        }}
      >
        {links.map((link, index) => (
          <Menu.Item
            key={index}
            onClick={link.onClick}
            ononMouseLeave={() => link.onClick(false)}
          >
            {link.label}
          </Menu.Item>
        ))}
      </Menu>
    </Header>
  );
};

// PropTypes for validation
Navbar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired, // Validate the onClick handler
    })
  ).isRequired,
};

export default Navbar;
