import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInForm from "../components/log_in_component/SigninForm";
import SignupForm from "../components/sign_up_component/SignUpForm";
const Stack = createNativeStackNavigator();
function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInForm} />
      <Stack.Screen name="SignUp" component={SignupForm} />
    </Stack.Navigator>
  );
}
export default function TabOneScreen() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Tab One</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </View>
      <RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
