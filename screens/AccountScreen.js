import React, { useState } from "react";
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
} from "react-native";
import Background from "../components/Background";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState("");
  const [homeType, setHomeType] = useState("");
  const [occupants, setOccupants] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [roomNames, setRoomNames] = useState([]);

  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showHomeTypeModal, setShowHomeTypeModal] = useState(false);
  const [showOccupantsModal, setShowOccupantsModal] = useState(false);
  const [showEnergySourceModal, setShowEnergySourceModal] = useState(false);
  const [showRoomNamesModal, setShowRoomNamesModal] = useState(false);

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

  const handleBackPress = () => {
    // Navigate back to the previous screen (no validation needed now)
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
                      // Open room naming modal after selecting the number of rooms
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

  const handleRoomNameChange = (index, name) => {
    const newRoomNames = [...roomNames];
    newRoomNames[index] = name;
    setRoomNames(newRoomNames);
  };

  const handleSaveRoomNames = () => {
    // Implement your save logic here (e.g., send roomNames to server or save locally)
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
          {showRoomsModal &&
            renderDropdown(roomsOptions, setRooms, setShowRoomsModal)}

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
          {showHomeTypeModal &&
            renderDropdown(homeTypeOptions, setHomeType, setShowHomeTypeModal)}

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
          {showOccupantsModal &&
            renderDropdown(
              occupantsOptions,
              setOccupants,
              setShowOccupantsModal
            )}
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
          {showEnergySourceModal &&
            renderDropdown(
              energySourceOptions,
              setEnergySource,
              setShowEnergySourceModal
            )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
    marginTop: 100,
    width: "100%",
  },
  header: {
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
  formSection: {
    marginBottom: 30,
    marginLeft: 10,
    alignContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
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
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 18,
  },
  roomInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    fontSize: 18,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  backButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
    marginLeft: 75,
    width: 200,
    alignItems: "center",
  },
});

export default ProfileScreen;
