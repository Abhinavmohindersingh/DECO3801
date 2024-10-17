// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PredictViz from "./screens/PredictViz"; // Update path as needed
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
import RoomsUsage from "./screens/RoomsUsage";
import { AppProvider } from "./AppContext";
import RoomDetailsScreen from "./screens/RoomDetailsScreen";
import EnergyLimit from "./screens/EnergyLimit";
import FlowerOne from "./screens/FlowerOne";
import GarageUsage from "./screens/GarageUsage";
import ElecSpendingScreen from "./screens/ElecSpendingScreen";
import EnergyLimitSetup from "./screens/EnergyLimitSetup";
const Stack = createStackNavigator();

const App = () => {
  return (
    // Wrap your app with AppProvider
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="FlowerOne" component={FlowerOne} /> */}
          {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}

          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="FlowerPot" component={FlowerPot} />
          <Stack.Screen name="EnergyLimitSetup" component={EnergyLimitSetup} />

          <Stack.Screen name="AccountScreen" component={AccountScreen} />

          <Stack.Screen name="LivingUsage" component={LivingUsage} />
          <Stack.Screen name="RoomsUsage" component={RoomsUsage} />
          <Stack.Screen
            name="RoomDetailsScreen"
            component={RoomDetailsScreen}
          />
          <Stack.Screen name="GarageUsage" component={GarageUsage} />
          <Stack.Screen name="EnergyLimit" component={EnergyLimit} />
          <Stack.Screen
            name="ElecSpendingScreen"
            component={ElecSpendingScreen}
          />

          <Stack.Screen name="LaundryUsage" component={LaundryUsage} />
          <Stack.Screen name="LiveUsage" component={LiveUsage} />
          <Stack.Screen name="KitchenUsage" component={KitchenUsage} />
          <Stack.Screen name="PredictViz" component={PredictViz} />
          <Stack.Screen name="SpendingScreen" component={SpendingScreen} />
          <Stack.Screen name="InfoScreen" component={InfoScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          {/* <Stack.Screen name="Edit" component={EditScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
