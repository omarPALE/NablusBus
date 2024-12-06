// import SignUpContent from "./signup-component/Signup-content"; // Assuming SignUpContent is defined in a separate file
import SignupForm from "../signup-component/SignupForm"; // Assuming SignUpContent is defined in a separate file
import PropTypes from "prop-types";
import Header from "../login-component/Login-Header";
// import Footer from "./login-component/Login-Footer";

export default function SignUp(props) {
  return (
    <div className="login-main-continer">
      <Header title="Sign up" />
      {/* <SignUpContent /> */}
      <SignupForm
        setUserState={props.setUserState}
        userState={props.userState}
      />{" "}
      {/* Assuming SignupForm is defined in a separate file */}
      {/* <Footer /> */}
    </div>
  );
}

SignUp.propTypes = {
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.object.isRequired,
};
