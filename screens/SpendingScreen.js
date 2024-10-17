// SpendingScreen.js
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { PieChart } from "react-native-svg-charts";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import the hook
import Background from "../components/Background";
import Svg, { Line, Circle, Text as SvgText } from "react-native-svg"; // Import SvgText
import { AppContext } from "../AppContext"; // Assuming you have AppContext for global state

const SpendingScreen = () => {
  const navigation = useNavigation(); // Use the hook to get the navigation prop
  const { consumptionHistory } = useContext(AppContext); // Get consumptionHistory from context

  const [budgetData, setBudgetData] = useState({});
  const [storedLimit, setStoredLimit] = useState(null);
  const [storedCycle, setStoredCycle] = useState(null);

  // Fetch budget data from AsyncStorage or context
  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        const savedBudget = await AsyncStorage.getItem("budgetData");
        const savedLimit = await AsyncStorage.getItem("energyLimit");
        const savedCycle = await AsyncStorage.getItem("billCycle");
        if (savedBudget !== null) {
          setBudgetData(JSON.parse(savedBudget));
        }
        if (savedLimit !== null) {
          setStoredLimit(parseFloat(savedLimit)); // Ensure it's a number
        }
        if (savedCycle !== null) {
          setStoredCycle(parseInt(savedCycle, 10)); // Ensure it's a number
        }
      } catch (error) {
        console.error("Error loading budget data from storage:", error);
      }
    };
    loadBudgetData();
  }, []);

  // Generate labels for 8 intervals: 12 AM, 3 AM, ..., 9 PM
  const generateLabels = () => {
    const labels = [];
    for (let i = 0; i < 8; i++) {
      const hour = (i * 3) % 24;
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      labels.push(`${displayHour} ${period}`);
    }
    return labels;
  };

  const labels = generateLabels();

  // Aggregate consumptionHistory into 8 intervals, each with 18 readings (10 min intervals)
  const aggregatedConsumptionData = useMemo(() => {
    const intervalSize = 18; // 3 hours * 60 minutes / 10 minutes per reading = 18
    const totalIntervals = 8;
    const aggregated = [];

    // Ensure we have enough data
    const requiredDataPoints = intervalSize * totalIntervals;
    const data = consumptionHistory.slice(-requiredDataPoints);

    for (let i = 0; i < totalIntervals; i++) {
      const start = i * intervalSize;
      const end = start + intervalSize;
      const intervalReadings = data.slice(start, end);

      if (intervalReadings.length === intervalSize) {
        const sum = intervalReadings.reduce((a, b) => a + b, 0);
        const average = sum / intervalSize;
        aggregated.push(parseFloat(average.toFixed(2)));
      } else {
        // Handle insufficient data by averaging available readings
        const sum = intervalReadings.reduce((a, b) => a + b, 0);
        const average =
          intervalReadings.length > 0 ? sum / intervalReadings.length : 0;
        aggregated.push(parseFloat(average.toFixed(2)));
      }
    }

    console.log("Aggregated Consumption Data:", aggregated); // Debugging
    return aggregated;
  }, [consumptionHistory]);

  // Calculate peak consumption and peak period based on aggregated data
  const { peakConsumption, peakPeriod, averageConsumption, totalConsumption } =
    useMemo(() => {
      if (aggregatedConsumptionData.length === 0) {
        return {
          peakConsumption: 0,
          peakPeriod: "N/A",
          averageConsumption: 0,
          totalConsumption: 0,
        };
      }

      const peakValue = Math.max(...aggregatedConsumptionData);
      const peakIndex = aggregatedConsumptionData.lastIndexOf(peakValue);
      const peakTime = labels[peakIndex] || "N/A";
      const total = aggregatedConsumptionData.reduce((a, b) => a + b, 0);
      const average = total / aggregatedConsumptionData.length;

      console.log(`Peak Consumption: ${peakValue} kWh at ${peakTime}`); // Debugging

      return {
        peakConsumption: peakValue,
        peakPeriod: peakTime,
        averageConsumption: average,
        totalConsumption: total,
      };
    }, [aggregatedConsumptionData, labels]);

  // Format data for Energy Consumption LineChart
  const energyChartData = {
    labels: labels,
    datasets: [
      {
        data: aggregatedConsumptionData,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Line color
        strokeWidth: 2, // Line thickness
      },
    ],
    legend: ["Energy Consumption (kWh)"],
  };

  // Format data for Budget Distribution PieChart
  const budgetChartData = useMemo(() => {
    if (!budgetData || Object.keys(budgetData).length === 0) return [];

    const categories = Object.keys(budgetData);
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#C9CBCF",
      "#8A2BE2",
    ];

    const pieData = categories.map((category, index) => ({
      value: budgetData[category], // Ensure this is a number
      svg: { fill: colors[index % colors.length] },
      key: `pie-${index}`,
      arc: { outerRadius: 80, cornerRadius: 5 }, // Using numbers for outerRadius
      label: `${category} ($${budgetData[category]})`, // Optional label
    }));

    console.log("Budget Pie Chart Data:", pieData); // Debugging
    return pieData;
  }, [budgetData]);

  // Chart Configuration for LineChart and PieChart
  const chartConfig = {
    backgroundGradientFrom: "#1F2A44",
    backgroundGradientTo: "#1F2A44",
    decimalPlaces: 2, // Optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#FFD700",
    },
    propsForBackgroundLines: {
      stroke: "#444C5E",
    },
  };

  /**
   * Reusable ChartWithTooltip Component for LineChart
   * Note: Removed tooltip implementation to simplify and isolate the issue.
   */
  const ChartWithTooltip = ({ data, type, peakIndex }) => {
    // Tooltip functionality removed to prevent errors
    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={Dimensions.get("window").width - 40} // Adjusted width for better fit
          height={220} // Increased height for better label visibility
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      </View>
    );
  };

  return (
    <Background>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("FlowerPot")} // Navigate back
        accessibilityLabel="Go back"
      >
        <Text style={styles.backButtonText}>Back to Flowerpot</Text>
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Spending Overview</Text>
        </View>

        {/* Energy Consumption Line Chart */}

        {/* Budget Distribution Pie Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Budget Distribution</Text>
          {budgetChartData.length > 0 ? (
            <PieChart
              style={styles.budgetChart}
              data={budgetChartData}
              innerRadius={20} // Number
              outerRadius={80} // Number
              padAngle={0.02} // Number
              animate={true}
              animationDuration={500}
              accessor={"value"} // Accessor for the value
              backgroundColor={"transparent"}
              label={({ pieCentroid, data }) => (
                <SvgText
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: "black",
                  }}
                  x={pieCentroid[0]}
                  y={pieCentroid[1]}
                >
                  {data.label}
                </SvgText>
              )}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Icon
                name="alert-circle-outline"
                size={50}
                color="#FFD700"
                accessibilityLabel="No budget data available"
              />
              <Text style={styles.noDataText}>No budget data available.</Text>
            </View>
          )}
        </View>

        {/* Insights Section */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Insights</Text>
          {aggregatedConsumptionData.length > 0 ? (
            <>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Average Consumption:</Text>{" "}
                {averageConsumption.toFixed(2)} kWh
              </Text>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Total Consumption:</Text>{" "}
                {totalConsumption.toFixed(2)} kWh
              </Text>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Peak Consumption:</Text>{" "}
                {peakConsumption.toFixed(2)} kWh
              </Text>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Peak Period:</Text> {peakPeriod}
              </Text>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Budget Limit:</Text>{" "}
                {storedLimit !== null ? `$${storedLimit.toFixed(2)}` : "$0.00"}
              </Text>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Billing Cycle:</Text>{" "}
                {storedCycle !== null ? `${storedCycle} Days` : "N/A"}
              </Text>
            </>
          ) : (
            <Text style={styles.insightText}>No data to display insights.</Text>
          )}
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures content expands to fill the ScrollView
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent for better visibility
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 2,
  },
  backButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
  },
  chartSection: {
    marginBottom: 30,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 10,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    position: "relative", // To position the tooltip absolutely within
    width: "100%",
  },
  chartStyle: {
    borderRadius: 16,
    marginVertical: 8,
  },
  budgetChart: {
    height: 200,
    width: 200,
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFD700",
    textAlign: "center",
  },
  insightsContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: "rgba(31, 42, 68, 0.7)",
    borderRadius: 10,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#FFD700",
    textAlign: "center",
  },
  insightText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  pieLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  tooltip: {
    position: "absolute",
    width: 120,
    padding: 8,
    backgroundColor: "rgba(31, 42, 68, 0.9)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700",
  },
  tooltipValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -10,
    left: "50%",
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(31, 42, 68, 0.9)",
  },
});

export default SpendingScreen;
