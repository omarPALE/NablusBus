import { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px dashed #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
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
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Placeholder = styled.span`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  font-size: 16px;
  color: #aaa;
  transition: all 0.2s ease-in-out;
  pointer-events: none;

  ${({ isFocusedOrFilled }) =>
    isFocusedOrFilled &&
    `
    top: -10px;
    font-size: 12px;
    color: #007bff;
  `}
`;

const InputWrapper = styled.div`
  position: relative;
  margin: 10px 0;
`;

const ShowPasswordIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`;

const SignupForm = () => {
  const [focusStates, setFocusStates] = useState({});
  const [values, setValues] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
    <FormContainer>
      {[
        { name: "email", label: "Email", type: "email" },
        {
          name: "password",
          label: "Password",
          type: showPassword ? "text" : "password",
        },
        { name: "address", label: "Address", type: "text" },
        { name: "town", label: "Town", type: "text" },
        { name: "state", label: "State", type: "text" },
        { name: "zip", label: "Zip", type: "text" },
        { name: "country", label: "Country", type: "text" },
      ].map(({ name, label, type }) => (
        <InputWrapper key={name}>
          <Placeholder isFocusedOrFilled={focusStates[name] || values[name]}>
            {label}
          </Placeholder>
          <InputField
            type={type}
            value={values[name] || ""}
            onFocus={() => handleFocus(name)}
            onBlur={() => handleBlur(name)}
            onChange={(e) => handleChange(name, e.target.value)}
          />
          {name === "password" && (
            <ShowPasswordIcon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </ShowPasswordIcon>
          )}
        </InputWrapper>
      ))}
    </FormContainer>
  );
};

export default SignupForm;
