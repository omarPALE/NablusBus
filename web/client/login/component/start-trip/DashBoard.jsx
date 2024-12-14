import { useState } from "react";
import { Layout, Menu, Row, Col, Modal } from "antd";
import TripCard from "./TripCard.jsx";
import "./dashboard.css";
import StartTripCard from "./StartTrip";
import PropTypes from "prop-types";
const { Sider, Content } = Layout;

const Dashboard = (props) => {
  const [trips, setTrips] = useState([]);
  const [showTrips, setShowTrips] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // To manage the modal visibility

  const handleStartTrip = () => {
    setIsModalVisible(true); // Open the modal when "Start Trip" is clicked
  };

  const handleGetTrips = () => {
    // Simulating fetching trips
    const fetchedTrips = [
      {
        tripId: 1,
        busNumber: "B123",
        status: "In Progress",
        driverName: "John Doe",
      },
      {
        tripId: 2,
        busNumber: "B124",
        status: "Completed",
        driverName: "Jane Smith",
      },
    ];
    setTrips(fetchedTrips);
    setShowTrips(true);
  };

  const handleFinishTrip = (tripId) => {
    alert(`Trip ${tripId} Finished`);
    // Logic to finish trip (update database, etc.)
  };

  const handleCancelModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={200}
        className="site-layout-background"
        style={{ backgroundColor: "#ff6000" }}
      >
        <div className="logo" />
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

      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Row gutter={[16, 16]}>
            {showTrips &&
              trips.map((trip) => (
                <Col span={8} key={trip.tripId}>
                  <TripCard trip={trip} onFinishTrip={handleFinishTrip} />
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
        footer={null} // Remove footer buttons as StartTripCard will have its own buttons
        width={600} // Customize width if necessary
      >
        {/* <Dashboard
          setUserState={setUserState}
          userState={userState}
          busNumber={101}
          availableRoutes={["Route A", "Route B", "Route C"]}
          onStartTrip={handleStartTrip}
          driverId="12345"
        /> */}
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
