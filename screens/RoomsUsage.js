import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { AppContext } from "../AppContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const RoomsUsage = () => {
  const navigation = useNavigation();
  const { profileData } = useContext(AppContext);

  if (!profileData || !profileData.roomNames) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const rooms = profileData.roomNames.filter((room) => room !== "");

  // Example: Assume energy usage for each room is available in profileData.energyUsage
  const energyUsage = profileData.energyUsage || {}; // Object with room names as keys and energy usage values in kWh

  const roomIcons = {
    Kitchen: "silverware-fork-knife",
    "Living Room": "sofa",
    Bedroom: "bed",
    Bathroom: "shower",
    Office: "desktop-classic",
    Laundry: "washing-machine",
    Garage: "garage",
    Default: "home-outline",
  };

  const renderItem = ({ item }) => {
    const iconName = roomIcons[item] || roomIcons.Default;
    const usage = energyUsage[item] || 0; // Default to 0 if no usage data

    return (
      <TouchableOpacity
        style={styles.roomCard}
        onPress={() =>
          navigation.navigate("RoomDetailsScreen", { roomName: item })
        }
      >
        <View style={styles.roomInfo}>
          <Icon name={iconName} size={50} color="#fff" />
          <Text style={styles.roomName}>{item}</Text>
        </View>
        <View style={styles.energyInfo}>
          <Icon name="lightning-bolt-outline" size={30} color="#fff" />
          <Text style={styles.energyText}>{`${usage} kWh`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../icons/background.jpeg")}
      style={styles.background}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("FlowerPot")}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Room Usage</Text>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={renderItem}
            keyExtractor={(item) => item}
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
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  roomsList: {
    justifyContent: "center",
  },
  roomCard: {
    width: "100%", // Full width
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
    justifyContent: "space-between",
    flexDirection: "row", // Align room info and energy info horizontally
    alignItems: "center",
  },
  roomInfo: {
    flexDirection: "row", // Room icon and name are stacked vertically
    alignItems: "center",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
  },
  energyInfo: {
    flexDirection: "row", // Lightning icon and energy text side by side
    alignItems: "center",
  },
  energyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent for better visibility
    padding: 10,
    borderRadius: 20,
    width: 50,
    zIndex: 1,
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default RoomsUsage;
