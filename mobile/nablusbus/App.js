import React, { useState, createContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { getSocket } from "./service/socketService"; // WebSocket singleton
import HomeScreen from "./screens/HomeScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import MyTicketsScreen from "./screens/MyTicketsScreen";
import DriverScreen from "./screens/DriverScreen";
// import TrackingScreen from "./screens/TrackingScreen";
// import DashboardScreen from "./screens/DashboardScreen";
// import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
// export const SocketContext = createContext();

export default function App() {
  const [userState, setUserState] = useState({
    loggedIn: false,
    email: "",
    username: "",
    userID: 0,
    role: "passenger",
    work_id: 1,
  });
  const [startWorking, setStartWorking] = useState(false);
  // const socket = getSocket();

  // useEffect(() => {
  //   socket.on("bus-location", (data) => {
  //     console.log("Bus Location Update:", data);
  //   });
  //   return () => {
  //     socket.off("bus-location");
  //   };
  // }, []);

  const MainStack = () => (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SignIn">
        {(props) => <SignInScreen {...props} setUserState={setUserState} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => <SignUpScreen {...props} setUserState={setUserState} />}
      </Stack.Screen>
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      {userState.loggedIn && (
        <Stack.Screen name="MyTicketsScreen">
          {(props) => (
            <MyTicketsScreen
              {...props}
              setUserState={setUserState}
              userState={userState}
            />
          )}
        </Stack.Screen>
      )}

      <Stack.Screen name="Scanner" component={DriverScreen} />
      {/* <Stack.Screen name="Tracking" component={TrackingScreen} /> */}
      {/* <Stack.Screen name="Dashboard">
        {(props) => (
          <DashboardScreen
            {...props}
            start={startWorking}
            setStart={setStartWorking}
          />
        )}
      </Stack.Screen> */}
    </Stack.Navigator>
  );

  return (
    // <SocketContext.Provider value={socket}>
    <NavigationContainer>
      {/* {userState.role === "administrator" ? ( */}
      {/* <AdminDashboardScreen /> */}
      {/* ) :  */}
      (
      <MainStack />){/* } */}
    </NavigationContainer>
    // </SocketContext.Provider>
  );
}
