import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// Define the type for your stack's navigation and route
type RootStackParamList = {
  standaloneScreen: undefined; // No parameters expected
};

// Specify the navigation and route props
type StandaloneScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "standaloneScreen"
>;

type StandaloneScreenRouteProp = RouteProp<
  RootStackParamList,
  "standaloneScreen"
>;

// Combine props into a single type
type Props = {
  navigation: StandaloneScreenNavigationProp;
  route: StandaloneScreenRouteProp;
};

export default function StandaloneScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is a standalone screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
});
