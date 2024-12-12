// components/Sidebar.js
import { Layout, Menu } from "antd";
import "./Sidebar.css";
import {
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  FileOutlined,
  NotificationOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider theme="dark" collapsible>
      <Menu className="Menu" theme="dark" mode="inline">
        <Menu.Item key="1" className="MenuItem" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" className="MenuItem" icon={<CarOutlined />}>
          <Link className="MenuItem" to="/trips">
            Trips
          </Link>
        </Menu.Item>
        <Menu.Item key="3" className="MenuItem" icon={<UserOutlined />}>
          <Link to="/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="4" className="MenuItem" icon={<TruckOutlined />}>
          <Link to="/buses">Buses</Link>
        </Menu.Item>
        <Menu.Item key="5" className="MenuItem" icon={<NotificationOutlined />}>
          <Link to="/notifications">Notifications</Link>
        </Menu.Item>
        <Menu.Item key="6" className="MenuItem" icon={<FileOutlined />}>
          <Link className="MenuItem" to="/reports">
            Reports
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
