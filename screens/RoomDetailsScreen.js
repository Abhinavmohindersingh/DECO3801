import React, { useState, useEffect, useContext } from "react";
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
import { AppContext } from "../AppContext"; // Adjust path

const RoomDetailsScreen = ({ route, navigation }) => {
  const { profileData } = useContext(AppContext);
  const { roomName } = route.params;

  // Devices for the selected room
  const selectedDevices = profileData.devices[roomName.toLowerCase()] || [];
  const allDevices = [
    { name: "TV", icon: "television", consumption: 0.4 },
    { name: "Lamp", icon: "lamp", consumption: 0.1 },
    { name: "Gaming Console", icon: "gamepad-variant", consumption: 0.2 },
    { name: "Sound System", icon: "speaker", consumption: 0.3 },
    { name: "Air Conditioner", icon: "air-conditioner", consumption: 1.8 },
    { name: "Light", icon: "lightbulb-on-outline", consumption: 0.1 },
  ];

  const devices = allDevices.filter((device) =>
    selectedDevices.includes(device.name)
  );

  const [runningDevices, setRunningDevices] = useState(
    devices.reduce((acc, device) => {
      acc[device.name] = true;
      return acc;
    }, {})
  );

  const [totalConsumption, setTotalConsumption] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  // Effect to calculate total consumption and update chart data
  useEffect(() => {
    let total = 0;
    const labels = [];
    const data = [];

    devices.forEach((device) => {
      const isActive = runningDevices[device.name];
      const consumption = isActive ? device.consumption : 0;
      total += consumption;

      labels.push(device.name);
      data.push(consumption);
    });

    // Only update state if necessary to prevent excessive re-renders
    if (total !== totalConsumption) {
      setTotalConsumption(total);
      setChartData({ labels, datasets: [{ data }] });
    }
  }, [runningDevices, devices, totalConsumption]);

  const toggleDevice = (deviceName) => {
    setRunningDevices((prev) => ({
      ...prev,
      [deviceName]: !prev[deviceName],
    }));
  };

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
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>{roomName} Usage</Text>

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
          {devices.map((device) => (
            <TouchableOpacity
              key={device.name}
              style={[
                styles.deviceItem,
                {
                  backgroundColor: runningDevices[device.name]
                    ? "rgba(76, 175, 80, 0.7)"
                    : "rgba(244, 67, 54, 0.7)",
                },
              ]}
              onPress={() => toggleDevice(device.name)}
            >
              <Icon name={device.icon} size={30} color="white" />
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceConsumption}>
                  {device.consumption} kWh/hr
                </Text>
              </View>
              <Text style={styles.deviceStatus}>
                {runningDevices[device.name] ? "ON" : "OFF"}
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
    top: 40,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent for better visibility
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
  deviceItem: {
    width: "48%",
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  deviceInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  deviceConsumption: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  deviceStatus: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
});

export default RoomDetailsScreen;
