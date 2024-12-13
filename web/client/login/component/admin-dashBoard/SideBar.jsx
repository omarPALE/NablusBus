import {
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  FileOutlined,
  NotificationOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import PropTypes from "prop-types";
import OverviewMetrics from "./OverviewMetrics";
import Trips from "./sideBarItem/Trips";
import Users from "./sideBarItem/Users";
import Buses from "./sideBarItem/Buses";
import Notifications from "./sideBarItem/Notifications";
import Reports from "./sideBarItem/Reports";
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = ({ setLinks }) => {
  const [selectedView, setSelectedView] = useState("overview");
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(true);
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
            label: "Something One",
            onClick: () => console.log("Navigating to Something One"),
          },
          {
            label: "Something Two",
            onClick: () => console.log("Navigating to Something Two"),
          },
        ]);
        break;
      case "buses":
        setLinks([
          {
            label: "Add Bus",
            onClick: () => {
              setShow(true);
              setHide(false);
            },
          },
          {
            label: "Update Bus",
            onClick: () => {
              setHide(true);
              setShow(false);
            },
          },
        ]);
        break;
      case "notifications":
        setLinks([
          {
            label: "View All Notifications",
            onClick: () => console.log("Navigating to Notifications"),
          },
          {
            label: "Notification Settings",
            onClick: () => console.log("Navigating to Notification Settings"),
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
  useEffect(() => {
    setShow(false);
  }, [selectedView]);
  const renderContent = () => {
    switch (selectedView) {
      case "overview":
        return <OverviewMetrics />;
      case "trips":
        return <Trips />;
      case "users":
        return <Users />;
      case "buses":
        return <Buses show={show} hide={hide} />;
      case "notifications":
        return <Notifications />;
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
            key="notifications"
            icon={<NotificationOutlined />}
            onClick={() => handleMenuClick("notifications")}
            style={{ color: "black" }}
          >
            Notifications
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
