import { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import "./signUpStyles.css";

const FormContainer = styled.div`
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px dashed #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const InputRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 10px 0;
`;

/**
 * A styled component for input fields in the signup form.
 *
 * @component
 * @example
 * const InputField = styled.input`
 *   width: 100%;
 *   padding: 10px;
 *   margin: 10px 0;
 *   border: 1px solid #ddd;
 *   border-radius: 5px;
 *   font-size: 16px;
 *   outline: none;
 *   transition: all 0.2s ease-in-out;
 *
 *   &:focus {
 *     border-color: #000000;
 *     box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
 *   }
 * `;
 *
 * @returns {React.Component} - A styled input field component.
 */
const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: #000000;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
`;

const Placeholder = styled.span`
  position: absolute;
  top: ${({ isDateField, isFocusedOrFilled }) =>
    isDateField || isFocusedOrFilled ? "-10px" : "50%"};
  left: 10px;
  transform: ${({ isDateField, isFocusedOrFilled }) =>
    isDateField || isFocusedOrFilled ? "translateY(0)" : "translateY(-50%)"};
  font-size: ${({ isDateField, isFocusedOrFilled }) =>
    isDateField || isFocusedOrFilled ? "12px" : "16px"};
  color: ${({ isDateField, isFocusedOrFilled }) =>
    isDateField || isFocusedOrFilled ? "000" : "#aaa"};
  transition: all 0.2s ease-in-out;
  pointer-events: none;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1; /* Ensure inputs share space equally */
`;

const ShowPasswordIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`;

const isRequired = (value) => (value === "" ? false : true);

const isBetween = (length, min, max) =>
  length < min || length > max ? false : true;

const isEmailValid = (email) => {
  const re = /^^[\w-.]+@([\w-]+\.)+[\w-]{2,5}$/;
  return re.test(email);
};

const isPhoneValid = (phone) => {
  const re = /^\+?[1-9]\d{1,3}?[-.\s]?(\d{1,4}[-.\s]?){1,3}\d{1,4}$/;
  return re.test(phone);
};

const isPasswordSecure = (password) => {
  const re = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  return re.test(password);
};
const isWorkIdValid = (workId) => /^\d{5}$/.test(workId);

const showError = (input, message) => {
  // get the form-field element
  const formField = input.parentElement;
  // add the error class
  formField.classList.remove("success");
  formField.classList.add("error");

  // show the error message
  const error = formField.querySelector("small");
  error.textContent = message;
};

const showSuccess = (input) => {
  // get the form-field element
  const formField = input.parentElement;

  // remove the error class
  formField.classList.remove("error");
  formField.classList.add("success");

  // hide the error message
  const error = formField.querySelector("small");
  error.textContent = "";
};
const SignupForm = (props) => {
  const navigate = useNavigate();
  const [focusStates, setFocusStates] = useState({});
  const [values, setValues] = useState({});
  const [showPassword, setShowPassword] = useState([true]);
  const [confirmShowPassword, setConfirmShowPassword] = useState([false]);
  const [message, setMessage] = useState("");

  // props.setUserState(() => ({
  //   ...props.userState,
  //   isLoggedIn: false,
  // }));
  const formRefs = useRef({
    firstnameEl: null,
    lastnameEl: null,
    phoneEl: null,
    emailEl: null,
    passwordEl: null,
    confirmPasswordEl: null,
    formEl: null,
  });

  /**
   * Handles the form submission event.
   * Validates the form fields, logs the input values, and checks the form validity.
   * If the form is valid, logs a message to the console.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isWorkIdValid = true;
    if (values.userType === "Driver") {
      isWorkIdValid = isWorkIdValid(formRefs.current.workIdEl.value.trim());
      if (!isWorkIdValid) {
        showError(
          formRefs.current.workIdEl,
          "Work ID must be a 5-digit number."
        );
      }
    }
    // Log the formRefs object
    // Validate form fields
    let isUsernameValid = checkUsername("firstnameEl", "First Name"),
      isLastNameValid = checkUsername("lastnameEl", "Last Name"),
      isBirthdayValid = checkUsername("date", "Birth date"),
      isEmailValid = checkEmail(),
      isPasswordValid = checkPassword(),
      isConfirmPasswordValid = checkConfirmPassword(),
      isPhoneValid = checkPhone();

    // Check the overall form validity
    let isFormValid =
      isUsernameValid &&
      isEmailValid &&
      isBirthdayValid &&
      isLastNameValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmPasswordValid;

    // Submit to the server if the form is valid
    if (isFormValid) {
      try {
        const formData = {
          username:
            formRefs.current.firstnameEl.value + // Replace with the actual ref for username
            formRefs.current.lastnameEl.value, // Replace with the actual ref for
          phone: formRefs.current.phoneEl.value, // Replace with the actual ref for email
          email: formRefs.current.emailEl.value, // Replace with the actual ref for email
          password: formRefs.current.passwordEl.value, // Replace with the actual ref for password
          work_id: formRefs.current.workIdEl.value,
          role:
            values.userType.charAt(0).toLowerCase() + values.userType.slice(1),
        };
        props.setUserState(() => ({
          ...props.userState,
          loggedIn: true,
        }));
        console.log("the data from web site is :", formData);
        const response = await axios.post(
          "http://localhost:5000/users/add",
          formData
        );

        navigate("/home");
        setMessage("Sign up successful!");
      } catch (err) {
        props.setUserState(() => ({
          ...props.userState,
          loggedIn: false,
        }));
        if (err.response && err.response.data) {
          // Show a popup or alert if duplicate key error
          alert(
            "This username or email is already in use. Please try another."
          );
        } else {
          setMessage("Error signing up. Please try again.");
        }
        console.error(err.message);
      }
    }
  };

  const handleFocus = (field) => {
    setFocusStates({ ...focusStates, [field]: true });
  };

  // const handleBlur = (field) => {
  //   setFocusStates({ ...focusStates, [field]: false });
  // };

  const handleChange = (field, value) => {
    setValues({ ...values, [field]: value });

    if (field === "workId" && values.userType === "Driver") {
      if (!isWorkIdValid(value)) {
        showError(
          formRefs.current.workIdEl,
          "Work ID must be a 5-digit number."
        );
      } else {
        showSuccess(formRefs.current.workIdEl);
      }
    }
    checkUsername("firstnameEl", "First Name"),
      checkUsername("lastnameEl", "Last Name"),
      checkUsername("date", "Birth date"),
      checkEmail(),
      checkPassword(),
      checkConfirmPassword(),
      checkPhone();
  };

  /**
   * Validates the confirmation password field.
   * Ensures the confirmation password matches the original password and is not empty.
   * @returns {boolean} - True if the confirmation password is valid, false otherwise.
   */
  const checkConfirmPassword = () => {
    let valid = false;
    const confirmPassword = formRefs.current.confirmPasswordEl.value.trim();
    const password = formRefs.current.passwordEl.value.trim();

    if (!isRequired(confirmPassword)) {
      showError(
        formRefs.current.confirmPasswordEl,
        "Please enter the password again"
      );
    } else if (password !== confirmPassword) {
      showError(
        formRefs.current.confirmPasswordEl,
        "Confirm password does not match"
      );
    } else {
      showSuccess(formRefs.current.confirmPasswordEl);
      valid = true;
    }

    return valid;
  };

  /**
   * Validates the password field.
   * Ensures the password is secure and follows the defined rules.
   * @returns {boolean} - True if the password is valid, false otherwise.
   */
  const checkPassword = () => {
    let valid = false;
    const password = formRefs.current.passwordEl.value.trim();

    if (!isRequired(password)) {
      showError(formRefs.current.passwordEl, "Password cannot be blank.");
    } else if (!isPasswordSecure(password)) {
      showError(
        formRefs.current.passwordEl,
        "Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)"
      );
    } else {
      showSuccess(formRefs.current.passwordEl);
      valid = true;
    }

    return valid;
  };

  /**
   * Validates the email field.
   * Ensures the email is not blank, has a valid format, and belongs to the allowed domains.
   * @returns {boolean} - True if the email is valid, false otherwise.
   */
  const checkEmail = () => {
    let valid = false;
    const allowedDomains = ["yahoo.com", "gmail.com", "hotmail.com"]; // Add allowed domains here
    const email = formRefs.current.emailEl.value.trim();

    if (!isRequired(email)) {
      showError(formRefs.current.emailEl, "Email cannot be blank.");
    } else if (!isEmailValid(email)) {
      showError(formRefs.current.emailEl, "Email is not valid.");
    } else {
      // Extract the domain from the email
      const emailDomain = email.split("@")[1];
      if (!allowedDomains.includes(emailDomain)) {
        showError(
          formRefs.current.emailEl,
          `Email domain must be one of: ${allowedDomains.join(", ")}.`
        );
      } else {
        showSuccess(formRefs.current.emailEl);
        valid = true;
      }
    }

    return valid;
  };

  /**
   * Validates the phone number field.
   * Ensures the phone number is not blank and matches the expected format.
   * @returns {boolean} - True if the phone number is valid, false otherwise.
   */
  const checkPhone = () => {
    let valid = false;
    const phone = formRefs.current.phoneEl.value.trim();
    if (!isRequired(phone)) {
      showError(formRefs.current.phoneEl, "Phone cannot be blank.");
    } else if (!isPhoneValid(phone)) {
      showError(formRefs.current.phoneEl, "Phone is not valid.");
    } else {
      showSuccess(formRefs.current.phoneEl);
      valid = true;
    }
    return valid;
  };

  /**
   * Validates a username field by reference name.
   * Ensures the username is not blank, does not start with a number, and falls within the required length.
   * @param {string} refName - The reference name of the input field in formRefs.
   * @param {string} name - The display name of the field for error messages.
   * @returns {boolean} - True if the username is valid, false otherwise.
   */
  const checkUsername = (refName, name) => {
    let valid = false;
    const min = 3,
      max = 25;
    const username = formRefs.current[refName].value.trim();

    if (!isRequired(username)) {
      showError(formRefs.current[refName], `${name} cannot be blank.`);
    } else if (/^\d/.test(username) && refName !== "date") {
      showError(
        formRefs.current[refName],
        `${name} cannot start with a number.`
      );
    } else if (!isBetween(username.length, min, max)) {
      showError(
        formRefs.current[refName],
        `${name} must be between ${min} and ${max} characters.`
      );
    } else {
      showSuccess(formRefs.current[refName]);
      valid = true;
    }
    return valid;
  };

  return (
    <form
      id="form"
      onSubmit={handleSubmit}
      ref={(el) => (formRefs.current.formEl = el)}
    >
      <FormContainer className="sign--up--continer">
        <InputRow>
          {[
            {
              name: "firstName",
              label: "First Name",
              type: "text",
              refName: "firstnameEl",
            },
            {
              name: "lastName",
              label: "Last Name",
              type: "text",
              refName: "lastnameEl",
            },
          ].map(({ name, label, type, refName }) => (
            <InputWrapper key={name}>
              <Placeholder
                isFocusedOrFilled={focusStates[name] || values[name]}
                isDateField={name === "date"}
              >
                {label}
              </Placeholder>
              <InputField
                ref={(el) => (formRefs.current[refName] = el)}
                type={type}
                value={values[name] || ""}
                onFocus={() => handleFocus(name)}
                onChange={(e) => handleChange(name, e.target.value)}
              />
              <small></small>
            </InputWrapper>
          ))}
        </InputRow>
        <div className="user-type-section">
          <h3 className="user-type-title">Select User Type:</h3>
          <div className="user-type-options">
            <label className="user-type-label">
              <input
                type="radio"
                name="userType"
                value="Passenger"
                onChange={() =>
                  setValues({ ...values, userType: "Passenger", workId: "" })
                }
                checked={values.userType === "Passenger"}
              />
              Passenger
            </label>
            <label className="user-type-label">
              <input
                type="radio"
                name="userType"
                value="Driver"
                onChange={() => setValues({ ...values, userType: "Driver" })}
                checked={values.userType === "Driver"}
              />
              Driver
            </label>
            <label className="user-type-label">
              <input
                type="radio"
                name="userType"
                value="Administrator"
                onChange={() =>
                  setValues({
                    ...values,
                    userType: "Administrator",
                    workId: "",
                  })
                }
                checked={values.userType === "Administrator"}
              />
              Administrator
            </label>
          </div>
          {values.userType === "Driver" && (
            <div className="work-id-field">
              <InputWrapper>
                <Placeholder
                  isFocusedOrFilled={focusStates.workId || values.workId}
                >
                  Work ID
                </Placeholder>
                <InputField
                  ref={(el) => (formRefs.current.workIdEl = el)}
                  type="text"
                  value={values.workId || ""}
                  onFocus={() => handleFocus("workId")}
                  onChange={(e) => handleChange("workId", e.target.value)}
                />
                <small></small>
              </InputWrapper>
            </div>
          )}
        </div>

        {[
          { name: "date", label: "Birth Date", type: "date", refName: "date" },

          {
            name: "phone",
            label: "Phone Number",
            type: "text",
            refName: "phoneEl",
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            refName: "emailEl",
          },
          {
            name: "password",
            label: "Password",
            type: showPassword ? "text" : "password",
            refName: "passwordEl",
          },
          {
            name: "confirmPassword",
            label: "Confirm Password",
            type: confirmShowPassword ? "text" : "password",
            refName: "confirmPasswordEl",
          },
        ].map(({ name, label, type, refName }) => (
          <InputWrapper key={name}>
            <Placeholder
              isFocusedOrFilled={focusStates[name] || values[name]}
              isDateField={name === "date"}
            >
              {label}
            </Placeholder>
            <InputField
              ref={(el) => (formRefs.current[refName] = el)}
              type={type}
              value={values[name] || ""}
              onFocus={() => name !== "date" && handleFocus(name)}
              // onBlur={handleSubmit}
              onChange={(e) => handleChange(name, e.target.value)}
            />
            <small style={{ fontSize: "5" }}></small>
            {name === "password" && (
              <ShowPasswordIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </ShowPasswordIcon>
            )}
            {name === "confirmPassword" && (
              <ShowPasswordIcon
                onClick={() => setConfirmShowPassword(!confirmShowPassword)}
              >
                {confirmShowPassword ? "🙈" : "👁️"}
              </ShowPasswordIcon>
            )}
          </InputWrapper>
        ))}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button type="submit" className="btn btn-primary">
            Sign Up
          </Button>
          <p>
            Already have an account?{" "}
            <a
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Log In
            </a>
          </p>
        </div>
      </FormContainer>
    </form>
  );
};
SignupForm.propTypes = {
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.func.isRequired,
};
export default SignupForm;

/*  it is very important to use Ref with Dom element  and Attach the ref to the input or var attention attatch them by name not as string  */
