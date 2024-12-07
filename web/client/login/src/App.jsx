import Login from "../component/Basic-component/login";
import Home from "../component/Basic-component/Home";
import Nav from "../component/Basic-component/Nav";
import SignUp from "../component/Basic-component/SignUp";
import Subscription from "../component/Basic-component/Subscription";
import TicketManagement from "../component/MyTicket-component/MyTicketContent";
import ScrollToTop from "../component/Basic-component/ScrolToTop";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Footer from "../component/Basic-component/Footer";
import DriverScanner from "../component/DriverScaner/DriverScanner";
import { Layout } from "antd";
import Navbar from "../component/admin-dashBoard/Nav";
import Sidebar from "../component/admin-dashBoard/SideBar";
import Dashboard from "../component/admin-dashBoard/DashBoard";

function App() {
  const [userState, setUserState] = useState({
    loggedIn: false,
    email: "",
    username: "",
    userID: 0,
    role: "passenger",
  });

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
              <Layout
                style={{
                  minHeight: "100vh",
                }}
              >
                <Sidebar />
                <Layout>
                  <Navbar />
                  <Routes>
                    <Route
                      path="/dashboard"
                      element={
                        <Dashboard
                          userState={userState}
                          setUserState={setUserState}
                        />
                      }
                    />
                  </Routes>
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
