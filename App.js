// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EnergyUsage from "./screens/EnergyUsage"; // Update path as needed
import SettingsScreen from "./screens/SettingsScreen"; // Create this screen
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AccountScreen from "./screens/AccountScreen";

import EditScreen from "./screens/EditScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import FlowerPot from "./screens/FlowerPot";
import FirstScreen from "./screens/FirstScreen";
import SpendingScreen from "./screens/SpendingScreen";
import InfoScreen from "./screens/InfoScreen";
import LiveUsage from "./screens/LiveUsage";
import KitchenUsage from "./screens/KitchenUsage";
import LivingUsage from "./screens/LivingUsage";
import LaundryUsage from "./screens/LaundryUsage";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} /> */}
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="FlowerPot" component={FlowerPot} />
        <Stack.Screen name="LivingUsage" component={LivingUsage} />
        <Stack.Screen name="LaundryUsage" component={LaundryUsage} />

        <Stack.Screen name="LiveUsage" component={LiveUsage} />
        <Stack.Screen name="KitchenUsage" component={KitchenUsage} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EnergyUsage" component={EnergyUsage} />
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="SpendingScreen" component={SpendingScreen} />
        <Stack.Screen name="InfoScreen" component={InfoScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
