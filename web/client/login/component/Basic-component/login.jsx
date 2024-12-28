import LoginContent from "../login-component/Login-Content";
import Header from "../login-component/Login-Header";
import Footer from "../login-component/Login-Footer";
import { PropTypes } from "prop-types";
function Login(props) {
  return (
    <div className="login-main-continer">
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
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.func.isRequired,
};
export default Login;
