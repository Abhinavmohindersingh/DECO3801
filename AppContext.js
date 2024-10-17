// AppContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
export const AppContext = createContext();

// Define the provider component
export const AppProvider = ({ children }) => {
  // Existing state variables
  const [totalConsumptionKitchen, setTotalConsumptionKitchen] = useState(0);
  const [totalConsumptionLiving, setTotalConsumptionLiving] = useState(0);
  const [totalConsumptionLaundry, setTotalConsumptionLaundry] = useState(0);
  const [totalConsumptionGarage, setTotalConsumptionGarage] = useState(0);

  const [profileData, setProfileData] = useState({
    rooms: "",
    occupants: "",
    roomNames: [],
    devices: {
      kitchen: [],
      laundry: [],
      garage: [],
      livingroom: [],
      general: [],
    },
  });

  // New state for consumption history
  const [consumptionHistory, setConsumptionHistory] = useState([]);

  // Keys for AsyncStorage
  const PROFILE_DATA_KEY = "@profileData";
  const CONSUMPTION_HISTORY_KEY = "@consumptionHistory";
  const BUDGET_DATA_KEY = "@budgetData";
  const ENERGY_LIMIT_KEY = "@energyLimit";
  const BILL_CYCLE_KEY = "@billCycle";

  // Save profile data to AsyncStorage
  const saveProfileData = async (data) => {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(PROFILE_DATA_KEY, jsonData);
    } catch (e) {
      console.error("Failed to save profile data.", e);
    }
  };

  // Load profile data from AsyncStorage
  const loadProfileData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem(PROFILE_DATA_KEY);
      return jsonData != null ? JSON.parse(jsonData) : null;
    } catch (e) {
      console.error("Failed to load profile data.", e);
    }
  };

  // Save consumption history to AsyncStorage
  const saveConsumptionHistory = async (history) => {
    try {
      const jsonValue = JSON.stringify(history);
      await AsyncStorage.setItem(CONSUMPTION_HISTORY_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save consumption history.", e);
    }
  };

  // Load consumption history from AsyncStorage
  const loadConsumptionHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(CONSUMPTION_HISTORY_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Failed to load consumption history.", e);
      return [];
    }
  };

  // Load data when the app starts
  useEffect(() => {
    const loadData = async () => {
      const savedProfileData = await loadProfileData();
      if (savedProfileData) {
        setProfileData(savedProfileData);
      }

      const savedConsumptionHistory = await loadConsumptionHistory();
      if (savedConsumptionHistory) {
        setConsumptionHistory(savedConsumptionHistory);
      }
    };

    loadData();
  }, []);

  // Save profile data whenever it changes
  useEffect(() => {
    saveProfileData(profileData);
  }, [profileData]);

  // Save consumption history whenever it changes
  useEffect(() => {
    saveConsumptionHistory(consumptionHistory);
  }, [consumptionHistory]);

  return (
    <AppContext.Provider
      value={{
        // Existing context values
        profileData,
        setProfileData,
        totalConsumptionKitchen,
        setTotalConsumptionKitchen,
        totalConsumptionLiving,
        setTotalConsumptionLiving,
        totalConsumptionLaundry,
        setTotalConsumptionLaundry,
        totalConsumptionGarage,
        setTotalConsumptionGarage,

        // New context values for consumption history
        consumptionHistory,
        setConsumptionHistory,
        saveConsumptionHistory,
        loadConsumptionHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
