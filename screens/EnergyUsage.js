import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for information icon
import Background from "../components/Background";
import { useNavigation, useRoute } from "@react-navigation/native";
const { height } = Dimensions.get("window");
const EnergyUsage = ({ navigation }) => {
  const [energyUsage, setEnergyUsage] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false); // For information modal visibility

  const [chartDataWeekly, setChartDataWeekly] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 34, 31, 23, 20, 19, 27],
      },
    ],
  });

  const handleInfoPress = (text) => {
    setInfoText(text);
    setShowInfoModal(true);
  };
  const [infoText, setInfoText] = useState(""); // To display different info text

  const [chartDataDaily, setChartDataDaily] = useState({
    labels: ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
    datasets: [
      {
        data: [1, 5, 2, 4, 6, 7, 5, 3],
      },
    ],
  });

  const [barChartDataWeekly, setBarChartDataWeekly] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 34, 31, 23, 20, 19, 27],
      },
    ],
  });

  const [barChartDataDaily, setBarChartDataDaily] = useState({
    labels: ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
    datasets: [
      {
        data: [10, 30, 15, 50, 35, 40, 20, 60],
      },
    ],
  });

  const handleBackPress = () => {
    navigation.navigate("FlowerPot");
  };

  return (
    <Background>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress} // Navigate back to the FlowerPot screen with params
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback>
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.energySubtext}></Text>
            <View style={styles.energyUsageRow}>
              {/* <Icon name="lightning-bolt" size={50} color="white" /> */}
              {/* <Text style={styles.energyText}>: {energyUsage} </Text> */}
            </View>
          </View>
          {/* Weekly Energy Usage Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Weekly Energy Usage</Text>
              <TouchableOpacity
                onPress={() =>
                  handleInfoPress([
                    "Enter the Number of Rooms and occuptants to each to help us understand your Home",
                    "Please specify the number of rooms in your household.",
                    "Please specify the number of occupants.",
                  ])
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            >
              {/* Weekly Line Chart */}
              <View style={styles.chartContainer}>
                <LineChart
                  data={chartDataWeekly}
                  width={Dimensions.get("window").width - 40}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=" kWh"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              </View>
            </ScrollView>
          </View>
          {/* Daily Energy Usage Section */}

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Energy Usage</Text>
              <TouchableOpacity
                onPress={() =>
                  handleInfoPress([
                    "Enter the Number of Rooms and occuptants to each to help us understand your Home",
                    "Please specify the number of rooms in your household.",
                    "Please specify the number of occupants.",
                  ])
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            >
              {/* Daily Line Chart */}
              <View style={styles.chartContainer}>
                <LineChart
                  data={chartDataDaily}
                  width={Dimensions.get("window").width - 40}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=" kWh"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

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
                {Array.isArray(infoText) ? (
                  infoText.map((point, index) => (
                    <View key={index} style={styles.bulletPointContainer}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{point}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.modalItemText}>{infoText}</Text>
                )}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => setShowInfoModal(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Background>
  );
};

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "4", stroke: "#1F2A44" },
};

// Colorful Bar Chart Config
const barChartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "8", stroke: "#1F2A44" },
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
  },
  header: {
    alignItems: "center", // Center the content horizontally
    marginBottom: 20,
  },
  energyUsageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  energyText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  energySubtext: {
    fontSize: 20,
    marginTop: 10,
    color: "white",
    fontWeight: "bold",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "right",
    justifyContent: "right", // Ensure the icon is close to the text
    marginBottom: 0,
  },
  formSection: {},
  chartContainer: {
    paddingLeft: 20,
    paddingBottom: 20,
    width: Dimensions.get("window").width - 10, // Ensure each chart takes appropriate width
  },
  chartStyle: {
    borderRadius: 16,
    marginVertical: 20,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  wideButton: {
    backgroundColor: "#0066cc",
    padding: 15,
    borderRadius: 25,
  },
  wideButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
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
    zIndex: 1, // Ensure the button is on top
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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
    fontSize: 16, // Text size
    color: "#fff", // Text color
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 30,
  },
});

export default EnergyUsage;
