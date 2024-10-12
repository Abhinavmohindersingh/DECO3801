import React, { useState, useEffect } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Background from "../components/Background";
import Icon from "react-native-vector-icons/MaterialIcons";

const SettingsScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState("");
  const [homeType, setHomeType] = useState("");
  const [occupants, setOccupants] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [roomNames, setRoomNames] = useState([]);
  const [devices, setDevices] = useState({
    kitchen: [],
    laundry: [],
    garage: [],
    livingroom: [],
  });

  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showHomeTypeModal, setShowHomeTypeModal] = useState(false);
  const [showOccupantsModal, setShowOccupantsModal] = useState(false);
  const [showEnergySourceModal, setShowEnergySourceModal] = useState(false);
  const [showRoomNamesModal, setShowRoomNamesModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [currentArea, setCurrentArea] = useState("");

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
  };

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedRooms = await AsyncStorage.getItem("rooms");
      const savedHomeType = await AsyncStorage.getItem("homeType");
      const savedOccupants = await AsyncStorage.getItem("occupants");
      const savedEnergySource = await AsyncStorage.getItem("energySource");
      const savedRoomNames = await AsyncStorage.getItem("roomNames");
      const savedDevices = await AsyncStorage.getItem("devices");

      if (savedRooms) setRooms(savedRooms);
      if (savedHomeType) setHomeType(savedHomeType);
      if (savedOccupants) setOccupants(savedOccupants);
      if (savedEnergySource) setEnergySource(savedEnergySource);
      if (savedRoomNames) setRoomNames(JSON.parse(savedRoomNames));
      if (savedDevices) setDevices(JSON.parse(savedDevices));
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("rooms", rooms);
      await AsyncStorage.setItem("homeType", homeType);
      await AsyncStorage.setItem("occupants", occupants);
      await AsyncStorage.setItem("energySource", energySource);
      await AsyncStorage.setItem("roomNames", JSON.stringify(roomNames));
      await AsyncStorage.setItem("devices", JSON.stringify(devices));
      Alert.alert("Success", "Your profile data has been saved.");
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "There was an error saving your data.");
    }
  };

  const handleBackPress = () => {
    saveData();
    navigation.goBack();
  };

  const renderDropdown = (options, setSelectedValue, setShowModal) => {
    return (
      <Modal visible={true} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedValue(item);
                    setShowModal(false);
                    if (options === roomsOptions) {
                      setRoomNames(
                        Array.from({ length: parseInt(item) }, (_, i) => "")
                      );
                      setShowRoomNamesModal(true);
                    }
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderDevicesModal = () => {
    return (
      <Modal
        visible={showDevicesModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={styles.modalTitle}
            >{`Select ${currentArea} Devices`}</Text>
            <FlatList
              data={deviceOptions[currentArea]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.deviceItem}>
                  <Text style={styles.modalItemText}>{item}</Text>
                  <Switch
                    value={devices[currentArea].includes(item)}
                    onValueChange={(value) => toggleDevice(item, value)}
                  />
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setShowDevicesModal(false)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const toggleDevice = (device, isSelected) => {
    setDevices((prevDevices) => {
      const updatedDevices = { ...prevDevices };
      if (isSelected) {
        updatedDevices[currentArea] = [...updatedDevices[currentArea], device];
      } else {
        updatedDevices[currentArea] = updatedDevices[currentArea].filter(
          (d) => d !== device
        );
      }
      return updatedDevices;
    });
  };

  const handleRoomNameChange = (index, name) => {
    const newRoomNames = [...roomNames];
    newRoomNames[index] = name;
    setRoomNames(newRoomNames);
  };

  const handleSaveRoomNames = () => {
    console.log("Saved room names:", roomNames);
    setShowRoomNamesModal(false);
  };

  return (
    <Background>
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollView}
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
              {rooms ? rooms : "Select Rooms"}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowHomeTypeModal(true)}
          >
            <Icon name="house" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.pickerText}>
              {homeType ? homeType : "Select Home Type"}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowOccupantsModal(true)}
          >
            <Icon name="person" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.pickerText}>
              {occupants ? occupants : "Select Occupants"}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Setup Rooms and Devices</Text>
          {["kitchen", "laundry", "garage", "livingroom"].map((area) => (
            <TouchableOpacity
              key={area}
              style={styles.inputContainer}
              onPress={() => {
                setCurrentArea(area);
                setShowDevicesModal(true);
              }}
            >
              <Icon name="devices" size={24} color="#fff" style={styles.icon} />
              <Text style={styles.pickerText}>
                {devices[area].length > 0
                  ? `${area.charAt(0).toUpperCase() + area.slice(1)} (${
                      devices[area].length
                    } devices)`
                  : `Setup ${area.charAt(0).toUpperCase() + area.slice(1)}`}
              </Text>
              <Icon name="keyboard-arrow-right" size={24} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Energy Source Information</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowEnergySourceModal(true)}
          >
            <Icon name="power" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.pickerText}>
              {energySource ? energySource : "Select Energy Source"}
            </Text>
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.buttonText}>Save and Back</Text>
          </TouchableOpacity>
        </View>

        {showRoomsModal &&
          renderDropdown(roomsOptions, setRooms, setShowRoomsModal)}
        {showHomeTypeModal &&
          renderDropdown(homeTypeOptions, setHomeType, setShowHomeTypeModal)}
        {showOccupantsModal &&
          renderDropdown(occupantsOptions, setOccupants, setShowOccupantsModal)}
        {showEnergySourceModal &&
          renderDropdown(
            energySourceOptions,
            setEnergySource,
            setShowEnergySourceModal
          )}
        {renderDevicesModal()}

        {/* Room Naming Modal */}
        <Modal
          visible={showRoomNamesModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Name Your Rooms</Text>
              {roomNames.map((roomName, index) => (
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
          </View>
        </Modal>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginLeft: 8,
    width: "100%",
    flex: 1,
    opacity: 0.9, // Increased opacity for better visibility
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20, // Increased font size
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow for better contrast
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16, // Increased font size
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow for better contrast
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  separator: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  link: {
    color: "#4da6ff",
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 16, // Increased font size
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow for better contrast
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    marginBottom: 5,
    color: "white",
    fontWeight: "bold",
    fontSize: 16, // Increased font size
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow for better contrast
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#1F2A44",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24, // Increased font size
    fontWeight: "bold",
    marginBottom: 15,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow for better contrast
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "white",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  heading: {
    fontSize: 36, // Increased font size
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Added text shadow for better contrast
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonCancel: {
    backgroundColor: "#555",
  },
  buttonSave: {
    backgroundColor: "#4da6ff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16, // Increased font size
  },
});

export default SettingsScreen;
