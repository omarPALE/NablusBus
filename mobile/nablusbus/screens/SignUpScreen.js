import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import SignInComponent from "../components/SignUpComponent";

const SignUpScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      <View style={styles.container}>
        <SignInComponent />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  scrollview: { flexGrow: 1 },
});

export default SignUpScreen;
