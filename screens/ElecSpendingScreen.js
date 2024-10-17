// SpendingScreen.js
import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppContext } from "../AppContext";
import Background from "../components/Background"; // Ensure correct path
import Svg, { Line, Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native"; // Correctly import useNavigation

const ElecSpendingScreen = () => {
  const navigation = useNavigation(); // Correctly use useNavigation
  const { consumptionHistory } = useContext(AppContext);

  // Generate labels based on the number of entries
  const generateLabels = () => {
    const labels = [];
    const now = new Date();

    consumptionHistory.forEach((_, index) => {
      const time = new Date(
        now.getTime() - (consumptionHistory.length - index - 1) * 5 * 60 * 1000
      );
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      labels.push(`${hours}:${minutes}`);
    });

    return labels;
  };

  const labels = generateLabels();
  const data = consumptionHistory;

  // Calculate peak consumption and peak period using useMemo for optimization
  const { peakConsumption, peakPeriod, averageConsumption, totalConsumption } =
    useMemo(() => {
      if (consumptionHistory.length === 0) {
        return {
          peakConsumption: 0,
          peakPeriod: "N/A",
          averageConsumption: 0,
          totalConsumption: 0,
        };
      }

      const peakValue = Math.max(...consumptionHistory);
      const peakIndex = consumptionHistory.indexOf(peakValue);
      const peakTime = labels[peakIndex] || "N/A";
      const total = consumptionHistory.reduce((a, b) => a + b, 0);
      const average = total / consumptionHistory.length;

      return {
        peakConsumption: peakValue,
        peakPeriod: peakTime,
        averageConsumption: average,
        totalConsumption: total,
      };
    }, [consumptionHistory, labels]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Line color
        strokeWidth: 2, // Line thickness
      },
    ],
    legend: ["Energy Consumption (kWh)"],
  };

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
   * Reusable ChartWithTooltip Component
   */
  const ChartWithTooltip = ({ data, type, peakIndex }) => {
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const [tooltipData, setTooltipData] = React.useState(null);
    const [tooltipPosition, setTooltipPosition] = React.useState({
      x: 0,
      y: 0,
    });
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    /**
     * Handles data point clicks to display tooltip
     * @param {object} dataPoint - Data point information
     */
    const handleDataPointClick = (dataPoint) => {
      const { x, y, index, value } = dataPoint;

      // Set tooltip data and position
      setTooltipData({
        label: data.labels[index],
        value,
      });
      setTooltipPosition({ x, y });
      setTooltipVisible(true);

      // Start fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    React.useEffect(() => {
      if (!tooltipVisible) {
        // Reset fadeAnim when tooltip is hidden
        fadeAnim.setValue(0);
      }
    }, [tooltipVisible, fadeAnim]);

    /**
     * Renders markers for the chart, including the peak marker
     */

    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={Dimensions.get("window").width - 40} // Adjusted width for better fit
          height={180} // Increased height for better label visibility
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
          onDataPointClick={handleDataPointClick}
        />

        {/* Tooltip */}
        {tooltipVisible && tooltipData && (
          <Animated.View
            accessible={true}
            accessibilityLabel={`${tooltipData.label}: ${tooltipData.value} kilowatt-hours`}
            style={[
              styles.tooltip,
              {
                left: tooltipPosition.x - 50, // Center the tooltip horizontally
                top: tooltipPosition.y - 80, // Position above the data point
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.tooltipText}>{tooltipData.label}</Text>
            <Text style={styles.tooltipValue}>{tooltipData.value} kWh</Text>
            {/* Arrow */}
            <View style={styles.tooltipArrow} />
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <Background>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <Icon name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spending Overview</Text>
          <View style={styles.currentTimeContainer}>
            <Icon name="clock-time-four" size={20} color="#FFD700" />
            <Text style={styles.currentTimeText}>
              {labels.slice(-1)[0] || "00:00"}
            </Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Energy Consumption History</Text>
          {consumptionHistory.length > 0 ? (
            <ChartWithTooltip
              data={chartData}
              type="spending"
              peakIndex={
                consumptionHistory.length > 0
                  ? consumptionHistory.indexOf(peakConsumption)
                  : -1
              }
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Icon name="alert-circle-outline" size={50} color="#FFD700" />
              <Text style={styles.noDataText}>
                No consumption data available.
              </Text>
            </View>
          )}
        </View>

        {/* Insights Section */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Insights</Text>
          {consumptionHistory.length > 0 ? (
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
    marginLeft: 10,
    width: 380,
    flexGrow: 1, // Ensures content expands to fill the ScrollView
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(31, 42, 68, 0.8)",
    padding: 8,
    borderRadius: 25,
    zIndex: 2,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 10,
    textAlign: "center",
  },
  currentTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  currentTimeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "rgba(31, 42, 68, 0.7)", // Dark background for contrast
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  noDataContainer: {
    alignItems: "center",
    marginBottom: 30,
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
  tooltip: {
    position: "absolute",
    width: 100,
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

export default ElecSpendingScreen;
