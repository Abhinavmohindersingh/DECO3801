import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";

import Background from "../components/Background";

const SettingsScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <Background>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Navigates to the previous screen
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.heading}>Settings</Text>
        <View style={styles.separator} />
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.row}>
              <Text style={styles.text}>Dark Mode</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity onPress={() => setPersonalInfoVisible(true)}>
              <Text style={styles.link}>Edit Personal Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About WINDASH</Text>
            <Text style={styles.description}>
              WINDASH is a leading provider of energy monitoring for households.
            </Text>
            <Text style={styles.description}>Version: 1.0.0</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <TouchableOpacity
              onPress={() => {
                /* Add action to contact support */
              }}
            >
              <Text style={styles.link}>Customer Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                /* Navigate to FAQs screen */
              }}
            >
              <Text style={styles.link}>FAQs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                /* Navigate to Privacy Policy screen */
              }}
            >
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={personalInfoVisible}
          onRequestClose={() => setPersonalInfoVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Personal Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setPersonalInfoVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={() => {
                  // Save personal info logic here
                  setPersonalInfoVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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

  // **New Styles for Back Button**
  backButton: {
    position: "absolute",
    top: 40, // Adjust based on your layout
    left: 10, // Adjust based on your layout
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
    textAlign: "center",
  },
});

export default SettingsScreen;
