import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  driverId?: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>(
    {}
  );
  const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFocus = (field: keyof FormData) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field: keyof FormData) => {
    setFocusedFields({ ...focusedFields, [field]: false });
    const isValid = validateField(field);
    setFieldValidity({ ...fieldValidity, [field]: isValid });
  };

  const validateField = (field: keyof FormData): boolean => {
    switch (field) {
      case "firstName":
      case "lastName":
        return checkUsername(field);
      case "phone":
        return checkPhone();
      case "email":
        return checkEmail();
      case "password":
        return checkPassword();
      case "confirmPassword":
        return checkConfirmPassword();
      case "driverId":
        return validateDriverId();
      default:
        return true;
    }
  };

  const checkUsername = (field: keyof FormData): boolean => {
    const value = formData[field] || "";
    if (!value.trim()) return false;
    if (/^\d/.test(value)) return false;
    if (value.length < 3 || value.length > 25) return false;
    return true;
  };

  const checkPhone = (): boolean => {
    const phone = formData.phone.trim();
    const phoneRegex = /^(056|059)[0-9]{7}$/;
    return phoneRegex.test(phone);
  };

  const checkEmail = (): boolean => {
    const email = formData.email.trim();
    const allowedDomains = ["yahoo.com", "gmail.com", "hotmail.com"];
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) return false;
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

  const checkPassword = (): boolean => {
    const password = formData.password;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  const checkConfirmPassword = (): boolean => {
    const confirmPassword = formData.confirmPassword;
    return confirmPassword === formData.password;
  };

  const validateDriverId = (): boolean => {
    if (formData.role === "Driver") {
      const driverId = formData.driverId || "";
      return /^[0-9]{5}$/.test(driverId);
    }
    return true;
  };

  const handleSubmit = async () => {
    if (Object.values(fieldValidity).every((isValid) => isValid)) {
      const payload = {
        username: formData.firstName + formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: formData.role.charAt(0).toLowerCase() + formData.role.slice(1),
        work_id: formData.driverId,
      };
      console.log("The submitted data from mobile is:", payload);

      try {
        const response = await axios.post(
          "http://192.168.1.7:5000/users/add",
          payload
        );
        console.log("User added successfully:", response.data);

        // Display success message
        setMessage("User added successfully!");
        setMessageType("success");
        setShowMessage(true);

        // Hide message after 3 seconds
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      } catch (error) {
        console.error("Error adding user:", error);

        // Display error message
        setMessage("Failed to add user. Please try again.");
        setMessageType("error");
        setShowMessage(true);

        // Hide message after 3 seconds
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    } else {
      console.error("Form validation failed.");

      // Display validation error message
      setMessage("Form validation failed. Please check your inputs.");
      setMessageType("error");
      setShowMessage(true);

      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} onPress={handleSubmit}>
        Sign Up
      </Text>

      {Object.keys(formData)
        .filter(
          (key) =>
            key !== "userType" &&
            key !== "driverId" &&
            key !== "role" &&
            key !== "password" &&
            key !== "confirmPassword"
        )
        .map((key) => (
          <View
            key={key}
            style={[
              styles.inputContainer,
              fieldValidity[key] === false
                ? styles.invalidInput
                : fieldValidity[key] === true
                ? styles.validInput
                : {},
            ]}
          >
            <Text
              style={[
                styles.placeholder,
                focusedFields[key] || formData[key as keyof FormData]
                  ? styles.placeholderFocused
                  : {},
              ]}
            >
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </Text>
            <TextInput
              value={formData[key as keyof FormData]}
              onChangeText={(value) =>
                handleInputChange(key as keyof FormData, value)
              }
              onFocus={() => handleFocus(key as keyof FormData)}
              onBlur={() => handleBlur(key as keyof FormData)}
              style={styles.input}
            />
          </View>
        ))}

      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeLabel}>Select User Type:</Text>
        <View style={styles.radioButtonContainer}>
          {["Passenger", "Driver", "Administrator"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleInputChange("role", type)}
              style={[
                styles.radioButton,
                formData.role === type && styles.radioButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  formData.role === type && styles.radioButtonTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {formData.role === "Driver" && (
        <View
          style={[
            styles.inputContainer,
            fieldValidity.driverId === false
              ? styles.invalidInput
              : fieldValidity.driverId === true
              ? styles.validInput
              : {},
          ]}
        >
          <Text
            style={[
              styles.placeholder,
              focusedFields.driverId || formData.driverId
                ? styles.placeholderFocused
                : {},
            ]}
          >
            Driver ID (5 digits)
          </Text>
          <TextInput
            value={formData.driverId || ""}
            onChangeText={(value) => handleInputChange("driverId", value)}
            onFocus={() => handleFocus("driverId")}
            onBlur={() => handleBlur("driverId")}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text
          style={[
            styles.placeholder,
            focusedFields.password || formData.password
              ? styles.placeholderFocused
              : {},
          ]}
        >
          Password
        </Text>
        <TextInput
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          onFocus={() => handleFocus("password")}
          onBlur={() => handleBlur("password")}
          style={styles.input}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.showPasswordIcon}
        >
          <Text>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text
          style={[
            styles.placeholder,
            focusedFields.confirmPassword || formData.confirmPassword
              ? styles.placeholderFocused
              : {},
          ]}
        >
          Confirm Password
        </Text>
        <TextInput
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          onFocus={() => handleFocus("confirmPassword")}
          onBlur={() => handleBlur("confirmPassword")}
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.showPasswordIcon}
        >
          <Text>{showConfirmPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Sign Up</Text>
      </TouchableOpacity>
      {showMessage && (
        <View
          style={{
            position: "absolute",
            top: 20,
            left: "20%",
            transform: [{ translateX: -50 }],
            padding: 10,
            backgroundColor: messageType === "success" ? "green" : "red",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white" }}>{message}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    position: "relative",
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  placeholder: {
    position: "absolute",
    left: 10,
    top: 15,
    fontSize: 16,
    color: "#aaa",
    zIndex: 1,
  },
  placeholderFocused: {
    top: -20,
    fontSize: 12,
    color: "#555",
  },
  invalidInput: {
    borderColor: "red",
  },
  validInput: {
    borderColor: "green",
  },
  userTypeContainer: {
    marginVertical: 20,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  radioButtonSelected: {
    borderColor: "#ff6000",
    backgroundColor: "#ff6000",
  },
  radioButtonText: {
    fontSize: 14,
  },
  radioButtonTextSelected: {
    color: "#fff",
  },
  showPasswordIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  submitButton: {
    backgroundColor: "#ff6000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
