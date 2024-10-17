import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for information icon

import Background from "../components/Background";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppContext } from "../AppContext"; // Import AppContext
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

const AccountScreen = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const handleInfoPress = (text) => {
    setInfoText(text);
    setShowInfoModal(true);
  };

  // Access profileData and setProfileData from context
  const { profileData, setProfileData } = useContext(AppContext);
  const [infoText, setInfoText] = useState(""); // To display different info text
  const [showInfoModal, setShowInfoModal] = useState(false); // For information modal visibility

  // Local state for modals and other temporary data
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showHomeTypeModal, setShowHomeTypeModal] = useState(false);
  const [showOccupantsModal, setShowOccupantsModal] = useState(false);
  const [showEnergySourceModal, setShowEnergySourceModal] = useState(false);
  const [showRoomNamesModal, setShowRoomNamesModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [currentArea, setCurrentArea] = useState("");

  // Options for dropdowns and devices
  const roomsOptions = ["1", "2", "3", "4", "5+"];

  const occupantsOptions = [
    "23",
    "33",
    "27",
    "45",
    "28",
    "30",
    "Press Info to get Prices for each state",
  ];

  const deviceOptions = {
    kitchen: [
      "Refrigerator",
      "Dishwasher",
      "Microwave",
      "Oven",
      "Coffee Maker",
      "Toaster",
    ],
    laundry: ["Washing Machine", "Dryer", "Iron", "Steam Press"],
    garage: [
      "Car Battery Charger",
      "Electric Vehicle Charger",
      "Power Tools",
      "Freezer",
    ],
    livingroom: ["TV", "Gaming Console", "Sound System", "Air Conditioner"],
    BedRoom: ["Lights", "Television", "Ceiling Fan", "Computer"],
  };

  const roomIcons = {
    kitchen: "restaurant",
    laundry: "local-laundry-service",
    garage: "garage",
    livingroom: "weekend",
    BedRoom: "home",
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("profileData", JSON.stringify(profileData));
      // Alert.alert("Success", "Your profile data has been saved.");
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "There was an error saving your data.");
    }
  };

  const handleBackPress = () => {
    saveData();
    navigation.navigate("FlowerPot");
  };

  const renderDropdown = (options, handleSelection, setShowModal) => {
    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => handleSelection(item)}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const renderDevicesModal = () => {
    return (
      <Modal
        visible={showDevicesModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDevicesModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDevicesModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{`Select ${
                  currentArea.charAt(0).toUpperCase() + currentArea.slice(1)
                } Devices`}</Text>
                <FlatList
                  data={deviceOptions[currentArea]}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <View style={styles.deviceItem}>
                      <Text style={styles.modalItemText}>{item}</Text>
                      <Switch
                        value={profileData.devices[currentArea]?.includes(item)}
                        onValueChange={(value) =>
                          toggleDevice(item, value, currentArea)
                        }
                      />
                    </View>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => setShowDevicesModal(false)}
                >
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const toggleDevice = (device, isSelected, area) => {
    setProfileData((prevData) => {
      const updatedDevices = { ...prevData.devices };
      if (isSelected) {
        updatedDevices[area] = [...(updatedDevices[area] || []), device];
      } else {
        updatedDevices[area] = updatedDevices[area]?.filter(
          (d) => d !== device
        );
      }
      return { ...prevData, devices: updatedDevices };
    });
  };

  const handleRoomNameChange = (index, name) => {
    setProfileData((prevData) => {
      const newRoomNames = [...prevData.roomNames];
      newRoomNames[index] = name;
      return { ...prevData, roomNames: newRoomNames };
    });
  };

  const handleSaveRoomNames = () => {
    console.log("Saved room names:", profileData.roomNames);
    setShowRoomNamesModal(false);
  };

  const handleRoomSelection = (selectedRoom) => {
    setProfileData((prevData) => ({
      ...prevData,
      rooms: selectedRoom,
      roomNames: Array.from({ length: parseInt(selectedRoom) }, () => ""),
    }));
    setShowRoomsModal(false);
    setShowRoomNamesModal(true);
  };

  const handleHomeTypeSelection = (selectedHomeType) => {
    setProfileData((prevData) => ({
      ...prevData,
      homeType: selectedHomeType,
    }));
    setShowHomeTypeModal(false);
  };

  const handleOccupantsSelection = (selectedOccupants) => {
    setProfileData((prevData) => ({
      ...prevData,
      occupants: selectedOccupants,
    }));
    setShowOccupantsModal(false);
  };

  const handleEnergySourceSelection = (selectedEnergySource) => {
    setProfileData((prevData) => ({
      ...prevData,
      energySource: selectedEnergySource,
    }));
    setShowEnergySourceModal(false);
  };
  const powerPrices = [
    { state: "ACT", price: "23.67c/kWh" },
    { state: "NSW", price: "33.84c/kWh" },
    { state: "Northern Territory", price: "27.37c/kWh" },
    { state: "QLD", price: "30.21c/kWh" },
    { state: "SA", price: "45.54c/kWh" },
    { state: "Tasmania", price: "28.12c/kWh" },
    { state: "Victoria", price: "28.45c/kWh" },
    { state: "Western Australia", price: "30.06c/kWh" },
  ];
  console.log(powerPrices);

  return (
    <Background style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile Management</Text>
          <Text style={styles.subtitle}>
            Help us understand your home better!
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Enter Energy price</Text>
            <TouchableOpacity onPress={() => handleInfoPress(powerPrices)}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowRoomsModal(true)}
          >
            <Icon name="home" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.pickerText}>
              {profileData.rooms ? profileData.rooms : "Select Rooms"}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowOccupantsModal(true)}
          >
            <Icon
              name="monetization-on"
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.pickerText}>
              {profileData.occupants ? profileData.occupants : "Select State"}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Setup Devices</Text>
            <TouchableOpacity
              onPress={() =>
                handleInfoPress([
                  "Here you can select rooms and assign devices that are present in those rooms.",
                  "Each room has a specific set of devices to choose from.",
                  "Select the devices you want to monitor for energy usage in each room.",
                  "For example, in the living room, you can select devices like TV, sound system, or air conditioner.",
                  "In the kitchen, you can monitor devices like the refrigerator, oven, and coffee maker.",
                ])
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {["BedRoom", "livingroom", "kitchen", "laundry", "garage"].map(
            (area) => (
              <TouchableOpacity
                key={area}
                style={styles.inputContainer}
                onPress={() => {
                  setCurrentArea(area);
                  setShowDevicesModal(true);
                }}
              >
                <Icon
                  name={roomIcons[area]}
                  size={30}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.pickerText}>
                  {profileData.devices[area]?.length > 0
                    ? `${area.charAt(0).toUpperCase() + area.slice(1)} (${
                        profileData.devices[area].length
                      } devices)`
                    : `${area.charAt(0).toUpperCase() + area.slice(1)}`}
                </Text>
                <Icon name="keyboard-arrow-right" size={24} color="#fff" />
              </TouchableOpacity>
            )
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              scrollViewRef.current.scrollTo({ y: 0, animated: true });
              handleBackPress();
            }}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals moved outside the ScrollView */}
      {showRoomsModal &&
        renderDropdown(roomsOptions, handleRoomSelection, setShowRoomsModal)}
      {showHomeTypeModal &&
        renderDropdown(
          homeTypeOptions,
          handleHomeTypeSelection,
          setShowHomeTypeModal
        )}
      {showOccupantsModal &&
        renderDropdown(
          occupantsOptions,
          handleOccupantsSelection,
          setShowOccupantsModal
        )}
      {showEnergySourceModal &&
        renderDropdown(
          energySourceOptions,
          handleEnergySourceSelection,
          setShowEnergySourceModal
        )}
      {showDevicesModal && renderDevicesModal()}

      {showRoomNamesModal && (
        <Modal
          visible={showRoomNamesModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRoomNamesModal(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setShowRoomNamesModal(false)}
          >
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Name Your Rooms</Text>
                  {profileData.roomNames.map((roomName, index) => (
                    <TextInput
                      key={index}
                      style={styles.roomInput}
                      placeholder={`Room ${index + 1} Name`}
                      placeholderTextColor="#ccc"
                      value={roomName}
                      onChangeText={(text) => handleRoomNameChange(index, text)}
                    />
                  ))}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveRoomNames}
                    >
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowRoomNamesModal(false)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowInfoModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Information</Text>
                {Array.isArray(infoText) && infoText[0]?.state ? (
                  infoText.map((item, index) => (
                    <View key={index} style={styles.priceRow}>
                      <Text style={styles.stateText}>{item.state}</Text>
                      <Text style={styles.priceText}>{item.price}</Text>
                    </View>
                  ))
                ) : Array.isArray(infoText) ? (
                  infoText.map((point, index) => (
                    <View key={index} style={styles.bulletText}>
                      <Text style={styles.bulletText}>• {point}</Text>
                    </View>
                  ))
                ) : (
                  <Text>No data available</Text>
                )}
                <TouchableOpacity
                  style={styles.buttonCloseText}
                  onPress={() => setShowInfoModal(false)}
                >
                  <Text style={styles.buttonCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    marginLeft: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
  formSection: {},
  sectionTitle: {
    fontSize: 20,
    marginLeft: "10%",
    width: "80%",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bulletPointContainer: {
    flexDirection: "row", // To align the bullet and text in one line
    marginBottom: 5, // Space between each point
  },
  bulletPoint: {
    fontSize: 20, // Bullet size
    marginRight: 10, // Space between bullet and text
    color: "#fff", // Bullet color
  },
  bulletText: {
    fontSize: 14, // Text size
    color: "#fff", // Text color
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    height: 60,
  },
  icon: {
    marginRight: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "right",
    justifyContent: "right", // Ensure the icon is close to the text
    marginBottom: 10,
  },
  pickerText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    marginTop: 0,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: height * 0.7,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    color: "#fff",
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 30,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 30,
    marginLeft: 10,
  },
  roomInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  stateText: {
    fontSize: 16,
    color: "white",
  },
  priceText: {
    fontSize: 16,
    color: "white",
  },
  bulletText: {
    fontSize: 16,
    marginVertical: 5,
    color: "white",
  },
  buttonCloseText: {
    fontSize: 18,
    color: "pink",
    textAlign: "left",
    marginLeft: 113,
    marginTop: 5,
  },
});

export default AccountScreen;
