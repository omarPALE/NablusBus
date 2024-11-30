import Login from "../component/Login";
import Home from "../component/Home";
import Nav from "../component/Nav";
import SignUp from "../component/SignUp";
import Subscription from "../component/Subscription";
import TicketManagement from "../component/MyTicket-component/MyTicketContent";
import ScrollToTop from "../component/ScrolToTop";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
  const [userState, setUserState] = useState({
    loggedIn: false,
  });
  console.log("hi from app ==>>> " + userState.loggedIn);

  return (
    <div className="main-continer">
      <Nav userState={userState} />
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
          path="/ticket"
          element={
            <TicketManagement
              setUserState={setUserState}
              userState={userState}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
