// import SignUpContent from "./signup-component/Signup-content"; // Assuming SignUpContent is defined in a separate file
import SignupForm from "./signup-component/SignupForm"; // Assuming SignUpContent is defined in a separate file

import Header from "./login-component/Login-Header";
import Footer from "./login-component/Login-Footer";

export default function SignUp() {
  return (
    <div className="login-main-continer">
      <Header title="Sign up" />
      {/* <SignUpContent /> */}
      <SignupForm /> {/* Assuming SignupForm is defined in a separate file */}
      <Footer />
    </div>
  );
}
