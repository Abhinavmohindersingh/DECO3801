import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Background from "../components/Background";
import Icon from "react-native-vector-icons/MaterialIcons";
import logo from "../icons/windashlog.png";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState("");
  const [homeType, setHomeType] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [occupants, setOccupants] = useState("");
  const [dailyUsage, setDailyUsage] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [energyPreferences, setEnergyPreferences] = useState({
    lighting: false,
    heatingCooling: false,
    appliances: false,
    waterUsage: false,
  });
  // const [isNextEnabled, setIsNextEnabled] = useState(false);

  // useEffect(() => {
  //   // Check if all required fields have a value
  //   if (rooms && homeType && occupants) {
  //     setIsNextEnabled(true);
  //   } else {
  //     setIsNextEnabled(false);
  //   }
  // }, [rooms, homeType, occupants]);

  const handleNextPress = () => {
    // Notify user when not all value is selected
    if (rooms == "" || homeType == "" || occupants == "") {
      Alert.alert(
        "Incomplete Information",
        "Please select values for all required fields before proceeding."
      );
      return;
    }

    // Navigate to the HomeScreen
    navigation.navigate("Home", {
      rooms: rooms,
      homeType: homeType,
      squareFootage: squareFootage,
      occupants: occupants,
      dailyUsage: dailyUsage,
      energySource: energySource,
      energyPreferences: energyPreferences,
    });
  };

  const togglePreference = (key) => {
    setEnergyPreferences((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <Background>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

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

          <View style={styles.inputContainer}>
            <Icon name="home" size={24} color="#fff" style={styles.icon} />
            <Picker
              selectedValue={rooms}
              onValueChange={setRooms}
              style={styles.picker}
            >
              <Picker.Item label="Select Rooms" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5+" value="5+" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="house" size={24} color="#fff" style={styles.icon} />
            <Picker
              selectedValue={homeType}
              onValueChange={setHomeType}
              style={styles.picker}
            >
              <Picker.Item label="Select Home Type" value="" />
              <Picker.Item label="Apartment" value="apartment" />
              <Picker.Item label="Single-family home" value="singleFamily" />
              <Picker.Item label="Townhouse" value="townhouse" />
              <Picker.Item label="Condo" value="condo" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="person" size={24} color="#fff" style={styles.icon} />
            <Picker
              selectedValue={occupants}
              onValueChange={setOccupants}
              style={styles.picker}
            >
              <Picker.Item label="Select Occupants" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
            </Picker>
          </View>
        </View>

        {/* <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Energy Source Information</Text>
          <View style={styles.inputContainer}>
            <Icon name="power" size={24} color="#fff" style={styles.icon} />
            <Picker
              selectedValue={energySource}
              onValueChange={setEnergySource}
              style={styles.picker}
            >
              <Picker.Item label="Select Energy Source" value="" />
              <Picker.Item label="Electricity" value="electricity" />
              <Picker.Item label="Natural Gas" value="naturalGas" />
              <Picker.Item label="Solar" value="solar" />
              <Picker.Item label="Oil" value="oil" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View> */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            // style={[styles.nextButton, !isNextEnabled && styles.disabledButton]}
            style={[styles.nextButton]}
            onPress={handleNextPress}
            // disabled={!isNextEnabled}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginLeft: 50,
    flex: 1,
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
    textAlign: "center", // Center text
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
  formSection: {
    marginBottom: 30,
    width: "100%", // Ensure full width
    alignItems: "center", // Center horizontally
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center", // Center text
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
    width: "100%", // Ensure full width
  },
  logoContainer: {
    alignItems: "center",
    marginLeft: 20,
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  icon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    width: "100%", // Ensure full width
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    width: "30%",
    flex: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
