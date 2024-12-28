import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the route types for navigation
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export default function SignInForm() {
  // Type navigation for better type safety
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [fieldValidity, setFieldValidity] = useState({
    email: true,
    password: true,
  });
  const [focusStates, setFocusStates] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Validation Helpers
  const isRequired = (value: string): boolean => value.trim().length > 0;
  const isEmailValid = (email: string): boolean => {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  const validateField = (field: "email" | "password"): boolean => {
    if (field === "email") {
      return isRequired(formData.email) && isEmailValid(formData.email);
    } else if (field === "password") {
      return isRequired(formData.password);
    }
    return true;
  };

  // Input Handlers
  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFieldBlur = (field: "email" | "password") => {
    const isValid = validateField(field);
    setFieldValidity({ ...fieldValidity, [field]: isValid });
  };

  const handleFocus = (field: "email" | "password") => {
    setFocusStates({ ...focusStates, [field]: true });
  };

  const handleBlur = (field: "email" | "password") => {
    setFocusStates({ ...focusStates, [field]: false });
    handleFieldBlur(field);
  };

  // Submit Handler
  const handleSubmit = () => {
    const emailValid = validateField("email");
    const passwordValid = validateField("password");

    if (emailValid && passwordValid) {
      console.log("Sign In Successful", formData);
      // Implement sign-in logic here
    } else {
      console.log("Validation Failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {["email", "password"].map((field) => (
        <View key={field} style={styles.inputContainer}>
          <Text
            style={[
              styles.placeholder,
              focusStates[field as "email" | "password"]
                ? styles.placeholderFocused
                : {},
            ]}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Text>
          <TextInput
            placeholder=""
            value={formData[field as "email" | "password"]}
            onFocus={() => handleFocus(field as "email" | "password")}
            onBlur={() => handleBlur(field as "email" | "password")}
            onChangeText={(value) =>
              handleInputChange(field as "email" | "password", value)
            }
            style={styles.input}
            secureTextEntry={field === "password" && !showPassword}
          />
          {field === "password" && (
            <Text
              style={styles.showPassword}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </Text>
          )}
        </View>
      ))}

      <View style={styles.checkboxContainer}>
        <Switch
          value={formData.rememberMe}
          onValueChange={(value: boolean) =>
            setFormData({ ...formData, rememberMe: value })
          }
        />
        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
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
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
    top: "50%",
    transform: [{ translateY: -10 }],
    color: "#aaa",
    fontSize: 16,
  },
  placeholderFocused: {
    top: -10,
    fontSize: 12,
    color: "#333",
  },
  showPassword: {
    position: "absolute",
    right: 10,
    top: "50%",
    fontSize: 16,
    color: "#007BFF",
    transform: [{ translateY: -10 }],
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
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
  signUpText: {
    color: "#007BFF",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
