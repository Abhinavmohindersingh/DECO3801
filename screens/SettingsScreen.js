import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  Alert,
} from "react-native";

import Background from "../components/Background";

const SettingsScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false);

  const handleSavePersonalInfo = () => {
    if (name === "" || email === "") {
      Alert.alert("Error", "Please fill in both fields.");
    } else {
      // Save logic for personal information
      Alert.alert("Success", "Your personal details have been updated!");
      setPersonalInfoVisible(false);
    }
  };

  const handlePress = () => {
    navigation.navigate("AccountScreen");
  };

  const showAlertCS = (title, message) => {
    Alert.alert(title, message, [
      {
        text: "For customer support, please send your enquiries to info@windash.com, someone will be able to help within 3 bussiness day",
      },
    ]);
  };
  const showAlertfaq = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };
  const showAlertPP = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

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
            <View style={styles.row}></View>
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
            <TouchableOpacity onPress={() => handlePress()}>
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
              <TouchableOpacity onPress={() => setShowCustomerSupport(true)}>
                <Text style={styles.link}>Customer Support</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                showAlertCS();
              }}
            >
              <TouchableOpacity onPress={() => setShowPrivacyPolicy(true)}>
                <Text style={styles.link}>Privacy Policy</Text>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={showCustomerSupport}
                onRequestClose={() => setShowCustomerSupport(false)}
              >
                <TouchableWithoutFeedback
                  onPress={() => setShowCustomerSupport(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalTitle}>Customer Support</Text>
                      <Text style={styles.modalText}>
                        For customer support, please send your enquiries to
                        info@windash.com. Someone will be able to help within 3
                        business days.
                      </Text>
                      <TouchableOpacity
                        style={[styles.button, { alignItems: "flex-start" }]}
                        onPress={() => setShowCustomerSupport(false)}
                      >
                        <Text style={[styles.buttonText, { color: "pink" }]}>
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              <Modal
                animationType="slide"
                transparent={true}
                visible={showPrivacyPolicy}
                onRequestClose={() => setShowPrivacyPolicy(false)}
              >
                <TouchableWithoutFeedback
                  onPress={() => setShowPrivacyPolicy(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalTitle}>Privacy Policy</Text>
                      <ScrollView>
                        <Text style={styles.modalText}>
                          **Privacy Policy**{"\n"}
                          **Effective Date: 15 October, 2024**{"\n"}
                          {"\n"}
                          At WINDASH, we are committed to protecting your
                          privacy. This Privacy Policy explains how we collect,
                          use, and disclose your personal information.{"\n"}
                          {"\n"}
                          **1. Information We Collect:**{"\n"}- Personal
                          Information: Name, email address, and phone number.
                          {"\n"}- Usage Data: Information about your
                          interactions with our app, including the pages you
                          visit and the features you use.{"\n"}
                          {"\n"}
                          **2. How We Use Your Information:**{"\n"}- To provide
                          and maintain our services.{"\n"}- To notify you about
                          changes to our services.{"\n"}- To provide customer
                          support.{"\n"}
                          {"\n"}
                          **3. Sharing Your Information:**{"\n"}- We do not
                          share your personal information with third parties
                          except to comply with legal obligations.{"\n"}
                          {"\n"}
                          **4. Data Security:**{"\n"}- We use industry-standard
                          security measures to protect your information.{"\n"}
                          {"\n"}
                          **5. Changes to This Policy:**{"\n"}- We may update
                          our Privacy Policy from time to time. We will notify
                          you of any changes by posting the new Privacy Policy
                          on this page.{"\n"}
                          {"\n"}
                          **Contact Us:**{"\n"}
                          If you have any questions about this Privacy Policy,
                          please contact us at support@windash.com.{"\n"}
                          {"\n"}
                          **Disclaimer:** This is a fake privacy policy for
                          demonstration purposes only.
                        </Text>
                      </ScrollView>
                      <TouchableOpacity
                        style={[styles.button, { alignItems: "flex-start" }]}
                        onPress={() => setShowPrivacyPolicy(false)}
                      >
                        <Text style={[styles.buttonText, { color: "pink" }]}>
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
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
                onPress={handleSavePersonalInfo}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    margin: 20,
    backgroundColor: "#1F2A44",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center", // Added for centering
    alignSelf: "center", // Added for centering
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
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 30,
  },
  modalText: {
    color: "white",
  },
});

export default SettingsScreen;
