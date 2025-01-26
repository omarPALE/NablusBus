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
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverResetCode, setServerResetCode] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Verify Reset Code, 2: Reset Password
  const [passwordError, setPasswordError] = useState("");

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

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
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

    try {
      const response = await axios.post(
        "http://localhost:5000/users/forgot-password",
        {
          email: signInInfo.email,
        }
      );

      if (response.status === 200) {
        setServerResetCode(response.data.resetCode); // Save reset code from response
        setError("");
        setIsModalOpen(true); // Open modal for reset code verification
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("This email is not registered.");
        setIsEmailInvalid(true);
      } else {
        console.log(err);
        setError("Failed to send reset code. Please try again.");
      }
    }
  };

  const handleVerifyResetCode = () => {
    if (resetCode !== serverResetCode) {
      setError("Invalid reset code. Please try again.");
      return;
    }

    // Password reset successful
    setError("Password reset successful. You can log in now.");
    setIsModalOpen(false);
  };
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    // Validate password and set error message
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
    } else {
      setPasswordError(""); // Clear error if valid
    }
  };

  const handleResetPassword = async () => {
    if (passwordError) {
      setError("Please fix the password validation errors.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users/reset-password", {
        email: signInInfo.email,
        newPassword,
      });

      setError("Password reset successful. You can log in now.");
      setIsModalOpen(false); // Close modal after successful reset
    } catch (err) {
      console.log(err);
      setError(
        "An error occurred while resetting your password. Please try again."
      );
    }
  };

  return (
    <div className="content">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className={`form-control ${isEmailInvalid ? "error" : ""}`}
          id="email"
          placeholder="name@example.com"
          value={signInInfo.email}
          onChange={handleEmailChange}
        />

        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className={`form-control ${isPasswordInvalid ? "error" : ""}`}
          id="password"
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

        <div className="form-text text-danger">{error}</div>

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
          type="button"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>

      {isModalOpen && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              textAlign: "center",
            }}
          >
            {currentStep === 1 && (
              <>
                <h3>Verify Reset Code</h3>
                <label htmlFor="resetCode" className="form-label mt-2">
                  Enter Reset Code:
                </label>
                <input
                  type="text"
                  id="resetCode"
                  className="form-control mb-3"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
                {error && <p className="text-danger">{error}</p>}
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleVerifyResetCode}
                >
                  Verify Reset Code
                </button>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => setIsModalOpen(false)}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h3>Reset Password</h3>
                <label htmlFor="newPassword" className="form-label mt-2">
                  Enter New Password:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className={`form-control mb-3 ${
                    passwordError ? "is-invalid" : ""
                  }`}
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
                {passwordError && (
                  <p className="text-danger">{passwordError}</p>
                )}
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => setIsModalOpen(false)}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

LoginContent.propTypes = {
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.func.isRequired,
};
