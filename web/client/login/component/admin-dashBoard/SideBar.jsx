import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  FileOutlined,
  NotificationOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import OverviewMetrics from "./OverviewMetrics";
import Trips from "./sideBarItem/Trips";
import Users from "./sideBarItem/Users";
import Notifications from "./sideBarItem/Notifications";
import Reports from "./sideBarItem/Reports";
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = () => {
  const [selectedView, setSelectedView] = useState("overview");

  const handleMenuClick = (view) => {
    setSelectedView(view);
  };

  const renderContent = () => {
    switch (selectedView) {
      case "overview":
        return <OverviewMetrics />;
      case "trips":
        return <Trips />;
      case "users":
        return <Users />;
      case "notifications":
        return <Notifications />;
      case "reports":
        return <Reports />;
      default:
        return <OverviewMetrics />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#60ff00" }}>
      <Sider theme="dark" collapsible>
        <Menu
          theme="dark"
          mode="inline"
          className="sidebar-menu"
          style={{ backgroundColor: "#ff6000" }}
        >
          <Menu.Item
            key="1"
            icon={<DashboardOutlined />}
            onClick={() => handleMenuClick("overview")}
          >
            Dashboard Overview
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<CarOutlined />}
            onClick={() => handleMenuClick("trips")}
          >
            Manage Trips
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<UserOutlined />}
            onClick={() => handleMenuClick("users")}
          >
            Manage Buses
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<TruckOutlined />}
            onClick={() => handleMenuClick("users")}
          >
            Manage Users
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<NotificationOutlined />}
            onClick={() => handleMenuClick("notifications")}
          >
            Notifications
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<FileOutlined />}
            onClick={() => handleMenuClick("reports")}
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

export default Sidebar;
