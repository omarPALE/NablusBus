import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// Define the type for your stack's navigation and route
type RootStackParamList = {
  standaloneScreen: undefined; // No parameters expected
  two: undefined; // Current screen
};

// Specify the navigation prop for the 'two' screen
type TwoScreenNavigationProp = StackNavigationProp<RootStackParamList, "two">;

type TwoScreenRouteProp = RouteProp<RootStackParamList, "two">;

// Combine props into a single type
type Props = {
  navigation: TwoScreenNavigationProp;
  route: TwoScreenRouteProp;
};

export default function TwoScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is Tab Two</Text>
      <Button
        title="Go to Standalone Screen"
        onPress={() => navigation.navigate("standaloneScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
});
