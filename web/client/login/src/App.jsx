import Login from "../component/Login";
import Home from "../component/Home";
import Nav from "../component/Nav";
import SignUp from "../component/SignUp";
import Subscription from "../component/Subscription";
import TicketManagement from "../component/MyTicket-component/MyTicketContent";
import ScrollToTop from "../component/ScrolToTop";
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login"); // Redirect to sign in page
  };
  const handleSignUp = () => {
    navigate("/signup"); // Redirect to sign Up page
  };
  const handleHome = () => {
    navigate("/home"); // Redirect from home to sign in page
  };

  return (
    <div className="main-continer">
      <Nav
        handleSignIn={handleSignIn}
        handleHome={handleHome}
        handleSignUp={handleSignUp}
      />
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/ticket" element={<TicketManagement />} />
      </Routes>
    </div>
  );
}

export default App;
