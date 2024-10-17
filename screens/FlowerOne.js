import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Canvas } from "@react-three/fiber";
import { PieChart } from "react-native-chart-kit"; // Import PieChart
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Model } from "../components/Model";
import { ModelBad } from "../components/ModelBad";
import { ModelNeutral } from "../components/ModelNeutral";

const menuOptions = [
  { name: "PredictViz", iconName: "chart-line", href: "EnergyUsage" },
  { name: "Spendings", iconName: "currency-usd", href: "SpendingScreen" },
  {
    name: "Energy Usage",
    iconName: "trending-up",
    href: "EstimatedBillScreen",
  },
  { name: "Live", iconName: "chart-bar", href: "LiveUsage" },
  { name: "Info", iconName: "information", href: "InfoScreen" },
  { name: "Settings", iconName: "cogs", href: "SettingsScreen" },
];

const FlowerOne = () => {
  const navigation = useNavigation(); // Initialize navigation
  const route = useRoute();
  const { totalConsumption = 0 } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [currentUsage, setCurrentUsage] = useState(8); // Example usage value

  const handleFlashPress = () => {
    setModalVisible(true);
  };

  const handleMenuItemClick = (href) => {
    navigation.navigate(href);
  };

  const renderMenuOption = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleMenuItemClick(item.href)}
    >
      <MaterialCommunityIcons name={item.iconName} size={30} color="#fff" />
      <Text style={styles.menuLabel}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Function to return the correct flower pot model based on usage
  const getFlowerPotModel = () => {
    if (totalConsumption < 5) {
      return <Model position={[0, -1, 0]} />;
    } else if (totalConsumption >= 5 && totalConsumption < 8) {
      return <ModelNeutral position={[0, -1, 0]} />;
    } else {
      return <ModelBad position={[0, -1, 0]} />;
    }
  };

  // Data for PieChart
  const pieData = [
    {
      name: "Kitchen",
      energy: 30,
      color: "#f54242",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Living Room",
      energy: 20,
      color: "#42f554",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Laundry",
      energy: 50,
      color: "#4287f5",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <ImageBackground
      source={require("../icons/background.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          ></View>
        </View>

        <PieChart
          data={pieData}
          width={300} // From react-native
          height={380}
          left={150}
          zindex={5}
          backgroundColor="red"
          position="absolute"
          top={150}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#1E2923",
            backgroundGradientTo: "#08130D",
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
          }}
          accessor={"energy"}
        />

        <View style={styles.canvasContainer}>
          {/* Pie Chart */}

          <Canvas
            style={{
              width: "100%",
              height: "100%",
            }}
            shadows
            gl={{ alpha: true }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Environment preset="city" />
            <PerspectiveCamera makeDefault position={[0, 5, 9]} />
            <OrbitControls />

            {getFlowerPotModel()}

            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.5}
              width={10}
              height={10}
              blur={1}
              far={2}
            />
          </Canvas>
        </View>
      </View>

      {/* Modal for Current Usage */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Current Energy Usage</Text>
            <Text style={styles.modalDescription}>
              Your current energy usage is {currentUsage} kWh. This reflects the
              total energy consumed by your household appliances today.
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "130%",
    bottom: 0,
    zIndex: 0,
    marginTop: 0,
    overflow: "hidden",
  },
  modalOverlay: {
    postion: "absolute",
    top: 80,
    left: 0,
    justifyContent: "left",
    alignItems: "center",
  },
  modalView: {
    width: Dimensions.get("window").width - 100,
    backgroundColor: "rgba(119, 119, 119, 0.7)",
    color: "white",
    fontWeight: 15,
    borderRadius: 20,
    padding: 5,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(119, 119, 119, 0.7)",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  menuLabel: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  modalCloseButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: "#000",
  },
});

export default FlowerOne;
