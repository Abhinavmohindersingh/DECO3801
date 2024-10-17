// PredicViz.js

import React, { useState, useEffect } from "react";
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
import Svg, { Line, Circle } from "react-native-svg";
import Background from "../components/Background"; // Adjust the import path as necessary

const PredictViz = ({ navigation }) => {
  const [currentTimeFraction, setCurrentTimeFraction] = useState(0);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const day = now.getDay() || 7; // Convert Sunday from 0 to 7

    // Calculate fractional index for the current time period
    const periodIndex = Math.floor(hour / 3);
    const fraction = ((hour % 3) + minute / 60) / 3; // Fraction within the current period
    setCurrentTimeFraction(periodIndex + fraction);

    setCurrentDayIndex(day - 1); // Adjust to 0-based index

    // Set current period text
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    setCurrentPeriod(`${days[day - 1]}, ${formatTimeBlock(hour)}`);
  }, []);

  const formatTimeBlock = (hour) => {
    const times = [
      "12AM-3AM",
      "3AM-6AM",
      "6AM-9AM",
      "9AM-12PM",
      "12PM-3PM",
      "3PM-6PM",
      "6PM-9PM",
      "9PM-12AM",
    ];
    return times[Math.min(Math.floor(hour / 3), times.length - 1)];
  };

  const chartDataWeekly = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 40, 60, 80, 40, 20, 100],
        color: () => `rgba(255, 99, 132, 1)`, // Line color
        strokeWidth: 2, // Line thickness
      },
    ],
    legend: ["kWh"],
  };

  const chartDataDaily = {
    labels: ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
    datasets: [
      {
        data: [1, 5, 2, 4, 6, 7, 5, 3], // 8 data points corresponding to 8 labels
        color: () => `"rgb(0, 128, 0)"`, // Line color
        strokeWidth: 2, // Line thickness
      },
    ],
    legend: ["kWh"],
  };

  /**
   * Reusable ChartWithTooltip Component
   */
  const ChartWithTooltip = ({
    data,
    type,
    currentTimeFraction,
    currentDayIndex,
  }) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const fadeAnim = useState(new Animated.Value(0))[0];

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

    useEffect(() => {
      if (!tooltipVisible) {
        // Reset fadeAnim when tooltip is hidden
        fadeAnim.setValue(0);
      }
    }, [tooltipVisible, fadeAnim]);

    /**
     * Renders markers for the chart
     */
    const renderMarkers = () => {
      const chartWidth = Dimensions.get("window").width - 40; // Adjusted width for better fit
      const chartHeight = 180; // Increased height for better label visibility
      const yAxisWidth = 40; // Must match yAxisWidth in chartConfig
      const paddingHorizontal = yAxisWidth;
      const paddingVertical = 20; // Top and bottom padding

      if (type === "weekly") {
        const numberOfLabels = data.labels.length;
        const segmentWidth =
          (chartWidth - 2 * paddingHorizontal) / (numberOfLabels - 1);
        const x = paddingHorizontal + currentDayIndex * segmentWidth;

        const currentValue = data.datasets[0].data[currentDayIndex];
        const maxValue = Math.max(...data.datasets[0].data);
        const minValue = Math.min(...data.datasets[0].data);
        const y =
          paddingVertical +
          ((maxValue - currentValue) / (maxValue - minValue)) *
            (chartHeight - 2 * paddingVertical);

        return (
          <Svg key={`marker-${type}`} style={StyleSheet.absoluteFill}>
            {/* Vertical Line Marker */}
            <Line
              x1={x}
              y1={paddingVertical}
              x2={x}
              y2={chartHeight - paddingVertical}
              stroke="#FFD700"
              strokeWidth="2"
              strokeDasharray="4"
            />
            {/* Highlighted Dot */}
            <Circle
              cx={x}
              cy={y}
              r="6"
              stroke="#FFD700"
              strokeWidth="2"
              fill="#FF4500"
            />
          </Svg>
        );
      } else if (type === "daily") {
        const numberOfSegments = data.labels.length - 1; // 7 segments for 8 labels
        const segmentWidth =
          (chartWidth - 2 * paddingHorizontal) / numberOfSegments;
        const clampedFraction = Math.min(currentTimeFraction, numberOfSegments);
        const x = paddingHorizontal + clampedFraction * segmentWidth;

        // Calculate interpolated y value
        const lowerIndex = Math.floor(clampedFraction);
        const upperIndex = Math.ceil(clampedFraction);
        const lowerValue = data.datasets[0].data[lowerIndex];
        const upperValue = data.datasets[0].data[upperIndex] || lowerValue; // Handle overflow
        const fraction = clampedFraction - lowerIndex;
        const interpolatedValue =
          lowerValue + (upperValue - lowerValue) * fraction;

        const maxValue = Math.max(...data.datasets[0].data);
        const minValue = Math.min(...data.datasets[0].data);
        const y =
          paddingVertical +
          ((maxValue - interpolatedValue) / (maxValue - minValue)) *
            (chartHeight - 2 * paddingVertical);

        return (
          <Svg key={`marker-${type}`} style={StyleSheet.absoluteFill}>
            {/* Vertical Line Marker */}
            <Line
              x1={x}
              y1={paddingVertical}
              x2={x}
              y2={chartHeight - paddingVertical}
              stroke="#FFD700"
              strokeWidth="2"
              strokeDasharray="4"
            />
            {/* Highlighted Dot */}
            <Circle
              cx={x}
              cy={y}
              r="6"
              stroke="#FFD700"
              strokeWidth="2"
              fill="#FF4500"
            />
          </Svg>
        );
      }
      return null;
    };

    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={Dimensions.get("window").width - 40} // Adjusted width for better fit
          height={180} // Increased height for better label visibility
          yAxisSuffix=" kWh"
          chartConfig={{
            backgroundColor: "#1F2A44",
            backgroundGradientFrom: "#1F2A44",
            backgroundGradientTo: "#1F2A44",
            decimalPlaces: 0,
            color: () => `rgba(255, 255, 255, 1)`,
            labelColor: () => `rgba(255, 255, 255, 1)`,
            yAxisWidth: 40, // Must match yAxisWidth in marker functions
            style: { borderRadius: 16 },
            propsForDots: {
              r: "4",
              strokeWidth: "1",
              stroke: "#FFFFFF",
            },
            propsForBackgroundLines: {
              stroke: "#444C5E",
            },
          }}
          bezier
          style={styles.chartStyle}
          onDataPointClick={handleDataPointClick}
          decorator={renderMarkers}
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

  /**
   * Generates the current period label for the Daily Chart
   * @param {array} labels - Array of label strings
   * @param {number} currentTimeFraction - Fractional index representing current time
   */
  const getCurrentPeriodLabel = (labels, currentTimeFraction) => {
    const lowerIndex = Math.floor(currentTimeFraction);
    const upperIndex = Math.ceil(currentTimeFraction);
    const lowerLabel = labels[lowerIndex] || labels[labels.length - 1];
    const upperLabel = labels[upperIndex] || labels[labels.length - 1];
    return `${lowerLabel}-${upperLabel}`;
  };

  /**
   * Calculates the current usage based on the fractional index
   * @param {array} data - Array of data points
   * @param {number} currentTimeFraction - Fractional index representing current time
   */
  const getCurrentUsage = (data, currentTimeFraction) => {
    const lowerIndex = Math.floor(currentTimeFraction);
    const upperIndex = Math.ceil(currentTimeFraction);
    const lowerValue = data[lowerIndex] || 0;
    const upperValue = data[upperIndex] || lowerValue;
    const fraction = currentTimeFraction - lowerIndex;
    const interpolatedValue = lowerValue + (upperValue - lowerValue) * fraction;
    return Math.round(interpolatedValue);
  };

  return (
    <Background>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.energySubtext}>PredictViz</Text>
          <View style={styles.currentTimeContainer}>
            <Icon name="calendar-clock" size={20} color="#FFD700" />
            <Text style={styles.currentTimeText}>{currentPeriod}</Text>
          </View>
        </View>

        {/* Weekly Overview Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <ChartWithTooltip
            data={chartDataWeekly}
            type="weekly"
            currentDayIndex={currentDayIndex}
          />
        </View>

        {/* Daily Breakdown Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          <ChartWithTooltip
            data={chartDataDaily}
            type="daily"
            currentTimeFraction={currentTimeFraction}
          />
        </View>

        <View style={styles.insightsContainer}>
          <View style={styles.insightItem}>
            <Text style={styles.boldText}>Predicted Spending:</Text>
            <Text style={styles.valueText}>$50</Text>
            <Text style={styles.boldText}>Actual Spending:</Text>
            <Text style={styles.valueText}>$60</Text>
          </View>
          <View style={styles.insightItem}></View>
          <View style={styles.insightItem}></View>
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
  },
  insightsContainer: {
    marginTop: 10,
    marginLeft: 5,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  insightText: {
    fontSize: 12,
    marginVertical: 0,
    color: "#fff",
  },
  boldText: {
    fontWeight: "bold",
    color: "#fff",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745", // Green color for values
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
    backgroundColor: "rgba(31, 42, 68, 0.8)",
    padding: 4,
    borderRadius: 25,
    zIndex: 2,
    elevation: 5,
  },
  energySubtext: {
    fontSize: 24, // Adjusted for better fit
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
    marginTop: 5,
  },
  currentTimeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "rgba(31, 42, 68, 0.7)", // Dark background for contrast
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20, // Adjusted for better fit
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
  tooltip: {
    position: "absolute",
    width: 100,
    padding: 8,
    backgroundColor: "rgba(119, 119, 119, 0.7)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  insightsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
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
    borderTopColor: "rgba(119, 119, 119, 0.7)",
  },
});

export default PredictViz;
