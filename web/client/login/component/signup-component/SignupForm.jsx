import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

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

const SignupForm = () => {
  const navigate = useNavigate();
  const [focusStates, setFocusStates] = useState({});
  const [values, setValues] = useState({});
  const [showPassword, setShowPassword] = useState([false]);
  const [confirmShowPassword, setConfirmShowPassword] = useState([false]);

  const formRefs = useRef({
    firstnameEl: null,
    lastnameEl: null,
    phoneEl: null,
    emailEl: null,
    passwordEl: null,
    confirmPasswordEl: null,
    formEl: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formRefs);
    console.log("Email:", formRefs.current.emailEl.value);
    console.log("Password:", formRefs.current.passwordEl.value);
    console.log("Confirm Password:", formRefs.current.confirmPasswordEl.value);
  };

  const handleFocus = (field) => {
    setFocusStates({ ...focusStates, [field]: true });
  };

  const handleBlur = (field) => {
    setFocusStates({ ...focusStates, [field]: false });
  };

  const handleChange = (field, value) => {
    setValues({ ...values, [field]: value });
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
                onBlur={() => handleBlur(name)}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            </InputWrapper>
          ))}
        </InputRow>
        {[
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
              onBlur={() => name !== "date" && handleBlur(name)}
              onChange={(e) => handleChange(name, e.target.value)}
            />
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

export default SignupForm;

/*  it is very important to use Ref with Dom element  and Attach the ref to the input or var attention attatch them by name not as string  */
