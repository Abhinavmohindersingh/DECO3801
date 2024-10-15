import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-svg-charts";
import Background from "../components/Background";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import the hook

const SpendingScreen = () => {
  const navigation = useNavigation(); // Use the hook to get the navigation prop
  const [storedLimit, setStoredLimit] = useState(null);
  const [storedCycle, setStoredCycle] = useState(null);

  useEffect(() => {
    const loadLimitAndCycle = async () => {
      try {
        const savedLimit = await AsyncStorage.getItem("energyLimit");
        const savedCycle = await AsyncStorage.getItem("billCycle");
        if (savedLimit !== null) {
          setStoredLimit(savedLimit);
        }
        if (savedCycle !== null) {
          setStoredCycle(savedCycle);
        }
      } catch (error) {
        console.error("Error loading limit or cycle from storage:", error);
      }
    };
    loadLimitAndCycle();
  }, []);

  const hourlyData = [
    { value: 33.33, svg: { fill: "#00C49F" }, key: "pie-1" },
    { value: 33.33, svg: { fill: "#FFBB28" }, key: "pie-2" },
    { value: 33.33, svg: { fill: "#FF8042" }, key: "pie-3" },
  ];

  return (
    <Background>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Bill Estimation:</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <PieChart
            style={styles.chart}
            data={hourlyData}
            innerRadius="70%"
            outerRadius="100%"
            padAngle={0.01}
          />
          <View style={styles.innerCircle}>
            <Text style={styles.innerCircleText}>$0.16/hr</Text>
            <Text style={styles.innerCircleSmallText}>1.38kW</Text>
          </View>
        </View>

        <View style={styles.navigation}>
          <Text style={styles.navigationText}>Today</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>2%</Text>
            <Text style={styles.statsLabel}>Usage</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>
              {storedLimit ? `$${storedLimit}` : "$0.00"}
            </Text>
            <Text style={styles.statsLabel}>Budget</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>
              {storedCycle ? `${storedCycle} Days` : "N/A"}
            </Text>
            <Text style={styles.statsLabel}>Billing Cycle</Text>
          </View>
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("FlowerPot")} // Use navigation to go to "Flowerpot"
      >
        <Text style={styles.backButtonText}>Back to Flowerpot</Text>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 200,
    left: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    position: "absolute",
    top: 50,
    left: 25,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 80,
    marginTop: 20,
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  chart: {
    height: 300,
    width: 300,
  },
  innerCircle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "#00C49F",
  },
  innerCircleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  innerCircleSmallText: {
    fontSize: 14,
    color: "gray",
  },
  navigation: {
    marginTop: 20,
    alignItems: "center",
  },
  navigationText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 30,
  },
  statsItem: {
    alignItems: "center",
  },
  statsValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  statsLabel: {
    color: "white",
    fontSize: 14,
  },
  backButton: {
    position: "absolute",
    top: 650,
    left: 90,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent for better visibility
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default SpendingScreen;
