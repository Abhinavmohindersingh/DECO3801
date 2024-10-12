// ProfileScreen.js
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
import Background from "../components/Background";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppContext } from "../AppContext"; // Import AppContext
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const scrollViewRef = useRef(null);

  // Access profileData and setProfileData from context
  const { profileData, setProfileData } = useContext(AppContext);

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
  const homeTypeOptions = [
    "Apartment",
    "Single-family home",
    "Townhouse",
    "Condo",
    "Other",
  ];
  const occupantsOptions = ["1", "2", "3", "4", "5+"];
  const energySourceOptions = ["Electricity", "Natural Gas", "Solar"];

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
    garage: ["Electric Car Charger", "Power Tools", "Garage Door Opener"],
    livingroom: ["TV", "Gaming Console", "Sound System", "Air Conditioner"],
    general: ["Lights", "Smart Thermostat", "Security System", "Wi-Fi Router"],
  };

  const roomIcons = {
    kitchen: "restaurant",
    laundry: "local-laundry-service",
    garage: "garage",
    livingroom: "weekend",
    general: "home",
  };

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const data = await AsyncStorage.getItem("profileData");
      if (data !== null) {
        setProfileData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("profileData", JSON.stringify(profileData));
      Alert.alert("Success", "Your profile data has been saved.");
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
          <Text style={styles.sectionTitle}>Household Details</Text>
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
            <Icon name="person" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.pickerText}>
              {profileData.occupants
                ? profileData.occupants
                : "Select Occupants"}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Setup Rooms and Devices</Text>
          {["general", "livingroom", "kitchen", "laundry", "garage"].map(
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
            <Text style={styles.buttonText}>Save and Back</Text>
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
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
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
  pickerText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
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
});

export default ProfileScreen;
