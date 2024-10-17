import React, { useState, useEffect, useContext, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../AppContext";

const STORAGE_KEY = "@runningRoomsState";

const LiveUsage = () => {
  const navigation = useNavigation();
  const {
    consumptionHistory,
    setConsumptionHistory,
    saveConsumptionHistory,
    totalConsumptionKitchen,
    totalConsumptionLiving,
    totalConsumptionGarage,
    totalConsumptionLaundry,
    loading,
  } = useContext(AppContext);

  const rooms = [
    { name: "Room", icon: "bed", consumption: 1.5 },
    {
      name: "Kitchen",
      icon: "fridge",
      consumption: totalConsumptionKitchen ?? 0,
    },
    {
      name: "Living",
      icon: "sofa",
      consumption: totalConsumptionLiving
        ? parseFloat(totalConsumptionLiving).toFixed(2)
        : "0.00",
    },
    {
      name: "Garage",
      icon: "garage",
      consumption: totalConsumptionGarage
        ? parseFloat(totalConsumptionGarage).toFixed(2)
        : "0.00",
    },
    {
      name: "Laundry",
      icon: "washing-machine",
      consumption: totalConsumptionLaundry ?? 0,
    },
    { name: "Light", icon: "lightbulb-on-outline", consumption: 0.1 },
  ];

  const [runningRooms, setRunningRooms] = useState({});
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  // Functions to send data to the server (implement as needed)
  const sendZone = async (ledStatus) => {
    // Implement your server communication logic here
  };
  const sumReadings = useRef(0); // Cumulative sum of readings
  const countReadings = useRef(0); // Count of readings
  const intervalRef = useRef(null); // Reference to the 1-second interval
  const hourlyIntervalRef = useRef(null); // Reference to the 1-hour interval

  const totalConsumptionRef = useRef(totalConsumption);

  // Update the ref whenever totalConsumption changes
  useEffect(() => {
    totalConsumptionRef.current = totalConsumption;
  }, [totalConsumption]);

  // Capture totalConsumption every second
  useEffect(() => {
    if (loading) return; // Don't start if data is still loading

    intervalRef.current = setInterval(() => {
      const currentReading = totalConsumptionRef.current;
      sumReadings.current += currentReading;
      countReadings.current += 1;
      console.log(`Current Total Consumption: ${currentReading} kWh/hr`);
    }, 1000); // Every second

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [loading]);

  // Calculate hourly average every hour (3600 seconds)
  useEffect(() => {
    if (loading) return; // Don't start if data is still loading

    hourlyIntervalRef.current = setInterval(() => {
      if (countReadings.current === 0) return;

      const average = parseFloat(
        (sumReadings.current / countReadings.current).toFixed(2)
      );

      // Update consumptionHistory with the average
      setConsumptionHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, average];
        // Keep only the last 14 hours
        if (updatedHistory.length > 14) {
          updatedHistory.shift();
        }
        return updatedHistory;
      });

      // Optionally, send the average to the server
      sendTotalConsumptionToServer(average);

      // Reset the sum and count
      sumReadings.current = 0;
      countReadings.current = 0;
    }, 3600000); // Every hour (3600000 ms)

    return () => clearInterval(hourlyIntervalRef.current); // Cleanup on unmount
  }, [loading, setConsumptionHistory]);
  const sendTotalConsumptionToServer = async (total) => {
    try {
      // Get current time in 24-hour format: YYYY-MM-DD HH:mm:ss
      const currentTime = new Date()
        .toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", ""); // Remove the comma between date and time

      // Prepare the data to be sent
      const dataToSend = {
        current_time: currentTime, // current timestamp in 24-hour format
        Global_active_power: total, // total consumption value
      };

      console.log(
        "JSON format being sent to the server:",
        JSON.stringify(dataToSend, null, 2)
      ); // Log the JSON format

      // Send the data to the server
      const response = await fetch("http://34.87.202.191:4000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the JSON data
      });

      // Get and log the server's response
      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error sending data to server:", error); // Log any errors
    }
  };

  // Save running rooms state to AsyncStorage
  const saveRunningRoomsState = async (state) => {
    try {
      const jsonValue = JSON.stringify(state);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save state.", e);
    }
  };

  // Load running rooms state from AsyncStorage
  const loadRunningRoomsState = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Failed to load state.", e);
      return null;
    }
  };

  // Load initial running rooms state
  useEffect(() => {
    const loadInitialState = async () => {
      const savedState = await loadRunningRoomsState();
      if (savedState) {
        setRunningRooms(savedState);
      } else {
        // Initialize all rooms as OFF
        const initialState = rooms.reduce((acc, room) => {
          acc[room.name] = false;
          return acc;
        }, {});
        setRunningRooms(initialState);
      }
    };

    loadInitialState();
  }, []);

  // Update total consumption and chart data when runningRooms changes
  useEffect(() => {
    let total = 0;
    const labels = [];
    const data = [];
    const ledStatus = {};

    rooms.forEach((room) => {
      const isActive = runningRooms[room.name];
      const consumption = isActive ? parseFloat(room.consumption) : 0;
      total += consumption;

      if (isActive) {
        labels.push(room.name);
        data.push(consumption);
      }

      ledStatus[room.name] = isActive ? 1 : 0;
    });

    setTotalConsumption(total);
    setChartData({ labels, datasets: [{ data }] });
    saveRunningRoomsState(runningRooms);

    if (total > 0) {
      sendTotalConsumptionToServer(total);
      sendZone(ledStatus);
    }
  }, [runningRooms]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProfileData = await AsyncStorage.getItem(PROFILE_DATA_KEY);
        const savedConsumptionHistory = await AsyncStorage.getItem(
          CONSUMPTION_HISTORY_KEY
        );
        const savedEnergyLimit = await AsyncStorage.getItem(ENERGY_LIMIT_KEY);
        const savedBillingCycle = await AsyncStorage.getItem(BILL_CYCLE_KEY);

        const savedKitchenConsumption = await AsyncStorage.getItem(
          CONSUMPTION_KITCHEN_KEY
        );
        const savedLivingConsumption = await AsyncStorage.getItem(
          CONSUMPTION_LIVING_KEY
        );
        const savedLaundryConsumption = await AsyncStorage.getItem(
          CONSUMPTION_LAUNDRY_KEY
        );
        const savedGarageConsumption = await AsyncStorage.getItem(
          CONSUMPTION_GARAGE_KEY
        );

        if (savedProfileData) {
          setProfileData(JSON.parse(savedProfileData));
        }
        if (savedConsumptionHistory) {
          setConsumptionHistory(JSON.parse(savedConsumptionHistory));
        }
        if (savedEnergyLimit) {
          setEnergyLimit(parseFloat(savedEnergyLimit));
        }
        if (savedBillingCycle) {
          setBillingCycle(parseInt(savedBillingCycle, 10));
        }

        // Load and set total consumption values
        if (savedKitchenConsumption) {
          setTotalConsumptionKitchen(parseFloat(savedKitchenConsumption));
        }
        if (savedLivingConsumption) {
          setTotalConsumptionLiving(parseFloat(savedLivingConsumption));
        }
        if (savedLaundryConsumption) {
          setTotalConsumptionLaundry(parseFloat(savedLaundryConsumption));
        }
        if (savedGarageConsumption) {
          setTotalConsumptionGarage(parseFloat(savedGarageConsumption));
        }
      } catch (e) {
        console.error("Failed to load data.", e);
      }
    };
    loadData();
  }, []);

  // **Storing Total Consumption Every 5 Minutes**
  useEffect(() => {
    const interval = setInterval(() => {
      const currentConsumption = totalConsumption;

      // Update history by appending the current consumption
      const updatedHistory = [...consumptionHistory, currentConsumption];

      // Ensure the history array has a maximum of 24 entries
      if (updatedHistory.length > 24) {
        updatedHistory.shift(); // Remove the oldest entry
      }

      // Update context state and persist it
      setConsumptionHistory(updatedHistory);
      // saveConsumptionHistory(updatedHistory);
    }, 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Clean up on unmount
  }, [
    totalConsumption,
    consumptionHistory,
    setConsumptionHistory,
    // saveConsumptionHistory,
  ]);

  // const toggleRoom = (roomName) => {
  //   setRunningRooms((prev) => ({
  //     ...prev,
  //     [roomName]: !prev[roomName],
  //   }));
  // };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
    strokeWidth: 2,
    fontWeight: 700,
    barPercentage: 0.8,
  };

  // Function to get the current consumption of a room
  const getCurrentConsumption = (room) => {
    return runningRooms[room.name] ? parseFloat(room.consumption) : 0;
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
          <Icon name="flash-outline" size={40} color="#FFD700" />
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
                  backgroundColor:
                    parseFloat(room.consumption) === 0
                      ? "rgba(76, 175, 80, 0.2)" // Green for 0 consumption
                      : parseFloat(room.consumption) <= 2
                      ? "rgba(76, 175, 80, 0.7)" // Green for optimal usage
                      : parseFloat(room.consumption) <= 3.7
                      ? "rgba(255, 235, 59, 0.7)" // Yellow for moderate usage
                      : "rgba(244, 67, 54, 0.7)", // Red for high usage
                },
              ]}
            >
              <Icon name={room.icon} size={30} color="white" />
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomConsumption}>
                  {parseFloat(room.consumption).toFixed(2)} kWh/hr
                </Text>
              </View>
              <Text style={styles.roomStatus}>
                {parseFloat(room.consumption) <= 0
                  ? " No Usage"
                  : parseFloat(room.consumption) <= 2
                  ? " Optimal"
                  : parseFloat(room.consumption) <= 3.7
                  ? "High"
                  : "Very High"}
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
    fontSize: 24, // Adjusted for better fit
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 10,
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
