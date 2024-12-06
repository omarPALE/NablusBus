import Login from "../component/Basic-component//Login";
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

function App() {
  const [userState, setUserState] = useState({
    loggedIn: false,
    email: "",
    username: "",
    userID: 0,
    role: "passenger",
  });

  return (
    <div className="main-continer">
      <Nav userState={userState} setUserState={setUserState} />
      <ScrollToTop />
      <Routes>
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
