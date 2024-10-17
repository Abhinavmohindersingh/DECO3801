import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import Background from "../components/Background";
import { AppContext } from "../AppContext"; // Import AppContext to access profileData

const EnergyLimitSetup = ({ navigation }) => {
  const [energyLimit, setEnergyLimit] = useState("");
  const [storedLimit, setStoredLimit] = useState(null);
  const [billingCycle, setBillingCycle] = useState("");
  const [storedCycle, setStoredCycle] = useState(null);
  const [tipVisible, setTipVisible] = useState(false);

  // Fetch the profileData from AppContext
  const { profileData } = useContext(AppContext);
  const occupants = profileData.occupants; // Get occupants selection

  useEffect(() => {
    const checkFirstUse = async () => {
      try {
        const isFirstUse = await AsyncStorage.getItem("isFirstUse");

        if (isFirstUse === null) {
          // Clear any stored data if it's the first use
          await AsyncStorage.removeItem("energyLimit");
          await AsyncStorage.removeItem("billCycle");

          // Set the first use flag
          await AsyncStorage.setItem("isFirstUse", "false");
        }

        // Load the saved limit and billing cycle (if available)
        loadLimitAndCycle();
      } catch (error) {
        console.error("Error checking first use:", error);
      }
    };

    const loadLimitAndCycle = async () => {
      try {
        const savedLimit = await AsyncStorage.getItem("energyLimit");
        const savedCycle = await AsyncStorage.getItem("billCycle");

        if (savedLimit !== null) {
          setStoredLimit(savedLimit);
          setEnergyLimit(savedLimit);
        }
        if (savedCycle !== null) {
          setStoredCycle(savedCycle);
          setBillingCycle(savedCycle);
        }
      } catch (error) {
        console.error("Error loading limit or cycle from storage:", error);
      }
    };

    checkFirstUse();
  }, []);

  const handleSetLimit = async () => {
    if (
      energyLimit === "" ||
      isNaN(energyLimit) ||
      billingCycle === "" ||
      isNaN(billingCycle)
    ) {
      Alert.alert(
        "Invalid Input",
        "Please enter valid numeric values for both budget and billing cycle."
      );
      return;
    }

    try {
      await AsyncStorage.setItem("energyLimit", energyLimit);
      await AsyncStorage.setItem("billCycle", billingCycle);
      setStoredLimit(energyLimit);
      setStoredCycle(billingCycle);
      Alert.alert(
        "Success",
        `Energy budget set to $${energyLimit} for every ${billingCycle} weeks`
      );
    } catch (error) {
      console.error("Error saving limit or cycle:", error);
      Alert.alert("Error", "Failed to save the budget. Please try again.");
    }
  };

  const renderEnergyTip = () => (
    <View style={styles.tipContainer}>
      <Text style={styles.tipText}>
        Tip: Setting a realistic energy budget can help you save money and
        reduce your carbon footprint. Try to aim for a 5-10% reduction from your
        previous bill for best results.
      </Text>
    </View>
  );

  return (
    <Background>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome5 name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
              <Text style={styles.title}>Set Your Energy Budget</Text>

              {storedLimit && storedCycle && (
                <View style={styles.currentLimitContainer}>
                  <Text style={styles.currentLimitLabel}>Current Budget:</Text>
                  <Text style={styles.currentLimitValue}>
                    $
                    {(
                      parseFloat(storedLimit) / parseFloat(storedCycle)
                    ).toFixed(2)}{" "}
                    per week
                  </Text>
                </View>
              )}

              {/* Display occupants from AppContext */}
              <View style={styles.occupantsContainer}>
                <Text style={styles.heading}>Price in cents/hour:</Text>
                <Text style={styles.occupantsValue}>
                  {occupants ? occupants : "Not Set"}
                </Text>
              </View>

              <Text style={styles.heading}>Enter Your Budget</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="dollar-sign"
                  size={20}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter budget in $"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={energyLimit}
                  onChangeText={setEnergyLimit}
                />
              </View>

              <Text style={styles.heading}>Enter Billing Cycle</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="calendar-alt"
                  size={20}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Billing Cycle in Weeks"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={billingCycle}
                  onChangeText={setBillingCycle}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSetLimit}>
                <Text style={styles.buttonText}>Save Budget</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.navigate("FlowerPot")}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tipButton}
                onPress={() => setTipVisible(!tipVisible)}
              >
                <FontAwesome5 name="lightbulb" size={20} color="#FFF" />
                <Text style={styles.tipButtonText}>Energy Saving Tip</Text>
              </TouchableOpacity>

              {tipVisible && renderEnergyTip()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
    width: 350,
    marginTop: 50,
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  currentLimitContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    width: "100%",
  },
  currentLimitLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  currentLimitValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  occupantsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  occupantsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 18,
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  tipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  tipButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  tipContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  tipText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default EnergyLimitSetup;
