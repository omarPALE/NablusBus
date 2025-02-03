import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Nablus Bus App!</Text>
      <Text style={styles.subtitle}>
        Your Safe, Smart, and Reliable Travel Partner
      </Text>
      <Text style={styles.subtitle}>Enjoy a Hassle-Free Ride Every Time</Text>

      {/* <Button
        title="Sign In"
        onPress={() => navigation.navigate("SignIn")}
        color="#ff6000"
      />
      <Button
        title="Sign up"
        onPress={() => navigation.navigate("SignUp")}
        color="#ff6000"
      />
      <Button
        title="Subscription"
        onPress={() => navigation.navigate("Subscription")}
        color="#ff6000"
      />
      <Button
        title="MyTicketsScreen"
        onPress={() => navigation.navigate("MyTicketsScreen")}
        color="#ff6000"
      />
      <Button
        title="Scanner"
        onPress={() => navigation.navigate("Scanner")}
        color="#ff6000"
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
    color: "#555", // Soft gray for a professional look
  },
});

export default HomeScreen;
