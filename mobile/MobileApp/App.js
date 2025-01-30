import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import TicketBenefits from './screens/TicketBenefits';
import PricingTable from './screens/PricingTable';
import TicketSection from './screens/TicketSection';
import MyTicketContent from "./screens/MyTicketContent";
import DriverScanner from "./screens/DriverScanner";
import GoogleMaps from "./screens/GoogleMap";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* SignUp Screen */}
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />

        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Ticket Benefits Screen */}
        <Stack.Screen
          name="TicketBenefits"
          component={TicketBenefits}
          options={{ title: 'Ticket Benefits' }}
        />

        {/* Pricing Table Screen */}
        <Stack.Screen
          name="PricingTable"
          component={PricingTable}
          options={{ title: 'Pricing Table' }}
        />

        {/* Ticket Section Screen */}
        <Stack.Screen
          name="TicketSection"
          component={TicketSection}
          options={{ title: 'Ticket Details' }}
        />

        {/* My Ticket Content Screen */}
        <Stack.Screen
          name="MyTicketContent"
          component={MyTicketContent}
          options={{ title: 'My Tickets' }}
        />

        {/* Driver Scanner Screen */}
        <Stack.Screen
          name="DriverScanner"
          component={DriverScanner}
          options={{ title: "Driver Scanner" }}
        />

        {/* Map Tracking Screen */}
        <Stack.Screen
          name="MapTracking"
          component={GoogleMaps} // Add the GoogleMaps component as a new screen
          options={{ title: 'Bus Tracking' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}