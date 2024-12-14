import Login from "../component/Basic-component/login";
import Home from "../component/Basic-component/Home";
import Nav from "../component/Basic-component/Nav";
import SignUp from "../component/Basic-component/SignUp";
import Subscription from "../component/Basic-component/Subscription";
import TicketManagement from "../component/MyTicket-component/MyTicketContent";
import ScrollToTop from "../component/Basic-component/ScrolToTop";
import { Route, Routes } from "react-router-dom";
import Footer from "../component/Basic-component/Footer";
import DriverScanner from "../component/DriverScaner/DriverScanner";
import { Layout } from "antd";
import Navbar from "../component/admin-dashBoard/Nav";
import Sidebar from "../component/admin-dashBoard/SideBar";
// import Dashboard from "../component/admin-dashBoard/Dashboard";
import StartTripCard from "../component/start-trip/StartTrip";
import Dashboard from "../component/start-trip/DashBoard";

// import axios from "axios";
import { useState } from "react";
function App() {
  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/users");
  //     if (response.status === 200) {
  //       console.log("Users fetched successfully:", response.data);
  //     } else {
  //       console.error("Failed to fetch users. Status:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching users:", error.message);
  //   }
  // };
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const [userState, setUserState] = useState({
    loggedIn: false,
    email: "",
    username: "",
    userID: 0,
    role: "passenger",
    work_id: 1,
  });
  const [links, setLinks] = useState([]);

  const handleStartTrip = (tripDetails) => {
    console.log("Trip started:", tripDetails);
    // Send trip details to the backend or perform other actions
  };

  return (
    <div className="main-container">
      <Nav userState={userState} setUserState={setUserState} />
      <ScrollToTop />
      <Routes>
        {/* Basic routes */}
        <Route
          path="/login"
          element={<Login setUserState={setUserState} userState={userState} />}
        />
        <Route
          path="/home"
          element={<Home setUserState={setUserState} userState={userState} />}
        />
        <Route
          path="/"
          element={<Home setUserState={setUserState} userState={userState} />}
        />
        <Route
          path="/signup"
          element={<SignUp setUserState={setUserState} userState={userState} />}
        />
        <Route
          path="/subscription"
          element={
            <Subscription setUserState={setUserState} userState={userState} />
          }
        />
        <Route
          path="/trip"
          element={
            <Dashboard
              setUserState={setUserState}
              userState={userState}
              busNumber={101}
              availableRoutes={["Route A", "Route B", "Route C"]}
              onStartTrip={handleStartTrip}
              driverId="12345"
            />
          }
        />
        {userState.loggedIn && (
          <Route
            path="/ticket"
            element={
              <TicketManagement
                setUserState={setUserState}
                userState={userState}
              />
            }
          />
        )}
        <Route path="/scan" element={<DriverScanner />} />

        {/* Admin dashboard route */}
        {userState.role === "administrator" && (
          <Route
            path="/admin/*"
            element={
              <Layout style={{ minHeight: "100vh" }}>
                {/* Navbar for Admin */}
                <Navbar links={links} />
                {/* Sidebar Component */}
                <Sidebar userState={userState} setLinks={setLinks} />
                <Layout>
                  <div>
                    {/* Content is conditionally rendered in Sidebar */}
                  </div>
                </Layout>
              </Layout>
            }
          />
        )}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
