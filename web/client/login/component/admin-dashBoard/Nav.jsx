// components/Navbar.js
import { Layout } from "antd";
import "./Navbar.css";
const { Header } = Layout;

const Navbar = () => {
  return (
    <Header style={{ background: "#001529", color: "#fff", padding: "0 20px" }}>
      <h1 style={{ color: "#fff", fontSize: "24px" }}>
        NablusBus Admin Dashboard
      </h1>
    </Header>
  );
};

export default Navbar;
