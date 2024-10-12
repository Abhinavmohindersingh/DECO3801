import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BarChart } from "react-native-chart-kit";
import FlowerPot from "./FlowerPot";
import { useNavigation } from "@react-navigation/native";

const devices = [
  { name: "Fridge", icon: "fridge", consumption: 0.8 },
  { name: "Oven", icon: "stove", consumption: 1.5 },
  { name: "DishWash", icon: "dishwasher", consumption: 1.2 },
  { name: "Microwave", icon: "microwave", consumption: 1.0 },
  { name: "Toaster", icon: "toaster", consumption: 0.5 },
];

const KitchenUsage = ({ navigation }) => {
  const [runningdevices, setRunningdevices] = useState({});
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    // Simulate random devices being active/inactive
    const initialState = devices.reduce((acc, room) => {
      acc[room.name] = Math.random() < 0.5;
      return acc;
    }, {});
    setRunningdevices(initialState);
  }, []);

  useEffect(() => {
    // Calculate total consumption and update chart data
    let total = 0;
    const labels = [];
    const data = [];

    devices.forEach((room) => {
      const isActive = runningdevices[room.name];
      const consumption = isActive ? room.consumption : 0;
      total += consumption;

      if (isActive) {
        labels.push(room.name);
        data.push(consumption);
      }
    });

    setTotalConsumption(total);
    setChartData({ labels, datasets: [{ data }] });
  }, [runningdevices]);

  // Toggle the status of a room (ON/OFF)
  const toggleRoom = (roomName) => {
    setRunningdevices((prev) => ({
      ...prev,
      [roomName]: !prev[roomName],
    }));
  };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <ImageBackground
      source={require("../icons/background.jpeg")}
      style={styles.background}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("FlowerPot")}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Live Energy Usage</Text>

        <View style={styles.totalConsumption}>
          <Icon name="lightning-bolt" size={40} color="#FFD700" />
          <Text style={styles.totalConsumptionText}>
            {totalConsumption.toFixed(2)} kWh/hr
          </Text>
        </View>

        {chartData.labels.length > 0 && (
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={Dimensions.get("window").width - 30}
              height={200}
              yAxisLabel=""
              yAxisSuffix=" kWh"
              borderRadius={16}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero={true}
              style={styles.chart}
            />
          </View>
        )}

        <View style={styles.devicesContainer}>
          {devices.map((room) => (
            <TouchableOpacity
              key={room.name}
              style={[
                styles.roomItem,
                {
                  backgroundColor: runningdevices[room.name]
                    ? "rgba(76, 175, 80, 0.7)"
                    : "rgba(244, 67, 54, 0.7)",
                },
              ]}
              onPress={() => toggleRoom(room.name)}
            >
              <Icon name={room.icon} size={30} color="white" />
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomConsumption}>
                  {room.consumption} kWh/hr
                </Text>
              </View>
              <Text style={styles.devicestatus}>
                {runningdevices[room.name] ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    marginTop: 30,
    flex: 1,
    padding: 10,
  },

  backButton: {
    position: "absolute",
    top: 40, // Position it at the top
    left: 10, // Adjust to your preference
    backgroundColor: "blue", // Blue background
    padding: 10,
    borderRadius: 20,
    width: 50,
    zIndex: 1,
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  totalConsumption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginBottom: 0,
    borderColor: "#fff",
  },
  totalConsumptionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  chartContainer: {
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    paddingLeft: 5,
    borderColor: "#fff",
  },
  chart: {
    borderRadius: 16,
  },
  devicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  roomItem: {
    width: "48%", // Adjust as needed to fit two items per row with some spacing
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  roomInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  roomConsumption: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  devicestatus: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
});

export default KitchenUsage;
