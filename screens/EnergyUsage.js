import React, { useState, useEffect } from "react";
import axios from "axios";
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

var count = 0;

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

  const [chartDataHourly, setChartDataHourly] = useState({
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

  const [barChartDataHourly, setBarChartDataHourly] = useState({
    labels: ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
    datasets: [
      {
        data: [10, 30, 15, 50, 35, 40, 20, 60],
      },
    ],
  });

  const predictedCumsumArray = [2, 4, 6, 8, 4, 10];

  useEffect(() => {
    const dataIntervalId = setInterval(updateChartData, 3000);
    const serverIntervalId = setInterval(sendDataToServer, 3000);

    return () => {
      clearInterval(dataIntervalId);
      clearInterval(serverIntervalId);
    };
  }, []);

  const sendDataToServer = async () => {
    const predicted_cumsum =
      predictedCumsumArray[count % predictedCumsumArray.length];
    const data = {
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      predicted_cumsum: predicted_cumsum,
    };

    try {
      await axios.post("http://34.40.131.213:4000/fake", data);
      console.log("Data sent:", data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const updateChartData = () => {
    setChartDataWeekly((prevState) => {
      const newData = [
        ...prevState.datasets[0].data.slice(1),
        predictedCumsumArray[count],
      ];
      setEnergyUsage(predictedCumsumArray[count]);
      count = (count + 1) % predictedCumsumArray.length;

      return {
        labels: prevState.labels,
        datasets: [{ data: newData }],
      };
    });

    setChartDataHourly((prevState) => {
      const newData = [
        ...prevState.datasets[0].data.slice(1),
        predictedCumsumArray[count],
      ];
      return {
        labels: prevState.labels,
        datasets: [{ data: newData }],
      };
    });

    setBarChartDataWeekly((prevState) => {
      const newData = [
        ...prevState.datasets[0].data.slice(1),
        predictedCumsumArray[count],
      ];
      return {
        labels: prevState.labels,
        datasets: [{ data: newData }],
      };
    });

    setBarChartDataHourly((prevState) => {
      const newData = [
        ...prevState.datasets[0].data.slice(1),
        predictedCumsumArray[count],
      ];
      return {
        labels: prevState.labels,
        datasets: [{ data: newData }],
      };
    });
  };

  return (
    <Background>
      <TouchableWithoutFeedback>
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.energySubtext}>Today's Usage</Text>
            <View style={styles.energyUsageRow}>
              <Icon name="lightning-bolt" size={50} color="white" />
              <Text style={styles.energyText}>: {energyUsage} kWh</Text>
            </View>
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

          {/* Hourly Energy Usage Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Hourly Energy Usage</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            >
              {/* Hourly Line Chart */}
              <View style={styles.chartContainer}>
                <LineChart
                  data={chartDataHourly}
                  width={Dimensions.get("window").width - 40}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=" kWh"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              </View>

              {/* Hourly Bar Chart */}
              <View style={styles.chartContainer}>
                <BarChart
                  data={barChartDataHourly}
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

      {/* Footer with button to go back to the Flowerpot screen */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("FlowerPot")}
          style={styles.wideButton}
        >
          <Icon name="arrow-left" size={50} width={80} color="white" />
        </TouchableOpacity>
      </View>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  energyUsageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  energyText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  energySubtext: {
    marginTop: 15,
    marginLeft: 10,
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  sectionContainer: {},
  sectionTitle: {
    marginLeft: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 0,
  },
  chartContainer: {
    paddingLeft: 20,
    paddingBottom: 20,
    width: Dimensions.get("window").width, // Make sure each chart takes full width
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
});

export default EnergyUsage;
