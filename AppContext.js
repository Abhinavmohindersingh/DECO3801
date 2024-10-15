// AppContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
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

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await AsyncStorage.getItem("profileData");
        if (data !== null) {
          setProfileData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  useEffect(() => {
    const saveProfileData = async () => {
      try {
        await AsyncStorage.setItem("profileData", JSON.stringify(profileData));
      } catch (error) {
        console.error("Error saving profile data:", error);
      }
    };

    saveProfileData();
  }, [profileData]);

  return (
    <AppContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </AppContext.Provider>
  );
};
