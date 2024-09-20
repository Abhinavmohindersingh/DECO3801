import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialIcons";

import Background from "../components/Background";
import { useRoute } from "@react-navigation/native";

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

  // Log the received data
  // console.log("Received data:", {
  //   rooms,
  //   homeType,
  //   squareFootage,
  //   occupants,
  //   dailyUsage,
  //   energySource,
  //   energyPreferences,
  // });

  const [energyUsage, setEnergyUsage] = useState(0);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [dataView, setDataView] = useState("hourly");
  const [classification, setClassification] = useState(0);
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

        // console.log("Fetched data:", data); // Log the fetched data

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

      console.log("Updated chart data:", {
        labels: newLabels,
        datasets: [{ data: newData }],
      }); // Log the updated chart data

      return {
        labels: newLabels,
        datasets: [{ data: newData }],
      };
    });
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
              <Text style={styles.energySubtext}>Cumulative Usage: </Text>
              <View style={styles.energyUsageRow}>
                {/* <Icon name="lightning-bolt" size={70} color="white" /> */}
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

          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {[
                { name: "living", label: "Rooms" },
                { name: "garage", label: "Garage" },
                { name: "kitchen", label: "Kitchen" },
                { name: "bed", label: "Living Rooms" },
              ].map((item, index) => (
                <TouchableOpacity key={index} style={styles.quickActionItem}>
                  <Icon name={item.name} size={25} color="#1F2A44" />
                  <Text style={styles.iconLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.customizeButton}
            onPress={() => navigation.navigate("")}
          >
            <Text style={styles.buttonText}>Customize Energy Plan</Text>
          </TouchableOpacity>
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
    flex: 1,
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
  energySubtext: {
    fontSize: 30,
    // marginLeft: 10,
    marginBottom: 20,
    color: "white",
    marginTop: 5,
    fontWeight: "bold",
  },
  chartContainer: {
    opacity: 0.98,
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
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: "row",
    height: 100,
    justifyContent: "space-between",
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
});

export default HomeScreen;
