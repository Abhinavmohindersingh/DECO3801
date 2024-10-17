import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppContext } from "../AppContext";
import Background from "../components/Background";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SpendingScreen = () => {
  const navigation = useNavigation();
  const { profileData, consumptionHistory } = useContext(AppContext);
  const occupants = parseFloat(profileData.occupants) || 1;

  const [storedLimit, setStoredLimit] = useState(null);
  const [storedCycle, setStoredCycle] = useState(null);
  const [tipVisible, setTipVisible] = useState(false);

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        const savedLimit = await AsyncStorage.getItem("energyLimit");
        const savedCycle = await AsyncStorage.getItem("billCycle");
        if (savedLimit !== null) {
          setStoredLimit(parseFloat(savedLimit));
        }
        if (savedCycle !== null) {
          setStoredCycle(parseInt(savedCycle, 10));
        }
      } catch (error) {
        console.error("Error loading budget data from storage:", error);
      }
    };
    loadBudgetData();
  }, []);

  const POINT_WIDTH = 60;
  const chartHeight = 300;
  const TOTAL_HOURS = 20;

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
      labels.push(`${hour}:00 ${ampm}`);
    }
    return labels;
  };

  const labels = generateLabels();

  const paddedData = useMemo(() => {
    const data = consumptionHistory.slice(-TOTAL_HOURS);
    const padding = TOTAL_HOURS - data.length;
    return padding > 0 ? Array(padding).fill(0).concat(data) : data;
  }, [consumptionHistory]);

  const spendingData = paddedData.map((consumption) =>
    (consumption * occupants).toFixed(2)
  );

  const { peakSpending, peakPeriod, averageSpending, totalSpending } =
    useMemo(() => {
      if (spendingData.length === 0) {
        return {
          peakSpending: 0,
          peakPeriod: "N/A",
          averageSpending: 0,
          totalSpending: 0,
        };
      }

      const numericSpendingData = spendingData.map(Number);
      const peakValue = Math.max(...numericSpendingData);
      const peakIndex = numericSpendingData.indexOf(peakValue);
      const peakTime = labels[peakIndex] || "N/A";
      const total = numericSpendingData.reduce((a, b) => a + b, 0);
      const average = total / numericSpendingData.length;

      return {
        peakSpending: peakValue,
        peakPeriod: peakTime,
        averageSpending: average,
        totalSpending: total,
      };
    }, [spendingData, labels]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: spendingData,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Energy Spending ($)"],
  };

  const chartConfig = {
    backgroundGradientFrom: "#1F2A44",
    backgroundGradientTo: "#1F2A44",
    decimalPlaces: 2,
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
    formatXLabel: (value) => value,
    propsForBackgroundLines: {
      stroke: "#444C5E",
    },
  };

  const ChartWithTooltip = ({ data, labels }) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({
      x: 0,
      y: 0,
    });
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleDataPointClick = (dataPoint) => {
      const { x, y, index, value } = dataPoint;

      setTooltipData({
        label: labels[index],
        value,
      });
      setTooltipPosition({ x, y });
      setTooltipVisible(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    useEffect(() => {
      if (!tooltipVisible) {
        fadeAnim.setValue(0);
      }
    }, [tooltipVisible, fadeAnim]);

    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={TOTAL_HOURS * POINT_WIDTH}
          height={chartHeight}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
          onDataPointClick={handleDataPointClick}
          fromZero={true}
        />

        {tooltipVisible && tooltipData && (
          <Animated.View
            accessible={true}
            accessibilityLabel={`${tooltipData.label}: $${tooltipData.value}`}
            style={[
              styles.tooltip,
              {
                left: tooltipPosition.x - 60,
                top: tooltipPosition.y - 10,
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.tooltipText}>{tooltipData.label}</Text>
            <Text style={styles.tooltipValue}>${tooltipData.value}</Text>
            <View style={styles.tooltipArrow} />
          </Animated.View>
        )}
      </View>
    );
  };

  const renderEnergyInfo = () => (
    <View style={styles.tipContainer}>
      <Text style={styles.tipText}>
        • The insights section summarizes key information: {"\n"}-{" "}
        <Text style={styles.boldText}>Average Spending:</Text> Your average
        energy expenditure over time. {"\n"}-{" "}
        <Text style={styles.boldText}>Total Spending:</Text> The total amount
        you've spent so far. {"\n"}-{" "}
        <Text style={styles.boldText}>Peak Spending:</Text> The highest amount
        spent in a single period.
      </Text>
    </View>
  );

  return (
    <Background>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <Icon name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spending Overview</Text>
          <View style={styles.currentTimeContainer}>
            <Icon name="clock-time-four" size={20} color="#FFD700" />
            <Text style={styles.currentTimeText}>
              {labels[labels.length - 1] || "00:00"}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Spending History ($)</Text>
          {spendingData.length > 0 ? (
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 20,
              }}
              showsHorizontalScrollIndicator={false}
            >
              <ChartWithTooltip data={chartData} labels={labels} />
            </ScrollView>
          ) : (
            <View style={styles.noDataContainer}>
              <Icon name="alert-circle-outline" size={50} color="#FFD700" />
              <Text style={styles.noDataText}>No spending data available.</Text>
            </View>
          )}
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Insights</Text>
          {spendingData.length > 0 ? (
            <>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Total Spending:</Text> $
                {totalSpending.toFixed(2)}
              </Text>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Peak Spending:</Text> $
                {peakSpending.toFixed(2)}
              </Text>
              <Text style={styles.insightText}>
                <Text style={styles.boldText}>Average Spending:</Text> $
                {averageSpending.toFixed(2)}
              </Text>

              {storedLimit && storedCycle && (
                <>
                  <Text style={styles.insightText}>
                    <Text style={styles.boldText}>Energy Limit:</Text> $
                    {storedLimit.toFixed(2)}
                  </Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.boldText}>Billing Cycle:</Text>{" "}
                    {storedCycle} weeks
                  </Text>
                </>
              )}
            </>
          ) : (
            <Text style={styles.insightText}>No data to display insights.</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.tipButton}
          onPress={() => setTipVisible(!tipVisible)}
          accessibilityLabel="Toggle Info"
        >
          <Icon name="lightbulb-on" size={20} color="#FFF" />
          <Text style={styles.tipButtonText}>Information</Text>
        </TouchableOpacity>

        {tipVisible && renderEnergyInfo()}
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginLeft: 15,
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
    width: 100, // Reduced width for smaller tooltip
    padding: 8, // Reduced padding for smaller tooltip
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
    marginTop: 4, // Reduced margin for compactness
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

export default SpendingScreen;
