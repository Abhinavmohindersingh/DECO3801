import React, { useState, useEffect } from "react";
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
  { name: "PredictViz", iconName: "chart-line", href: "PredictViz" },
  { name: "Live", iconName: "chart-bar", href: "LiveUsage" },

  {
    name: "Energy Spent",
    iconName: "battery-charging",
    href: "ElecSpendingScreen",
  },

  { name: "Spendings", iconName: "currency-usd", href: "SpendingScreen" },
  { name: "Limit", iconName: "cash-multiple", href: "EnergyLimit" },
  { name: "Settings", iconName: "cogs", href: "SettingsScreen" },
];

const FlowerPot = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [numColumns, setNumColumns] = useState(2); // Default to
  const route = useRoute(); // Now using the useRoute hook to access route parameters
  const { totalConsumption = 0 } = route.params || {};
  const [threshold, setThreshold] = useState(0); // State for threshold from the server
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUsage, setCurrentUsage] = useState(8); // Example usage value

  // Function to fetch the threshold value from the server
  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const response = await fetch("http://34.87.202.191:4000/pi");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Got the full data:", data);

        // Calculate the threshold as 2 * recent / (1.5 * average)
        if (data && data.recent !== undefined && data.average !== undefined) {
          const calculatedThreshold = (2 * data.recent) / (1.5 * data.average);
          setThreshold(calculatedThreshold);
          console.log("Calculated threshold:", calculatedThreshold);
        } else {
          console.log(
            "Recent or average value not found in the response",
            data
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data immediately and then every 5 seconds
    fetchThreshold();
    const intervalId = setInterval(fetchThreshold, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleFlashPress = () => {
    setModalVisible(true);
  };

  const handleMenuItemClick = (href) => {
    navigation.navigate(href);
  };

  const renderMenuOption = ({ item }) => {
    const isLiveOption = item.name === "Live";
    const isHighUsage = threshold > 1.4;
    const isModerateUsage = threshold >= 0.75 && threshold <= 1.4;

    const borderColor = isLiveOption
      ? isHighUsage
        ? "#FF0000"
        : isModerateUsage
        ? "#FFD700"
        : "#00FF00"
      : "#fff";

    const backgroundColor =
      isLiveOption && isHighUsage
        ? "rgba(255, 0, 0, 0.3)"
        : "rgba(119, 119, 119, 0.3)";
    const textColor = isLiveOption && isHighUsage ? "#fff" : "#fff";

    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            borderColor: borderColor,
            borderWidth: 2,
            backgroundColor: backgroundColor,
          },
        ]}
        onPress={() => handleMenuItemClick(item.href)}
      >
        <MaterialCommunityIcons
          name={item.iconName}
          size={30}
          color={textColor}
        />
        <Text style={[styles.menuLabel, { color: textColor }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Function to return the correct flower pot model based on the threshold value
  const getFlowerPotModel = () => {
    if (threshold > 0 && threshold <= 0.75) {
      return <Model position={[0, -1, 0]} />;
    } else if (threshold > 0.75 && threshold <= 1.4) {
      return <ModelNeutral position={[0, -1, 0]} />;
    } else {
      return <ModelBad position={[0, -1, 0]} />;
    }
  };

  const getBorderColor = () => {
    if (threshold > 0 && threshold < 0.75) {
      return "#00FF00"; // Green for low usage
    } else if (threshold >= 0.75 && threshold < 1.4) {
      return "#FFD700"; // Yellow for moderate usage
    } else {
      return "#FF0000"; // Red for high usage
    }
  };

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
          >
            <TouchableOpacity
              onPress={handleFlashPress}
              style={styles.iconContainer}
            >
              <Icon name="home" size={40} color="#FFD700" />
            </TouchableOpacity>

            <Text
              style={{
                color: "#FFD700",
                fontSize: 30,
                marginTop: 5,
                fontWeight: 500,
              }}
            >
              WinDash
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("AccountScreen")}
          >
            <FontAwesome name="user-circle" size={50} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.canvasContainer}>
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

            {/* Dynamically render the correct flower pot model based on the threshold */}
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

        <View style={styles.roomIconsContainer}>
          <View style={styles.roomIcons}>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate("RoomsUsage")}
              >
                <Icon name="bed-outline" size={40} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.iconLabel}>Rooms</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate("KitchenUsage")}
              >
                <Icon name="restaurant-outline" size={40} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>Kitchen</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate("LivingUsage")}
              >
                <MaterialCommunityIcons
                  name="sofa-outline"
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>Living Room</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate("GarageUsage")}
              >
                <Icon name="car" size={40} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>Garage</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate("LaundryUsage")}
              >
                <MaterialCommunityIcons
                  name="washing-machine"
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>Laundry</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <FlatList
            data={menuOptions}
            showsVerticalScrollIndicator={false}
            renderItem={renderMenuOption}
            keyExtractor={(item) => item.name}
            numColumns={numColumns}
            ListHeaderComponent={<Text style={styles.menuTitle}></Text>}
            key={numColumns}
          />
        </View>
      </View>

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
            <Text style={styles.modalDescription}>
              Your current energy usage is {totalConsumption} kWh.
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
  container: { flex: 1 },
  background: { flex: 1 },
  header: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    alignItems: "center",
    flexDirection: "row",
    zIndex: 1,
    justifyContent: "space-between",
  },
  canvasContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "70%",

    bottom: 0,
    zIndex: 0,
    overflow: "hidden",
  },
  roomIcons: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
    top: 400,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(119, 119, 119, 0.7)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  iconWrapper: { alignItems: "center" },
  iconLabel: { color: "white", fontSize: 12, marginTop: 5 },
  menuContainer: {
    position: "absolute",
    top: 490,
    left: 20,
    right: 20,
    zIndex: 3,
  },
  menuItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "rgba(119, 119, 119, 0.7)",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  menuLabel: { color: "white", fontSize: 16, marginTop: 10 },
  modalOverlay: {
    postion: "absolute",
    top: 80,
    left: 0,
    justifyContent: "left",
    alignItems: "center",
  },
  modalView: {
    width: Dimensions.get("window").width - 100,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderRadius: 20,
    padding: 5,
    alignItems: "left",
  },
  modalDescription: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  modalTitle: { fontSize: 18, color: "#fff", marginBottom: 10 },
  modalCloseButton: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  modalCloseButtonText: { color: "#fff", fontWeight: "400" },
});

export default FlowerPot;
