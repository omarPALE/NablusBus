import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginContent(props) {
  const navigate = useNavigate();

  // State to manage sign-in information and errors
  const [signInInfo, setSignInInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // State to manage error message
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false); // State for red border
  const [isEmailInvalid, setIsEmailInvalid] = useState(false); // State for red border

  const handleEmailChange = (e) => {
    setSignInInfo((prevState) => ({
      ...prevState,
      email: e.target.value,
    }));
    setError(""); // Clear error message when user types
    setIsPasswordInvalid(false); // Reset red border
    setIsEmailInvalid(false); // Reset red border
  };

  const handlePasswordChange = (e) => {
    setSignInInfo((prevState) => ({
      ...prevState,
      password: e.target.value,
    }));
    setError(""); // Clear error message when user types
    setIsPasswordInvalid(false); // Reset red border
  };

  const handleLogIn = async (e) => {
    e.preventDefault();

    try {
      // Send POST request
      const response = await axios.post("http://localhost:5000/users/email", {
        email: signInInfo.email,
        password: signInInfo.password,
      });

      if (response.status === 200) {
        const { email, username } = response.data;

        // Update user state
        props.setUserState(() => ({
          ...props.userState,
          loggedIn: true,
          email: email,
          username: username,
        }));

        console.log("user info : " + username);
        navigate("/home");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Incorrect password. Please try again."); // Set error message
        setIsPasswordInvalid(true); // Add red border
      } else if (err.response?.status === 404) {
        setError("User not found. Please sign up."); // Set error message
        setIsEmailInvalid(true); // Add red border
      } else {
        setError("An error occurred. Please try again later.");
        console.error("An error occurred:", err.message);
      }
    }
  };

  return (
    <div className="content">
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className={`form-control ${isEmailInvalid ? "error" : ""}`}
          id="exampleFormControlInput1"
          placeholder="name@example.com"
          onChange={handleEmailChange}
        />

        <label htmlFor="inputPassword5" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="inputPassword5"
          className={`form-control ${isPasswordInvalid ? "error" : ""}`}
          aria-describedby="passwordHelpBlock"
          onChange={handlePasswordChange}
        />

        <div
          id="passwordHelpBlock"
          className={`form-text ${
            isPasswordInvalid || isEmailInvalid ? "error" : ""
          }`}
        >
          {error || ""}
        </div>

        <button type="button" className="btn btn-primary" onClick={handleLogIn}>
          Log in
        </button>

        <p>Don&apos;t have an account?</p>
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

LoginContent.propTypes = {
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.func.isRequired,
};
