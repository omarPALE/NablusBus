import {
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  FileOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Layout, Menu, message } from "antd";
import PropTypes from "prop-types";
import OverviewMetrics from "./OverviewMetrics";
import Trips from "./sideBarItem/Trips";
import Users from "./sideBarItem/Users";
import Buses from "./sideBarItem/Buses";
import Reports from "./sideBarItem/Reports";
import axios from "axios";
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = ({ setLinks }) => {
  const [selectedView, setSelectedView] = useState("overview");
  // const [show, setShow] = useState(false);
  // const [hide, setHide] = useState(true);
  const [showlink1, setShowlink1] = useState("false");
  const [showlink2, setShowlink2] = useState("false");
  const [showlink3, setShowlink3] = useState("false");
  const [showlink4, setShowlink4] = useState("false");

  const [busData, setBusData] = useState([]); // State to store bus data
  // const [UserData, setUserData] = useState([]); // State to store bus data

  const handleMenuClick = (view) => {
    setSelectedView(view);

    // Dynamically set Navbar links with onClick handlers based on selected view
    switch (view) {
      case "overview":
        setLinks([]);
        break;
      case "trips":
        setLinks([
          {
            label: "Show All Trips",
            onClick: () => console.log("Navigating to Show All Trips"),
          },
          {
            label: "Weekly Trips",
            onClick: () => console.log("Navigating to Weekly Trips"),
          },
        ]);
        break;
      case "users":
        setLinks([
          {
            label: "Show All Users",
            onClick: () => {
              setShowlink1(true);
              setShowlink2(false);
              setShowlink3(false);
              setShowlink4(false);
            },
          },
          {
            label: "Users",
            onClick: () => {
              setShowlink1(false);
              setShowlink2(true);
              setShowlink3(false);
              setShowlink4(false);
            },
          },
          {
            label: "Drivers",
            onClick: () => {
              setShowlink1(false);
              setShowlink2(false);
              setShowlink3(true);
              setShowlink4(false);
            },
          },
          {
            label: "Admins",
            onClick: () => {
              setShowlink1(false);
              setShowlink2(false);
              setShowlink3(false);
              setShowlink4(true);
            },
          },
        ]);
        break;
      case "buses":
        setLinks([
          {
            label: "Add Bus",
            onClick: () => {
              setShowlink1(true);
              setShowlink2(false);
              setShowlink3(false);
            },
          },
          {
            label: "Update Bus",
            onClick: () => {
              setShowlink1(false);
              setShowlink2(true);
              setShowlink3(false);
            },
          },
          {
            label: "Show All Buses",
            onClick: () => {
              setShowlink1(false);
              setShowlink2(false);
              setShowlink3(true);
              fetchBuses();
            },
          },
        ]);
        break;
      case "reports":
        setLinks([
          {
            label: "Daily Reports",
            onClick: () => console.log("Navigating to Daily Reports"),
          },
          {
            label: "Monthly Reports",
            onClick: () => console.log("Navigating to Monthly Reports"),
          },
        ]);
        break;
      default:
        setLinks([]);
        break;
    }
  };
  const fetchBuses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/getBuses"
      );
      if (response.status === 200) {
        setBusData(response.data); // Store the bus data in state
      } else {
        message.error("Failed to fetch buses.");
      }
    } catch (error) {
      console.error("Error fetching bus data:", error);
      message.error("An error occurred while fetching bus data.");
    }
  };

  const renderContent = () => {
    switch (selectedView) {
      case "overview":
        return <OverviewMetrics />;
      case "trips":
        return <Trips />;
      case "users":
        return (
          <Users
            showlink2={showlink2}
            showlink1={showlink1}
            showlink3={showlink3}
            showlink4={showlink4}
          />
        );
      case "buses":
        return (
          <Buses
            showlink2={showlink2}
            showlink3={showlink3}
            showlink1={showlink1}
            busData={busData}
          />
        );
      case "reports":
        return <Reports />;
      default:
        return <OverviewMetrics />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" collapsible>
        <Menu
          theme="dark"
          mode="inline"
          className="sidebar-menu"
          style={{ backgroundColor: "#ff6000" }}
          selectedKeys={[selectedView]}
        >
          <Menu.Item
            key="overview"
            icon={<DashboardOutlined />}
            onClick={() => handleMenuClick("overview")}
            style={{ color: "black" }}
          >
            Dashboard Overview
          </Menu.Item>
          <Menu.Item
            key="trips"
            icon={<CarOutlined />}
            onClick={() => handleMenuClick("trips")}
            style={{ color: "black" }}
          >
            Manage Trips
          </Menu.Item>
          <Menu.Item
            key="users"
            icon={<UserOutlined />}
            onClick={() => handleMenuClick("users")}
            style={{ color: "black" }}
          >
            Manage Users
          </Menu.Item>
          <Menu.Item
            key="buses"
            icon={<TruckOutlined />}
            onClick={() => handleMenuClick("buses")}
            style={{ color: "black" }}
          >
            Manage Buses
          </Menu.Item>
          <Menu.Item
            key="reports"
            icon={<FileOutlined />}
            onClick={() => handleMenuClick("reports")}
            style={{ color: "black" }}
          >
            Reports
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <div style={{ padding: "20px" }}>
          <h2>Dashboard Overview</h2>
          {renderContent()}
        </div>
      </Layout>
    </Layout>
  );
};

Sidebar.propTypes = {
  setLinks: PropTypes.func.isRequired,
};

export default Sidebar;
