import PropTypes from "prop-types";
import useNavigate from "react-router-dom";
export default function LoginContent(props) {
  const navigate = useNavigate();

  return (
    <div className="content">
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
        />

        <label htmlFor="inputPassword5" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="inputPassword5"
          className="form-control"
          aria-describedby="passwordHelpBlock"
        />
        <div id="passwordHelpBlock" className="form-text">
          Your password must be 8-20 characters long, contain letters and
          numbers, and must not contain spaces, special characters, or emoji.
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
        <p>Don&apos;t have an account?</p>
        <button
          className="btn b.tn-primary"
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
  handleSignIn: PropTypes.func.isRequired,
  handleSignUp: PropTypes.func.isRequired,
};
