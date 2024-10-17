import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
  FlatList,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BarChart } from "react-native-chart-kit";
import { AppContext } from "../AppContext"; // Adjust the path as needed

const LaundryUsage = ({ navigation }) => {
  const { profileData, setProfileData, setTotalConsumptionLaundry } =
    useContext(AppContext);
  const selectedDevices = profileData.devices.laundry || [];

  const allDevices = [
    { name: "Washing Machine", icon: "washing-machine", consumption: 1.0 },
    { name: "Dryer", icon: "tumble-dryer", consumption: 2.0 },
    { name: "Iron", icon: "iron", consumption: 0.8 },
    { name: "Steam Press", icon: "iron-outline", consumption: 0.7 },
    { name: "Fabric Steamer", icon: "spray", consumption: 0.5 },
    { name: "Light", icon: "lightbulb", consumption: 0.1 },
  ];

  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [runningDevices, setRunningDevices] = useState({});
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const devices = useMemo(
    () => allDevices.filter((device) => selectedDevices.includes(device.name)),
    [selectedDevices]
  );

  const saveState = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        "laundryRunningDevices",
        JSON.stringify(runningDevices)
      );
    } catch (error) {
      console.error("Error saving state:", error);
    }
  }, [runningDevices]);

  const loadState = useCallback(async () => {
    try {
      const savedRunningDevices = await AsyncStorage.getItem(
        "laundryRunningDevices"
      );
      if (savedRunningDevices !== null) {
        setRunningDevices(JSON.parse(savedRunningDevices));
      } else {
        // Initialize state if no saved state exists
        const initialState = devices.reduce((acc, device) => {
          acc[device.name] = true;
          return acc;
        }, {});
        setRunningDevices(initialState);
      }
    } catch (error) {
      console.error("Error loading state:", error);
    }
  }, [devices]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    saveState();
  }, [runningDevices, saveState]);

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

    setTotalConsumption(total);
    setChartData({ labels, datasets: [{ data }] });
    setTotalConsumptionLaundry(total);
  }, [runningDevices, devices, setTotalConsumptionLaundry]);

  const toggleDevice = useCallback((deviceName) => {
    setRunningDevices((prev) => ({
      ...prev,
      [deviceName]: !prev[deviceName],
    }));
  }, []);

  const handleAddDevice = () => {
    setShowAddDeviceModal(true);
  };

  const toggleDeviceSelection = useCallback(
    (deviceName) => {
      setProfileData((prevData) => {
        const updatedDevices = { ...prevData.devices };
        const deviceList = updatedDevices.laundry || [];

        if (deviceList.includes(deviceName)) {
          updatedDevices.laundry = deviceList.filter(
            (name) => name !== deviceName
          );
        } else {
          updatedDevices.laundry = [...deviceList, deviceName];
        }

        return { ...prevData, devices: updatedDevices };
      });
    },
    [setProfileData]
  );

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
        <Text style={styles.title}>Laundry Usage</Text>

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

          <TouchableOpacity
            style={styles.addDeviceItem}
            onPress={handleAddDevice}
          >
            <Icon name="plus" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showAddDeviceModal && (
        <Modal
          visible={showAddDeviceModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddDeviceModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Devices</Text>
              <FlatList
                data={allDevices}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <View style={styles.modalItem}>
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    <Switch
                      value={selectedDevices.includes(item.name)}
                      onValueChange={() => toggleDeviceSelection(item.name)}
                    />
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setShowAddDeviceModal(false)}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  addDeviceItem: {
    width: "48%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#333",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  modalItemText: {
    color: "#fff",
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LaundryUsage;
