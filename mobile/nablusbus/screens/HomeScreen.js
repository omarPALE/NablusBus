import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My New App!</Text>
      <Button
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
      />
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
});

export default HomeScreen;
