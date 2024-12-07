// components/Navbar.js
import { Layout } from "antd";
import "./Navbar.css";
const { Header } = Layout;

const Navbar = () => {
  return (
    <Header
      style={{ background: "#ff6000", color: "#0000", padding: "0 20px" }}
    >
      <h1 style={{ color: "#000", fontSize: "24px" }}>
        NablusBus Admin Dashboard
      </h1>
    </Header>
  );
};

export default Navbar;
