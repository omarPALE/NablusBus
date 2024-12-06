// components/Sidebar.js
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  FileOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider theme="dark" collapsible>
      <Menu theme="dark" mode="inline">
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<CarOutlined />}>
          <Link to="/trips">Trips</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          <Link to="/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<NotificationOutlined />}>
          <Link to="/notifications">Notifications</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<FileOutlined />}>
          <Link to="/reports">Reports</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
