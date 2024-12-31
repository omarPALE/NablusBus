import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LoginContent(props) {
  const navigate = useNavigate();

  // State to manage sign-in information, errors, "Remember Me", and logged-in state
  const [signInInfo, setSignInInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // State to manage error message
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false); // State for red border
  const [isEmailInvalid, setIsEmailInvalid] = useState(false); // State for red border
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
  // Load user from localStorage or sessionStorage
  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      props.setUserState(() => ({
        ...props.userState,
        loggedIn: true,
        email: userData.email,
        username: userData.username,
        user_id: userData.id,
        role: userData.role,
        word_id: userData.word_id,
      }));
      navigate("/home"); // Redirect to the home page if already logged in
    }
  }, []);

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

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
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
        const { email, username, id, role, work_id } = response.data;
        // Save user data to storage
        const userData = { email, username, id, role, work_id };
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData)); // Save to localStorage for persistence
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData)); // Save to sessionStorage for temporary persistence
        }
        // Update user state
        props.setUserState(() => ({
          ...props.userState,
          loggedIn: true,
          email: email,
          username: username,
          user_id: id,
          role: role, // Add role to user state for additional functionalities
          work_id: work_id,
        }));

        navigate("/home");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Incorrect password. Please try again.");
        setIsPasswordInvalid(true);
      } else if (err.response?.status === 404) {
        setError("User not found. Please sign up.");
        setIsEmailInvalid(true);
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
          value={signInInfo.email}
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
          value={signInInfo.password}
          onChange={handlePasswordChange}
        />

        <div className="form-check my-2">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember Me
          </label>
        </div>

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
