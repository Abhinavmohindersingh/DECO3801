// RoomsUsage.js
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { AppContext } from "../AppContext"; // Adjust the path as needed
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const RoomsUsage = () => {
  const navigation = useNavigation();
  const { profileData } = useContext(AppContext);

  // Check if profileData is available
  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Get the list of rooms from profileData
  const rooms = profileData.rooms || [];

  // Mapping of room names to icons
  const roomIcons = {
    Kitchen: "silverware-fork-knife",
    "Living Room": "sofa",
    Bedroom: "bed",
    Laundry: "washing-machine",
    Garage: "garage",
    // Add other rooms and their icons
  };

  // Mapping of room names to their corresponding screens
  const roomScreens = {
    Kitchen: "KitchenUsage",
    "Living Room": "LivingUsage",
    Bedroom: "BedroomUsage",
    Laundry: "LaundryUsage",
    Garage: "GarageUsage",
    // Add other rooms and their corresponding screen names
  };

  // Render item for FlatList
  const renderItem = ({ item }) => {
    const iconName = roomIcons[item] || "home-outline";
    return (
      <TouchableOpacity
        style={styles.roomCard}
        onPress={() => {
          const screenName = roomScreens[item];
          if (screenName) {
            navigation.navigate(screenName);
          } else {
            alert(`No screen found for ${item}`);
          }
        }}
      >
        <Icon name={iconName} size={50} color="#fff" />
        <Text style={styles.roomName}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../icons/background.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Room Usage</Text>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            numColumns={2}
            contentContainerStyle={styles.roomsList}
          />
        ) : (
          <Text style={styles.noRoomsText}>
            No rooms added. Please add rooms in your profile.
          </Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    marginTop: 50,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  roomsList: {
    justifyContent: "center",
  },
  roomCard: {
    width: Dimensions.get("window").width / 2 - 20,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  noRoomsText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default RoomsUsage;
