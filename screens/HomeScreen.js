import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
} from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialIcons";

import Background from "../components/Background";
import { useRoute } from "@react-navigation/native";
import { parse } from "react-native-svg";

const HomeScreen = ({ navigation }) => {
  const route = useRoute();
  const {
    rooms,
    homeType,
    squareFootage,
    occupants,
    dailyUsage,
    energySource,
    energyPreferences,
  } = route.params || {}; // Add a fallback to avoid undefined error

  const [energyUsage, setEnergyUsage] = useState(0);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [dataView, setDataView] = useState("hourly");
  const [classification, setClassification] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [devices, setDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 8 }, (_, i) => `${i * 10} sec`),
    datasets: [
      {
        data: Array(8).fill(0),
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://34.87.202.191:4000/fake");
        const data = response.data;

        setEnergyUsage(data.predicted_cumsum.toFixed(2));
        setClassification(data.classification);
        updateChartData(data.timestamp, data.predicted_cumsum);
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 200 range
          console.error("Server Error:", error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error("Network Error:", error.request);
        } else {
          // Something else happened
          console.error("Error:", error.message);
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const updateChartData = (timestamp, newDataPoint) => {
    // Parse the timestamp to extract the time part
    const timeObj = new Date(timestamp);
    timeObj.setHours(timeObj.getHours() - 10);

    const hours = timeObj.getHours().toString().padStart(2, "0");
    const minutes = timeObj.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    setChartData((prevState) => {
      const newData = [...prevState.datasets[0].data.slice(1), newDataPoint];
      const newLabels = [...prevState.labels.slice(1), formattedTime];

      return {
        labels: newLabels,
        datasets: [{ data: newData }],
      };
    });
  };

  const handleRoomClick = (roomIndex) => {
    setSelectedRoom("Room " + (parseInt(roomIndex) + 1));
    // Fake list of devices for demonstration
    const fakeDevices = [
      { name: "Light", status: "On" },
      { name: "Fan", status: "Off" },
      { name: "TV", status: "On" },
    ];
    setDevices(fakeDevices);
    setModalVisible(true);
  };

  const handleOtherRoomClick = (room) => {
    setSelectedRoom(room);
    // Fake list of devices for demonstration
    const fakeDevices = [
      { name: "Light", status: "On" },
      { name: "Fan", status: "Off" },
      { name: "TV", status: "On" },
    ];
    setDevices(fakeDevices);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderRooms = () => {
    const roomComponents = [];
    for (let i = 0; i < parseInt(rooms); i++) {
      roomComponents.push(
        <TouchableOpacity
          key={i}
          style={styles.roomContainer}
          onPress={() => handleRoomClick(i)}
        >
          <Text style={styles.roomText}>Room {i + 1}</Text>
        </TouchableOpacity>
      );
    }
    return roomComponents;
  };

  const renderOccupants = () => {
    const occupantComponents = [];
    for (let i = 0; i < parseInt(occupants); i++) {
      occupantComponents.push(
        <View key={i} style={styles.occupantContainer}>
          <Text style={styles.occupantText}>Occupant {i + 1}</Text>
        </View>
      );
    }
    return occupantComponents;
  };

  const renderViewIndicator = () => (
    <View style={styles.viewIndicator}>
      <View
        style={[
          styles.indicatorDot,
          dataView === "hourly" ? styles.activeDot : styles.inactiveDot,
        ]}
      />
      <View
        style={[
          styles.indicatorDot,
          dataView === "weekly" ? styles.activeDot : styles.inactiveDot,
        ]}
      />
    </View>
  );

  return (
    <Background>
      <TouchableWithoutFeedback onPress={() => setSelectedDataPoint(null)}>
        <ScrollView style={styles.container}>
          <TouchableOpacity
            style={styles.settingsIcon}
            onPress={() => navigation.navigate("Settings")}
          >
            <Icon name="settings" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.energyInfoContainer}>
              <Text style={styles.homeTypeSubtext}>{homeType}</Text>

              <Text style={styles.energySubtext}>Cumulative Usage: </Text>
              <View style={styles.energyUsageRow}>
                <Text style={styles.energyText}>{energyUsage} kWh</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              {dataView === "hourly" ? "Hourly" : "Weekly"} Energy Usage
            </Text>
            <Text style={styles.chartDate}>
              {new Date().toLocaleDateString()}
            </Text>
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 40}
              height={260} // Increase height for better visibility
              yAxisLabel=""
              yAxisSuffix=" kWh"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 2, // Adjust decimal places
                color: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: "#1F2A44" },
                formatYLabel: (yValue) => `${yValue.toFixed(2)} kWh`, // Format y-axis labels
                gridColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`, // Grid color
                borderColor: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`, // Border color
              }}
              bezier
              style={styles.chartStyle}
              onDataPointClick={(data) => {
                setSelectedDataPoint(data);
              }}
              decorator={() => {
                if (!selectedDataPoint) return null;

                return (
                  <View
                    style={[
                      styles.tooltipContainer,
                      {
                        left: selectedDataPoint.x - 35,
                        top: selectedDataPoint.y - 40,
                      },
                    ]}
                  >
                    <Text style={styles.tooltipText}>
                      {chartData.labels[selectedDataPoint.index]}:{" "}
                      {selectedDataPoint.value} kWh
                    </Text>
                  </View>
                );
              }}
            />
            {renderViewIndicator()}
          </View>

          <View style={styles.roomListContainer}>
            <Text style={styles.sectionTitle}>Bedrooms</Text>
            {renderRooms()}
          </View>

          {/* POP UP WINDOW */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.popupSectionTitle}>
                      Devices in {selectedRoom}
                    </Text>
                    {devices.map((device, index) => (
                      <View key={index} style={styles.deviceContainer}>
                        <Text style={styles.deviceText}>{device.name}</Text>
                        <Text style={styles.deviceStatus}>{device.status}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Other Rooms</Text>
            <View style={styles.quickActionsGrid}>
              {[
                { name: "bathtub", label: "Bathroom" },
                { name: "kitchen", label: "Kitchen" },
                { name: "bed", label: "Living Room" },
                { name: "more-horiz", label: "Other Room" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionItem}
                  onPress={() => handleOtherRoomClick(item.label)}
                >
                  <Icon name={item.name} size={25} color="#1F2A44" />
                  <Text style={styles.iconLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.occupantListContainer}>
            <Text style={styles.sectionTitle}>Occupants</Text>
            {renderOccupants()}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Background>
  );
};

const styles = StyleSheet.create({
  settingsIcon: {
    position: "absolute",
    top: 3,
    right: 20,
    zIndex: 1,
  },
  container: {
    marginTop: 50,
    minHeight: "100%",
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  energyInfoContainer: {
    marginTop: 10,
  },

  chartDate: {
    color: "#FFFFFF",
  },

  energyUsageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  energyText: {
    fontSize: 25,
    alignItems: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    // marginLeft: 10,
  },

  homeTypeSubtext: {
    fontSize: 35,
    marginTop: 10,
    marginBottom: 10,
    color: "white",
    marginTop: 5,
    fontWeight: "bold",
  },

  energySubtext: {
    fontSize: 30,
    // marginLeft: 10,
    marginBottom: 10,
    color: "white",
    marginTop: 5,
    fontWeight: "bold",
  },
  chartContainer: {
    marginTop: -20,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  chartStyle: {
    borderRadius: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
    marginLeft: 15,
  },
  quickActionsGrid: {
    flexDirection: "row",
    height: 100,
    justifyContent: "space-between",
    marginLeft: 15,
    marginRight: 15,
  },
  quickActionItem: {
    width: 60,
    height: 60,
    marginBottom: 0,
    backgroundColor: "#F0F3F8",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  customizeButton: {
    backgroundColor: "#1F2A44",
    padding: 15,
    borderRadius: 10,
    marginTop: 0,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  periodButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  selectedPeriodButton: {
    backgroundColor: "#1F2A44",
  },
  periodButtonText: {
    color: "#1F2A44",
    fontSize: 14,
  },
  tooltipContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
    borderRadius: 5,
    position: "absolute",
    width: 70,
    alignItems: "center",
  },
  tooltipText: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
  },
  viewIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },

  quickActionsContainer: {
    // marginLeft: 15,
    // marginRight: 15,
  },

  roomListContainer: {
    marginBottom: 20,
  },
  occupantListContainer: {
    marginBottom: 50,
  },
  roomContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  occupantContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  roomText: {
    fontSize: 16,
    color: "#333",
  },
  occupantText: {
    fontSize: 16,
    color: "#333",
  },
  deviceListContainer: {
    marginTop: 20,
  },
  deviceContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  deviceText: {
    fontSize: 16,
    color: "#333",
  },
  deviceStatus: {
    fontSize: 14,
    color: "#666",
  },

  scrollView: {
    flex: 1,
    width: "100%",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  popupSectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deviceContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deviceText: {
    fontSize: 16,
    color: "#333",
  },
  deviceStatus: {
    fontSize: 14,
    color: "#666",
  },
});

export default HomeScreen;
