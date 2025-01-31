import React from "react";
import { View, StyleSheet } from "react-native";
import SignInComponent from "../components/SignInComponent";

const SignInScreen = () => {
  return (
    <View style={styles.container}>
      <SignInComponent />
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
});

export default SignInScreen;
