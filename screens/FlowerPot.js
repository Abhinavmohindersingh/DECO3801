import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Canvas } from "@react-three/fiber";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Model } from "../components/Model";
import { SkeletonHelper } from "three";

const menuOptions = [
  { name: "Energy Usage", iconName: "chart-line", href: "EnergyUsage" },
  { name: "Spendings", iconName: "currency-usd", href: "SpendingScreen" },
  {
    name: "Estimated Bill",
    iconName: "trending-up",
    href: "EstimatedBillScreen",
  },
  {
    name: "Distr. Consumption",
    iconName: "chart-bar",
    href: "DistrConsumptionScreen",
  },
  { name: "Info", iconName: "information", href: "InfoScreen" },
  { name: "Settings", iconName: "cogs", href: "SettingsScreen" },
];

const FlowerPot = () => {
  const navigation = useNavigation(); // Initialize navigation
  const route = useRoute(); // Get the route to access parameters
  const [numColumns, setNumColumns] = useState(2); // Default to 2 columns
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [devices, setDevices] = useState([
    { name: "Light", status: "On" },
    { name: "Fan", status: "Off" },
    // Add more devices as needed
  ]);
  const [roomFlag, setRoomFlag] = useState(false);

  // Set default values
  const [rooms, setRooms] = useState("1");
  const [roomNames, setRoomNames] = useState(["Main Room"]);

  // Update values when new data is received
  useFocusEffect(
    useCallback(() => {
      console.log("useFocusEffect triggered");
      try {
        const { rooms, roomNames } = route.params || {};
        setRooms(rooms);
        setRoomNames(roomNames);
        console.log("Rooms received:", rooms);
        console.log("Room Names received:", roomNames);
      } catch (error) {
        console.log("Error receiving params, setting default values");
        setRooms("Default Room");
        setRoomNames(["Default Room Name"]);
      }
    }, [route.params])
  );

  const handleMenuItemClick = (href) => {
    // Navigate to the desired screen
    navigation.navigate(href);
  };

  const handleRoomIconClick = (room) => {
    // Set the selected room and show the modal
    setSelectedRoom(room);
    setModalVisible(true);
  };

  const handleRoomNameClick = (roomName) => {
    // Set the selected room name and show the modal
    setModalVisible(false);
    setTimeout(() => {
      setSelectedRoom(roomName);
      setModalVisible(true);
      setRoomFlag(true);
    }, 100);
  };

  const closeModal = () => {
    setModalVisible(false);
    if (roomFlag == true) {
      setTimeout(() => {
        setSelectedRoom("Rooms");
        setModalVisible(true);
        setRoomFlag(false);
      }, 100);
    }
  };

  const renderMenuOption = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleMenuItemClick(item.href)}
    >
      <MaterialCommunityIcons name={item.iconName} size={30} color="#fff" />
      <Text style={styles.menuLabel}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../icons/background.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={styles.iconContainer}>
              <Icon name="flash-outline" size={50} color="#fff" />
            </View>
            <Text style={{ color: "white", fontSize: 30 }}>: 8kWh</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("AccountScreen")}
          >
            <FontAwesome name="user-circle" size={50} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.canvasContainer}>
          <Canvas
            style={{
              width: "100%",
              height: 0,
            }}
            shadows
            gl={{ alpha: true }}
          >
            <color attach="red" args={["white"]} />
            <ambientLight intensity={0} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Environment preset="city" />
            <PerspectiveCamera makeDefault position={[0, 7, 7]} />
            <OrbitControls />
            <Model position={[0, -1, 0]} />
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.5}
              width={10}
              height={10}
              blur={1}
              far={2}
            />
          </Canvas>
        </View>

        <View style={styles.roomIconsContainer}>
          <View style={styles.roomIcons}>
            <View style={styles.iconWrapper}>
              <TouchableOpacity onPress={() => handleRoomIconClick("Rooms")}>
                <Icon name="bed-outline" size={40} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>Rooms</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity onPress={() => handleRoomIconClick("Kitchen")}>
                <Icon name="restaurant-outline" size={40} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>Kitchen</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => handleRoomIconClick("LivingRoom")}
              >
                <MaterialCommunityIcons
                  name="sofa-outline"
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>Living Room</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity onPress={() => handleRoomIconClick("Laundry")}>
                <MaterialCommunityIcons
                  name="washing-machine"
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>Laundry</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <FlatList
            data={menuOptions}
            showsVerticalScrollIndicator={false}
            renderItem={renderMenuOption}
            keyExtractor={(item) => item.name}
            numColumns={numColumns} // Use the numColumns state
            ListHeaderComponent={<Text style={styles.menuTitle}></Text>}
            key={numColumns} // Provide a unique key based on numColumns
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <Text style={styles.popupSectionTitle}>
                    Devices in {selectedRoom}
                  </Text>
                  {selectedRoom === "Rooms" ? (
                    <View>
                      {roomNames.map((roomName, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleRoomNameClick(roomName)}
                          style={styles.deviceContainer}
                        >
                          <Text style={styles.deviceText}>{roomName}</Text>
                          <Text style={styles.deviceStatus}>
                            {index + 1 * 2 + 1} devices
                          </Text>
                        </TouchableOpacity>
                      ))}
                      <Text style={styles.deviceStatus}>
                        Click the room to see device details.
                      </Text>
                    </View>
                  ) : (
                    devices.map((device, index) => (
                      <View key={index} style={styles.deviceContainer}>
                        <Text style={styles.deviceText}>{device.name}</Text>
                        <Text style={styles.deviceStatus}>{device.status}</Text>
                      </View>
                    ))
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  energy: {
    height: 20,
    weight: 10,
    color: "white",
  },
  header: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    zIndex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
  },
  canvasContainer: {
    flex: 1,

    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "70%",
    bottom: 0,
    zIndex: 0,
    marginTop: 0,
    overflow: "hidden",
  },
  roomIcons: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
    top: 400,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    zIndex: 2,
    backgroundColor: "rgba(119, 119, 119, 0.7)", // 0.7 is the transparency factor
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  iconWrapper: {
    alignItems: "center",
  },
  iconLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  menuContainer: {
    position: "absolute",
    top: 490,
    left: 20,
    right: 20,
    zIndex: 3,
  },
  menuTitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  menuItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(119, 119, 119, 0.7)", // 0.7 is the transparency factor
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  menuLabel: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  popupSectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deviceContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deviceText: {
    fontSize: 16,
    color: "#333",
  },
  deviceStatus: {
    fontSize: 14,
    color: "#666",
  },
});

export default FlowerPot;
