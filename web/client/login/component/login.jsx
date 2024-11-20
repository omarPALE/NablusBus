import Content from "./login-component/Login-Content";
import Header from "./login-component/Login-Header";
import Footer from "./login-component/Login-Footer";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Perform sign-in logic here
    console.log("Signing in");
    navigate("/home"); // Redirect to Home page
  };

  const handleSignUp = () => {
    // Perform sign-up logic here
    navigate("/signup"); // Redirect to Home page
  };
  return (
    <div className="login-main-continer" style={{ backgroundColor: "black" }}>
      <Header title="Sign in" />
      <Content handleSignIn={handleSignIn} handleSignUp={handleSignUp} />
      <Footer />
    </div>
  );
}

export default Login;
