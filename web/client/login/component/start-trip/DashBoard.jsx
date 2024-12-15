import { useState, useEffect } from "react";
import { Layout, Menu, Row, Col, Modal } from "antd";
import axios from "axios";
import TripCard from "./TripCard.jsx";
import StartTripCard from "./StartTrip";
import PropTypes from "prop-types";
import { UserOutlined } from "@ant-design/icons";
import { useSpring, animated } from "@react-spring/web"; // Import react-spring for animations
import "./dashboard.css";

const { Sider, Content, Header } = Layout;

const Dashboard = (props) => {
  const [trips, setTrips] = useState([]);
  const [showTrips, setShowTrips] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // To manage the modal visibility

  const handleStartTrip = () => {
    setIsModalVisible(true);
  };

  const handleGetTrips = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/trips/alltrips"
      );
      setTrips(response.data);
      setShowTrips(true);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const handleFinishTrip = async (tripId) => {
    // Get the current time as the end_time
    console.log("trip id is:", tripId);
    const endTime = new Date().toISOString();

    try {
      // Send a PUT request to update the end_time in the backend
      const response = await axios.put(
        `http://localhost:5000/api/trips/updateEndTime/${tripId}`,
        { end_time: endTime }
      );

      if (response.status === 200) {
        alert(`Trip ${tripId} finished at ${endTime}`);
        // Optionally, refresh trips or update UI state here
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

  // Fetch new trips every 5 seconds (real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      handleGetTrips();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animation for the trip cards
  const fadeIn = useSpring({
    opacity: showTrips ? 1 : 0,
    transform: showTrips ? "translateY(0)" : "translateY(20px)",
    config: { tension: 200, friction: 25 }, // Smooth and soft animation
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
            minWidth: "100vh",
          }}
        >
          <div className="header-title">Driver Dashboard</div>
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
          <Row gutter={[16, 16]}>
            {showTrips &&
              trips.map((trip) => (
                <Col span={8} key={trip.tripId}>
                  <animated.div style={fadeIn}>
                    {" "}
                    {/* Apply the animation to the trip card */}
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
        </Content>
      </Layout>

      {/* Modal for Start Trip */}
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
        />
      </Modal>
    </Layout>
  );
};

Dashboard.propTypes = {
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.object.isRequired,
};

export default Dashboard;
