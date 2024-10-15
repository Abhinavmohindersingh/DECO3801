import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Background from "../components/Background";

const EnergyUsage = ({ navigation }) => {
  const [energyUsage, setEnergyUsage] = useState(0);

  const [chartDataWeekly, setChartDataWeekly] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 40, 60, 80, 40, 20, 100],
      },
    ],
  });

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
        data: [30, 20, 50, 80, 45, 60, 90],
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

  return (
    <Background>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Navigates to the previous screen
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <TouchableWithoutFeedback>
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.energySubtext}>Predict Usage</Text>
          </View>

          {/* Weekly Energy Usage Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Weekly Energy Usage</Text>
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

                <View style={styles.energyUsageRow}>
                  <Icon name="lightning-bolt" size={40} color="yellow" />
                  <Text style={styles.energyText}>: {energyUsage} kWh</Text>
                </View>
              </View>

              {/* Weekly Bar Chart */}
              <View style={styles.chartContainer}>
                <BarChart
                  data={barChartDataWeekly}
                  width={Dimensions.get("window").width - 40}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=" kWh"
                  chartConfig={barChartConfig}
                  style={styles.chartStyle}
                />
              </View>
            </ScrollView>
          </View>

          {/* Daily Energy Usage Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Daily Energy Usage</Text>
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

                <View style={styles.energyUsageRow}>
                  <Icon name="lightning-bolt" size={40} color="yellow" />
                  <Text style={styles.energyText}>: {energyUsage} kWh</Text>
                </View>
              </View>

              {/* Daily Bar Chart */}
              <View style={styles.chartContainer}>
                <BarChart
                  data={barChartDataDaily}
                  width={Dimensions.get("window").width - 40}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=" kWh"
                  chartConfig={barChartConfig}
                  style={styles.chartStyle}
                />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  energySubtext: {
    fontSize: 30,
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
  chartContainer: {
    paddingLeft: 20,
    paddingBottom: 20,
    width: Dimensions.get("window").width - 10, // Ensure each chart takes appropriate width
  },
  chartStyle: {
    borderRadius: 16,
    marginVertical: 20,
  },
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
});

export default EnergyUsage;
