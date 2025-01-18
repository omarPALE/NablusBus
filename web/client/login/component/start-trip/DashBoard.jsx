import { useState, useEffect } from "react";
import "./dashboard.css";
import axios from "axios";
import PropTypes from "prop-types";
import TripCard from "./TripCard";
import StartTripCard from "./StartTrip";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Modal, Row, Col, Input, Spin, Button } from "antd";
import { useSpring, animated } from "@react-spring/web";
import { SearchOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const Dashboard = (props) => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [showTrips, setShowTrips] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state to store search query

  const handleStartTrip = () => {
    setIsModalVisible(true);
  };

  const handleGetTrips = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/trips/worker/${props.userState.work_id}`
      );
      setTrips(response.data);
      // Reapply filtering based on current search query
      const filtered = response.data.filter((trip) =>
        trip.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTrips(filtered);
      setShowTrips(true);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishTrip = async (tripId) => {
    const endTime = new Date().toISOString();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/trips/updateEndTime/${tripId}`,
        { end_time: endTime }
      );
      if (response.status === 200) {
        alert(`Trip ${tripId} finished at ${endTime}`);
        handleGetTrips();
      } else {
        alert("Failed to finish trip. Please try again.");
      }
    } catch (error) {
      console.error("Error finishing trip:", error);
      alert("Error finishing trip. Please try again.");
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (value) => {
    setSearchQuery(value); // Update search query
    const filtered = trips.filter((trip) =>
      trip.status.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTrips(filtered);
  };

  useEffect(() => {
    handleGetTrips();
    const interval = setInterval(() => {
      handleGetTrips();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fadeIn = useSpring({
    opacity: showTrips ? 1 : 0,
    transform: showTrips ? "translateY(0)" : "translateY(20px)",
    config: { tension: 200, friction: 25 },
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={200}
        className="site-layout-background"
        style={{ backgroundColor: "#ff6000", padding: "20px" }}
      >
        <div className="logo" />
        <div className="user-info">
          <UserOutlined className="user-icon" />
          <div className="user-details">
            <h3>{props.userState.username}</h3>
            <p>Status: {props.userState.loggedIn ? "Active" : ""}</p>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ backgroundColor: "#ff6000" }}
        >
          <Menu.Item key="1" onClick={handleStartTrip}>
            Start Trip
          </Menu.Item>
          <Menu.Item key="2" onClick={handleGetTrips}>
            Get All Trips
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "0 0px 24px" }}>
        <Header
          className="dashboard-header"
          style={{
            backgroundColor: "#ff6000",
            color: "white",
            fontSize: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="header-title">Driver Dashboard</div>
          <Input
            placeholder="Search by status"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={
              <Button
                icon={<SearchOutlined />}
                style={{
                  backgroundColor: "#ff6000",
                  color: "white",
                  border: "none",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  marginTop: "0px",
                  marginRight: "-12px",
                }}
                onClick={() => handleSearch(searchQuery)}
              />
            }
            style={{
              width: 300,
              height: 40,
              paddingRight: "10px",
            }}
          />
        </Header>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          {loading && trips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {showTrips &&
                filteredTrips.map((trip) => (
                  <Col span={8} key={trip.tripId}>
                    <animated.div style={fadeIn}>
                      <div className="trip-card-container">
                        <TripCard
                          trip={trip}
                          {...(trip.status !== "Completed"
                            ? { onFinishTrip: handleFinishTrip }
                            : {})}
                        />
                      </div>
                    </animated.div>
                  </Col>
                ))}
            </Row>
          )}
        </Content>
      </Layout>

      <Modal
        title="Start Trip"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        width={600}
      >
        <StartTripCard
          onClose={handleCancelModal}
          setUserState={props.setUserState}
          userState={props.userState}
          availableRoutes={["Route A", "Route B", "Route C"]}
          start={props.start}
          setStart={props.setStart}
        />
      </Modal>
    </Layout>
  );
};

Dashboard.propTypes = {
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.object.isRequired,
  start: PropTypes.bool.isRequired,
  setStart: PropTypes.func.isRequired,
};

export default Dashboard;
