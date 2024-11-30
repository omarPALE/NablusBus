import LoginContent from "./login-component/Login-Content";
import Header from "./login-component/Login-Header";
import Footer from "./login-component/Login-Footer";
import { propTypes } from "prop-types";
function Login(props) {
  return (
    <div className="login-main-continer" style={{ backgroundColor: "black" }}>
      <Header title="Sign in" />
      <LoginContent
        setUserState={props.setUserState}
        userState={props.userState}
      />
      <Footer />
    </div>
  );
}
Login.propTypes = {
  setUserState: propTypes.func.isRequired,
  userState: propTypes.func.isRequired,
};
export default Login;
