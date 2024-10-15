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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

// Rooms data
const rooms = [
  { name: "Room1", icon: "bed", consumption: 1.5 },
  { name: "Room2", icon: "bed-outline", consumption: 1.2 },
  { name: "Kitchen", icon: "fridge", consumption: 2.1 },
  { name: "Living", icon: "sofa", consumption: 1.8 },
  { name: "Garage", icon: "garage", consumption: 0.9 },
  { name: "Laundry", icon: "washing-machine", consumption: 1.7 }, // Added Laundry
];

const STORAGE_KEY = "@runningRoomsState"; // Key to store the state in AsyncStorage

const LiveUsage = () => {
  const navigation = useNavigation();
  const [runningRooms, setRunningRooms] = useState({});
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  // Save runningRooms state to AsyncStorage
  const saveRunningRoomsState = async (state) => {
    try {
      const jsonValue = JSON.stringify(state);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save state.", e);
    }
  };

  // Load runningRooms state from AsyncStorage
  const loadRunningRoomsState = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Failed to load state.", e);
    }
  };

  useEffect(() => {
    const loadInitialState = async () => {
      const savedState = await loadRunningRoomsState();
      if (savedState) {
        setRunningRooms(savedState);
      } else {
        // If no saved state, simulate random rooms being active/inactive
        const initialState = rooms.reduce((acc, room) => {
          acc[room.name] = Math.random() < 0.5;
          return acc;
        }, {});
        setRunningRooms(initialState);
      }
    };

    loadInitialState();
  }, []);

  useEffect(() => {
    // Calculate total consumption and update chart data
    let total = 0;
    const labels = [];
    const data = [];

    rooms.forEach((room) => {
      const isActive = runningRooms[room.name];
      const consumption = isActive ? room.consumption : 0;
      total += consumption;

      if (isActive) {
        labels.push(room.name);
        data.push(consumption);
      }
    });

    setTotalConsumption(total);
    setChartData({ labels, datasets: [{ data }] });

    // Save the running rooms state after every change
    saveRunningRoomsState(runningRooms);
  }, [runningRooms]);

  // Toggle the status of a room (ON/OFF)
  const toggleRoom = (roomName) => {
    setRunningRooms((prev) => ({
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
        onPress={() => navigation.navigate("FlowerPot", { totalConsumption })}
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

        <View style={styles.roomsContainer}>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.name}
              style={[
                styles.roomItem,
                {
                  backgroundColor: runningRooms[room.name]
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
              <Text style={styles.roomStatus}>
                {runningRooms[room.name] ? "ON" : "OFF"}
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
  roomsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  roomItem: {
    width: "48%",
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
  roomStatus: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
});

export default LiveUsage;
