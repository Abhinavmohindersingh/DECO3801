// AppContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
export const AppContext = createContext();

// Define the provider component
export const AppProvider = ({ children }) => {
  // Energy Consumption States
  const [totalConsumptionKitchen, setTotalConsumptionKitchen] = useState(0);
  const [totalConsumptionLiving, setTotalConsumptionLiving] = useState(0);
  const [totalConsumptionLaundry, setTotalConsumptionLaundry] = useState(0);
  const [totalConsumptionGarage, setTotalConsumptionGarage] = useState(0);
  const [kitchenRunningDevices, setKitchenRunningDevices] = useState({});

  // Profile Data State
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

  // Consumption History State
  const [consumptionHistory, setConsumptionHistory] = useState([]);

  // Loading State
  const [loading, setLoading] = useState(true);

  // Keys for AsyncStorage
  const PROFILE_DATA_KEY = "@profileData";
  const CONSUMPTION_HISTORY_KEY = "@consumptionHistory";
  const CONSUMPTION_KITCHEN_KEY = "@consumptionKitchen"; // Define this key
  const [initialDataSent, setInitialDataSent] = useState(false); // Add this flag

  // References to manage intervals
  const sumReadings = useRef(0); // Cumulative sum of readings
  const countReadings = useRef(0); // Count of readings
  const intervalRef = useRef(null); // Reference to the 1-second interval
  const hourlyIntervalRef = useRef(null); // Reference to the 1-hour interval

  // Reference to hold the latest totalConsumption to avoid stale closures
  const totalConsumptionRef = useRef(0);

  // Update the ref whenever any totalConsumption changes
  useEffect(() => {
    totalConsumptionRef.current =
      totalConsumptionKitchen +
      totalConsumptionLiving +
      totalConsumptionLaundry +
      totalConsumptionGarage;
  }, [
    totalConsumptionKitchen,
    totalConsumptionLiving,
    totalConsumptionLaundry,
    totalConsumptionGarage,
  ]);

  /**
   * Data Persistence Functions
   */

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
      return null;
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

  // Function to trigger periodic server communication
  useEffect(() => {
    // Set an interval to send data to the server every 10 seconds (adjust as needed)
    const serverCommInterval = setInterval(() => {
      const averageConsumption = (
        sumReadings.current / (countReadings.current || 1)
      ).toFixed(2);
      const currentReading = totalConsumptionRef.current + 1.5;

      sendTotalConsumptionToServer(currentReading); // Passing the average parameter
    }, 1000); // Every 10 seconds

    return () => clearInterval(serverCommInterval); // Clear interval on unmount
  }, []);

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

      setLoading(false); // Data loading complete
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

  useEffect(() => {
    // Prepare the hardcoded data to send
    const dataToSend = {
      Oven: false,
      Dishwasher: false,
      Lamp: false,
      Gaming: false,
      Battery: false,
      Tools: false,
      Washing: false,
      Dryer: false,
    };

    // Send the data to the server only once
    const sendInitialData = async () => {
      if (!initialDataSent) {
        console.log("Sending initial hardcoded data:", dataToSend); // Log before sending data
        try {
          const response = await fetch("http://34.87.202.191:4000/multi", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend), // Send the hardcoded data
          });

          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }

          const data = await response.json();
          console.log("Initial hardcoded data sent successfully:", dataToSend); // Log success
          console.log("Server response:", data);

          setInitialDataSent(true); // Mark as sent to prevent resending
        } catch (error) {
          console.error("Error sending initial hardcoded data:", error);
        }
      } else {
        console.log("Initial data has already been sent, skipping...");
      }
    };

    sendInitialData(); // Send the hardcoded data on app initialization
  }, [initialDataSent]);

  /**
   * Data Capturing Logic
   */

  // Function to start data capturing every second
  const startDataCapture = () => {
    if (intervalRef.current) return; // Prevent multiple intervals

    intervalRef.current = setInterval(() => {
      const currentReading = totalConsumptionRef.current + 1.5;
      sumReadings.current += currentReading;
      countReadings.current += 1;

      // Log the current totalConsumption every second
      console.log(`Current Total Consumption: ${currentReading} kWh/hr`);
      // sendTotalConsumptionToServer(average);
    }, 1000);
  };

  // Start data capture when data is loaded
  useEffect(() => {
    if (!loading) {
      startDataCapture();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loading]);

  // Function to calculate hourly average
  const calculateHourlyAverage = () => {
    if (countReadings.current === 0) return;

    const average = parseFloat(
      (sumReadings.current / countReadings.current).toFixed(2)
    );

    // Log the hourly average
    console.log(`Hourly Average Consumption: ${average} kWh/hr`);

    // Update consumptionHistory with the average
    setConsumptionHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, average];
      // Keep only the last 14 hours
      if (updatedHistory.length > 14) {
        updatedHistory.shift();
      }
      return updatedHistory;
    });

    // Optionally, send the average to the server
    // sendTotalConsumptionToServer(average);

    // Reset the sum and count
    sumReadings.current = 0;
    countReadings.current = 0;
  };

  // Setup hourly interval
  useEffect(() => {
    const hourlyInterval = setInterval(() => {
      calculateHourlyAverage();
    }, 3600000); // Every hour (3600000 ms)

    return () => clearInterval(hourlyInterval); // Cleanup on unmount
  }, []);

  /**
   * Server Communication
   */

  // Function to send total consumption to the server
  const sendTotalConsumptionToServer = async (average) => {
    try {
      if (average === undefined || isNaN(average)) {
        console.error("Invalid average value:", average);
        return; // Exit the function if average is invalid
      }

      // Get current time in 24-hour format: HH:mm:ss
      const currentTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      // Prepare the data to be sent
      const dataToSend = {
        current_time: currentTime, // current timestamp in 24-hour format
        Global_active_power: average, // average consumption value
      };

      console.log("Dsendingnow", dataToSend);

      console.log("Data being sent to the server:", dataToSend);

      // Send the data to the server
      const response = await fetch("http://34.87.202.191:4000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the JSON data
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      // Get and log the server's response
      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  /**
   * Cleanup Intervals on Unmount
   */
  useEffect(() => {
    return () => {
      // Clear the 1-second interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Clear the 1-hour interval
      if (hourlyIntervalRef.current) {
        clearInterval(hourlyIntervalRef.current);
      }
    };
  }, []);

  /**
   * Context Provider
   */
  return (
    <AppContext.Provider
      value={{
        // Profile Data
        profileData,
        setProfileData,

        // Energy Consumption States
        totalConsumptionKitchen,
        setTotalConsumptionKitchen,
        totalConsumptionLiving,
        setTotalConsumptionLiving,
        totalConsumptionLaundry,
        setTotalConsumptionLaundry,
        totalConsumptionGarage,
        setTotalConsumptionGarage,

        // Consumption History
        consumptionHistory,
        setConsumptionHistory,
        saveConsumptionHistory,
        loadConsumptionHistory,
        initialDataSent, // Pass it to the context
        setInitialDataSent, // Function to update the flag

        // Loading State
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
