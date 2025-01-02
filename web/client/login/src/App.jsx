import { useState, createContext } from "react";
import { getSocket } from "../component/socket/socketService"; // Import the WebSocket singleton
import { Route, Routes } from "react-router-dom";
import Nav from "../component/Basic-component/Nav";
import ScrollToTop from "../component/Basic-component/ScrolToTop";
import Footer from "../component/Basic-component/Footer";
import Login from "../component/Basic-component/login";
import Home from "../component/Basic-component/Home";
import SignUp from "../component/Basic-component/SignUp";
import Subscription from "../component/Basic-component/Subscription";
import TicketManagement from "../component/MyTicket-component/MyTicketContent";
import DriverScanner from "../component/DriverScaner/DriverScanner";
import Dashboard from "../component/start-trip/DashBoard";
import Tracking from "../component/tracking/tracking";
import { Layout } from "antd";
import Navbar from "../component/admin-dashBoard/Nav";
import Sidebar from "../component/admin-dashBoard/SideBar";

// Create a WebSocket Context
export const SocketContext = createContext();

function App() {
  const [userState, setUserState] = useState({
    loggedIn: false,
    email: "",
    username: "",
    userID: 0,
    role: "passenger",
    work_id: 1,
  });
  const [links, setLinks] = useState([]);
  const [startWorking, setStartWorking] = useState(false);

  // Get a shared WebSocket instance
  const socket = getSocket();

  const handleStartTrip = (tripDetails) => {
    console.log("Trip started:", tripDetails);
    // Send trip details to the backend or perform other actions
  };
  socket.onAny((event, data) => {
    console.log(`Received event: ${event}`, data);
  });

  socket.on("bus-location", (data) => {
    console.log("from google broadcast ", data);
    // Destructure bus_id, latitude, and longitude from the data
  });
  return (
    <SocketContext.Provider value={socket}>
      <div className="main-container">
        <Nav
          userState={userState}
          setUserState={setUserState}
          start={startWorking}
          setStart={setStartWorking}
        />
        <ScrollToTop />
        <Routes>
          <Route
            path="/login"
            element={
              <Login setUserState={setUserState} userState={userState} />
            }
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
            path="/tracking"
            element={
              <Tracking setUserState={setUserState} userState={userState} />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp setUserState={setUserState} userState={userState} />
            }
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
                start={startWorking}
                setStart={setStartWorking}
                setUserState={setUserState}
                userState={userState}
                availableRoutes={["Route A", "Route B", "Route C"]}
                onStartTrip={handleStartTrip}
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
          {userState.role === "administrator" && (
            <Route
              path="/admin/*"
              element={
                <Layout style={{ minHeight: "100vh" }}>
                  <Navbar links={links} />
                  <Sidebar userState={userState} setLinks={setLinks} />
                  <Layout>
                    <div>{/* Content for admin dashboard */}</div>
                  </Layout>
                </Layout>
              }
            />
          )}
        </Routes>
        <Footer />
      </div>
    </SocketContext.Provider>
  );
}

export default App;
