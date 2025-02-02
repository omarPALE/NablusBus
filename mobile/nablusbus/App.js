import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import MyTicketsScreen from "./screens/MyTicketsScreen";
import DriverScreen from "./screens/DriverScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [userState, setUserState] = useState({
    loggedIn: false,
    email: "",
    username: "User",
    userID: 0,
    role: "passenger",
    work_id: 1,
  });

  const handleLogout = () => {
    setUserState({
      loggedIn: false,
      email: "",
      username: "",
      userID: 0,
      role: "passenger",
      work_id: 1,
    });
  };

  const ProfileMenu = () => (
    <View
      style={{
        position: "absolute",
        top: 80,
        right: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        elevation: 5,
      }}
    >
      <Text>{userState.username}</Text>
      <Text>{userState.role}</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={{ color: "red" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="SignIn">
        {(props) => <SignInScreen {...props} setUserState={setUserState} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => <SignUpScreen {...props} setUserState={setUserState} />}
      </Stack.Screen>
    </Stack.Navigator>
  );

  const MainTabs = () => {
    const [showProfile, setShowProfile] = useState(false);

    return (
      <>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            // Define the tabBarIcon for each route
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              // Choose an icon based on the route name
              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Subscription") {
                iconName = focused ? "albums" : "albums-outline";
              } else if (route.name === "My Tickets") {
                iconName = focused ? "ticket" : "ticket-outline";
              } else if (route.name === "Scanner") {
                iconName = focused ? "scan" : "scan-outline";
              }

              // Return the icon component
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            // Optional: Customize active/inactive colors
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Subscription" component={SubscriptionScreen} />
          {userState.loggedIn && (
            <Tab.Screen name="My Tickets">
              {(props) => (
                <MyTicketsScreen
                  {...props}
                  setUserState={setUserState}
                  userState={userState}
                />
              )}
            </Tab.Screen>
          )}
          <Tab.Screen name="Scanner" component={DriverScreen} />
        </Tab.Navigator>
        <TouchableOpacity
          style={{ position: "absolute", top: 10, right: 10 }}
          onPress={() => setShowProfile(!showProfile)}
        >
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
        {showProfile && <ProfileMenu />}
      </>
    );
  };

  return (
    <NavigationContainer>
      {userState.loggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
