import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import axios from "axios";
export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // User type: Passenger, Driver, Admin
    driverId: "",
  });

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Animation for password toggle

  const [fieldValidity, setFieldValidity] = useState({});
  const [focusedFields, setFocusedFields] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    const isValid = validateField(field);
    setFieldValidity({ ...fieldValidity, [field]: isValid });

    if (field === "password" || field === "confirmPassword") {
      setFieldValidity((prevValidity) => ({
        ...prevValidity,
        confirmPassword: checkConfirmPassword(),
      }));
    }
  };

  const handleFocus = (field) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field) => {
    setFocusedFields({ ...focusedFields, [field]: false });
    const isValid = validateField(field);
    setFieldValidity({ ...fieldValidity, [field]: isValid });
  };

  const validateField = (field) => {
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

  const checkUsername = (field) => {
    const value = formData[field] || "";
    return (
      value.trim() &&
      !/^\d/.test(value) &&
      value.length >= 3 &&
      value.length <= 25
    );
  };

  const checkPhone = () => {
    const phone = formData.phone.trim();
    return /^(056|059)[0-9]{7}$/.test(phone);
  };

  const checkEmail = () => {
    const email = formData.email.trim();
    const allowedDomains = ["yahoo.com", "gmail.com", "hotmail.com"];
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) return false;
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

  const checkPassword = () => {
    const password = formData.password;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
      password
    );
  };

  const checkConfirmPassword = () => {
    return formData.confirmPassword === formData.password;
  };

  const validateDriverId = () => {
    if (formData.role === "Driver") {
      return /^[0-9]{5}$/.test(formData.driverId || "");
    }
    return true;
  };

  const handleUserTypeChange = (role) => {
    setFormData({ ...formData, role, driverId: role === "Driver" ? "" : null });
  };

  const togglePasswordVisibility = (type) => {
    Animated.timing(fadeAnim, {
      toValue: type === "password" ? (showPassword ? 0 : 1) : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (type === "password") setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };
  const handleSubmit = async () => {
    // Check if all fields are valid
    if (Object.values(fieldValidity).every((isValid) => isValid)) {
      // Prepare the payload
      const payload = {
        username: formData.firstName + formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: formData.role.charAt(0).toLowerCase() + formData.role.slice(1),
        work_id: formData.driverId || null, // Include driverId only if applicable
      };
      console.log("The submitted data from mobile is:", payload);

      try {
        // Send data to the server
        const response = await axios.post(
          "http://192.168.1.7:5000/users/add",
          payload
        );
        console.log("User added successfully:", response.data);

        // Display success message
        setMessage("User added successfully!");
        setMessageType("success");
        setShowMessage(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      } catch (error) {
        console.error("Error adding user:", error);

        // Display error message
        setMessage("Failed to add user. Please try again.");
        setMessageType("error");
        setShowMessage(true);

        // Hide error message after 3 seconds
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

      // Hide validation error message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Render Input Fields */}
      {["firstName", "lastName", "phone", "email"].map((key) => (
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
              focusedFields[key] || formData[key]
                ? styles.placeholderFocused
                : {},
            ]}
          >
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </Text>
          <TextInput
            value={formData[key]}
            onChangeText={(value) => handleInputChange(key, value)}
            onFocus={() => handleFocus(key)}
            onBlur={() => handleBlur(key)}
            style={[styles.input]}
          />
        </View>
      ))}

      {/* User Type Field */}
      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeLabel}>Select User Type:</Text>
        <View style={styles.radioGroup}>
          {["Passenger", "Driver", "Admin"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleUserTypeChange(type)}
              style={[
                styles.radioButton,
                formData.role === type && styles.radioButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.radioText,
                  formData.role === type && styles.radioTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Driver ID Field */}
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
            value={formData.driverId}
            onChangeText={(value) => handleInputChange("driverId", value)}
            onFocus={() => handleFocus("driverId")}
            onBlur={() => handleBlur("driverId")}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Password Fields */}
      {["password", "confirmPassword"].map((key, index) => (
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
              focusedFields[key] || formData[key]
                ? styles.placeholderFocused
                : {},
            ]}
          >
            {key === "password" ? "Password" : "Confirm Password"}
          </Text>
          <TextInput
            value={formData[key]}
            onChangeText={(value) => handleInputChange(key, value)}
            onFocus={() => handleFocus(key)}
            onBlur={() => handleBlur(key)}
            style={[styles.input]}
            secureTextEntry={
              key === "password" ? !showPassword : !showConfirmPassword
            }
          />
          <TouchableOpacity
            onPress={() => togglePasswordVisibility(key)}
            style={styles.showPasswordIcon}
          >
            <MaterialIcons
              name={
                key === "password"
                  ? showPassword
                    ? "visibility"
                    : "visibility-off"
                  : showConfirmPassword
                  ? "visibility"
                  : "visibility-off"
              }
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Sign Up</Text>
      </TouchableOpacity>
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
    marginVertical: 15,
    borderWidth: 2,
    borderRadius: 8,
    position: "relative",
    height: 60,
  },
  input: {
    padding: 15,
    fontSize: 18,
  },
  placeholder: {
    position: "absolute",
    left: 15,
    top: 18,
    fontSize: 16,
    color: "#aaa",
  },
  placeholderFocused: {
    top: -20,
    fontSize: 12,
    color: "#555",
  },
  invalidInput: {
    borderColor: "red",
  },
  showPasswordIcon: {
    position: "absolute",
    right: 15, // Distance from the right side of the input container
    top: "50%", // Vertically align in the center
    transform: [{ translateY: -12 }], // Adjust for perfect centering
    zIndex: 10, // Make sure it stays on top
  },
  validInput: {
    borderColor: "green",
  },
  userTypeContainer: {
    marginVertical: 20,
  },
  userTypeLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  radioButtonSelected: {
    borderColor: "#ff6000",
    backgroundColor: "#ff6000",
  },
  radioText: {
    fontSize: 16,
    color: "#555",
  },
  radioTextSelected: {
    color: "#fff",
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
    fontSize: 18,
    fontWeight: "bold",
  },
});
