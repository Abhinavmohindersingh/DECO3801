// ElecSpendingScreen.js

import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native"; // Correctly import useNavigation

const ElecSpendingScreen = () => {
  const navigation = useNavigation(); // Correctly use useNavigation
  const { consumptionHistory } = useContext(AppContext);
  const [tipVisible, setTipVisible] = useState(false); // State for showing tips

  // Define fixed width per data point (e.g., 60 pixels)
  const POINT_WIDTH = 60;
  const chartHeight = 300; // Increased from 220 to 300
  // You can adjust the chartHeight as per your design requirements

  // Define the total number of hours from 4 AM to 12 AM (midnight)
  const TOTAL_HOURS = 20;

  /**
   * Generate fixed labels from 4 AM to 12 AM with minutes
   */
  const generateLabels = () => {
    const labels = [];
    for (let i = 4; i <= 24; i++) {
      let hour = i;
      let ampm = "AM";
      if (hour === 0) {
        hour = 12;
        ampm = "AM";
      } else if (hour === 12) {
        ampm = "PM";
      } else if (hour > 12) {
        hour -= 12;
        ampm = "PM";
      }
      labels.push(`${hour}:00 ${ampm}`); // Includes minutes
    }
    return labels;
  };

  const labels = generateLabels();

  // Slice the last 20 data points (from 4 AM to 12 AM)
  const data = consumptionHistory.slice(-TOTAL_HOURS);

  /**
   * Pad the data with zeros if there are fewer than 20 data points
   * This ensures consistent spacing and alignment on the chart
   */
  const paddedData = useMemo(() => {
    const padding = TOTAL_HOURS - data.length;
    if (padding > 0) {
      return Array(padding).fill(0).concat(data);
    }
    return data;
  }, [data]);

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
        data: paddedData,
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
    formatXLabel: (value) => value, // Show full time labels with minutes
    propsForBackgroundLines: {
      stroke: "#444C5E",
    },
  };

  /**
   * Reusable ChartWithTooltip Component
   */
  const ChartWithTooltip = ({ data, labels, peakIndex }) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({
      x: 0,
      y: 0,
    });
    const fadeAnim = useRef(new Animated.Value(0)).current;

    /**
     * Handles data point clicks to display tooltip
     * @param {object} dataPoint - Data point information
     */
    const handleDataPointClick = (dataPoint) => {
      const { x, y, index, value } = dataPoint;

      // Set tooltip data and position
      setTooltipData({
        label: labels[index],
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

    useEffect(() => {
      if (!tooltipVisible) {
        // Reset fadeAnim when tooltip is hidden
        fadeAnim.setValue(0);
      }
    }, [tooltipVisible, fadeAnim]);

    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={TOTAL_HOURS * POINT_WIDTH} // Dynamic width based on data points
          height={chartHeight} // Increased chart height
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
          onDataPointClick={handleDataPointClick}
          fromZero={true}
        />

        {/* Tooltip */}
        {tooltipVisible && tooltipData && (
          <Animated.View
            accessible={true}
            accessibilityLabel={`${tooltipData.label}: ${tooltipData.value} kilowatt-hours`}
            style={[
              styles.tooltip,
              {
                left: tooltipPosition.x - 60, // Center the tooltip horizontally
                top: tooltipPosition.y - 10, // Adjusted position for increased chart height
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

  /**
   * Renders the informational tip
   */
  const renderEnergyInfo = () => (
    <View style={styles.tipContainer}>
      <Text style={styles.tipText}>
        This screen provides an overview of your energy spending. The chart
        shows your spending over time, converted from your energy usage at a
        rate of $0.25 per kWh. The insights section below summarizes your
        average spending, total spending so far, and the period during which
        your energy consumption was at its peak. You can also view your current
        budget and how much you have left for the billing cycle.
      </Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>Consumption Overview</Text>
          <View style={styles.currentTimeContainer}>
            <Icon name="clock-time-four" size={20} color="#FFD700" />
            <Text style={styles.currentTimeText}>
              {labels.length > 0 ? labels[labels.length - 1] : "00:00 AM"}
            </Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Energy Consumption</Text>
          {consumptionHistory.length > 0 ? (
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 20,
              }}
              showsHorizontalScrollIndicator={false}
            >
              <ChartWithTooltip
                data={chartData}
                labels={labels}
                peakIndex={
                  consumptionHistory.length > 0
                    ? consumptionHistory.indexOf(peakConsumption)
                    : -1
                }
              />
            </ScrollView>
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

        {/* Info Button */}
        <TouchableOpacity
          style={styles.tipButton}
          onPress={() => setTipVisible(!tipVisible)}
          accessibilityLabel="Toggle Info"
        >
          <Icon name="lightbulb-on" size={20} color="#FFF" />
          <Text style={styles.tipButtonText}>Info</Text>
        </TouchableOpacity>

        {/* Render Energy Tip if visible */}
        {tipVisible && renderEnergyInfo()}
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginLeft: 10,
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
  tipContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.7)", // 0.7 transparency green
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  tipText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  tipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.7)", // 0.7 transparency green
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
    justifyContent: "center",
    height: 180,
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
    width: 120, // Reduced width for smaller tooltip
    padding: 6, // Reduced padding for smaller tooltip
    backgroundColor: "rgba(76, 175, 80, 0.7)", // 0.7 transparency green
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipText: {
    color: "#FFFFFF", // Changed to white for better contrast on green background
    fontSize: 12,
    fontWeight: "700",
  },
  tooltipValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2, // Reduced margin for compactness
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -8, // Adjusted for better alignment
    left: "50%",
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8, // Reduced size for smaller arrow
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(76, 175, 80, 0.7)", // Match tooltip background
  },
});

export default ElecSpendingScreen;
