import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LoginContent(props) {
  const navigate = useNavigate();
  const [signInInfo, setSignInInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetAttempts, setResetAttempts] = useState(0);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (savedUser) {
      const userData = JSON.parse(savedUser);

      props.setUserState((prevState) => ({
        ...prevState,
        loggedIn: true,
        email: userData.email,
        username: userData.username,
        user_id: userData.id,
        role: userData.role,
        work_id: userData.work_id,
      }));

      navigate("/home");
    }
  }, [navigate, props]);

  const handleEmailChange = (e) => {
    setSignInInfo((prevState) => ({ ...prevState, email: e.target.value }));
    setError("");
    setIsPasswordInvalid(false);
    setIsEmailInvalid(false);
  };

  const handlePasswordChange = (e) => {
    setSignInInfo((prevState) => ({ ...prevState, password: e.target.value }));
    setError("");
    setIsPasswordInvalid(false);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleLogIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/users/email", {
        email: signInInfo.email,
        password: signInInfo.password,
      });

      if (response.status === 200) {
        const { email, username, id, role, work_id } = response.data;
        const userData = { email, username, id, role, work_id };
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData));
        }

        props.setUserState(() => ({
          ...props.userState,
          loggedIn: true,
          email: email,
          username: username,
          user_id: id,
          role: role,
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
      }
    }
  };

  const handleForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!signInInfo.email) {
      setError("Email field cannot be empty.");
      setIsEmailInvalid(true);
      return;
    }

    if (!emailRegex.test(signInInfo.email)) {
      setError("Please enter a valid email address.");
      setIsEmailInvalid(true);
      return;
    }

    if (resetAttempts >= 3) {
      setError(
        "You have been blocked for 24 hours due to multiple failed attempts."
      );
      return;
    }

    try {
      await axios.post("http://localhost:5000/users/forgot-password", {
        email: signInInfo.email,
      });
      setResetAttempts((prev) => prev + 1);
      setError("A reset code has been sent to your email.");
    } catch (err) {
      console.log(err);
      setError("Failed to send reset code. Please try again.", err);
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

        <button
          type="button"
          className="btn btn-secondary mt-2"
          onClick={handleForgotPassword}
        >
          Forgot Password?
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
