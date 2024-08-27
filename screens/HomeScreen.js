import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Background from "../components/Background";

const HomeScreen = ({ navigation }) => {
  const [energyUsage, setEnergyUsage] = useState(0);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [dataView, setDataView] = useState("weekly"); // 'hourly' or 'weekly'

  useEffect(() => {
    mockFetchData();
  }, []);

  const mockFetchData = () => {
    const usage = Math.floor(Math.random() * 100);
    setEnergyUsage(usage);
  };

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [20, 45, 28, 80, 99, 43, energyUsage] }],
  };
  const hourlyData = {
    labels: ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
    datasets: [{ data: [1, 5, 2, 4, 6, 7, 5, 3] }],
  };

  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [20, 45, 28, 80, 99, 43, energyUsage] }],
  };

  const currentData = dataView === "hourly" ? hourlyData : weeklyData;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        setDataView("hourly");
      } else if (gestureState.dx < -50) {
        setDataView("weekly");
      }
    },
  });

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
            <Icon name="cog" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.energyInfoContainer}>
              <Text style={styles.energySubtext}>Today's Usage</Text>
              <View style={styles.energyUsageRow}>
                <Icon name="lightning-bolt" size={70} color="white" />
                <Text style={styles.energyText}>: {energyUsage} kWh</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartContainer} {...panResponder.panHandlers}>
            <Text style={styles.chartTitle}>
              {dataView === "hourly" ? "Hourly" : "Weekly"} Energy Usage
            </Text>
            <LineChart
              data={currentData}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" kWh"
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: "#1F2A44" },
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
                      {currentData.labels[selectedDataPoint.index]}:{" "}
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
                { name: "sofa", label: "Living Room" },
                { name: "garage", label: "Garage" },
                { name: "stove", label: "Kitchen" },
                { name: "bed", label: " Rooms" },
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
    top: 10,
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
    fontSize: 25,
    marginLeft: 30,
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
    marginBottom: 10,
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
