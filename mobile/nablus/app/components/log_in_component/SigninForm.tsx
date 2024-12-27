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

export default function SignInForm() {
  const navigation = useNavigation();
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

  const handleSubmit = () => {
    const emailValid = validateField("email");
    const passwordValid = validateField("password");

    if (emailValid && passwordValid) {
      console.log("Sign In Successful", formData);
      // Handle sign-in logic here
    } else {
      console.log("Validation Failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {Object.entries({ email: "Email", password: "Password" }).map(
        ([key, label]) => (
          <View key={key} style={styles.inputContainer}>
            <Text
              style={[
                styles.placeholder,
                focusStates[key as "email" | "password"]
                  ? styles.placeholderFocused
                  : {},
              ]}
            >
              {label}
            </Text>
            <TextInput
              placeholder=""
              value={formData[key as "email" | "password"]}
              onFocus={() => handleFocus(key as "email" | "password")}
              onBlur={() => handleBlur(key as "email" | "password")}
              onChangeText={(value) =>
                handleInputChange(key as "email" | "password", value)
              }
              style={styles.input}
              secureTextEntry={key === "password" && !showPassword}
            />
            {key === "password" && (
              <Text
                style={styles.showPassword}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </Text>
            )}
          </View>
        )
      )}

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
    transform: [{ translateY: -40 }],
    color: "#aaa",
    fontSize: 16,
  },
  placeholderFocused: {
    top: -10,
    transform: [{ translateY: 0 }],
    fontSize: 12,
    color: "#333",
  },
  showPassword: {
    position: "absolute",
    right: 10,
    top: 45,
    transform: [{ translateY: -30 }],
    fontSize: 16,
    color: "#007BFF",
    cursor: "pointer",
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
