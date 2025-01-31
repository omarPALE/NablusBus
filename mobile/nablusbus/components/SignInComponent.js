import  { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";

export default function SignInComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      // Send POST request to the server
      const response = await axios.post("http://192.168.1.4:5000/users/email", {
        email,
        password,
      });

      if (response.status === 200) {
        const { email, username, id, role, work_id } = response.data;

        // Save user data locally
        const userData = { email, username, id, role, work_id };

        if (rememberMe) {
          await AsyncStorage.setItem("user", JSON.stringify(userData)); // Persistent storage
        }

        // Navigate to Home screen
        navigation.navigate("Home");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Incorrect password. Please try again.");
      } else if (err.response?.status === 404) {
        alert("User not found. Please sign up.");
      } else {
        alert("An error occurred. Please try again later.");
        console.error("An error occurred:", err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoFocus // Ensures cursor is active on focus
          />
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword} // Toggle password visibility
          />
          <TouchableOpacity
            style={styles.showPasswordIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me Checkbox */}
        <View style={styles.rememberMeContainer}>
          <Switch
            value={rememberMe}
            onValueChange={(newValue) => setRememberMe(newValue)}
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Navigation */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    position: "relative", // Necessary for the password icon
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  showPasswordIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center the icon
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeText: {
    fontSize: 16,
    marginLeft: 8,
  },
  signInButton: {
    backgroundColor: "#ff6000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6000",
  },
});
