import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Canvas } from "@react-three/fiber";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Model } from "../components/Model";

const menuOptions = [
  { name: "Energy Usage", iconName: "chart-line", href: "EnergyUsage" },
  { name: "Spendings", iconName: "currency-usd", href: "SpendingScreen" },
  {
    name: "Estimated Bill",
    iconName: "trending-up",
    href: "EstimatedBillScreen",
  },
  {
    name: "Live Usage",
    iconName: "chart-bar",
    href: "LiveUsage",
  },
  { name: "Info", iconName: "information", href: "InfoScreen" },
  { name: "Settings", iconName: "cogs", href: "SettingsScreen" },
];

const FlowerPot = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [numColumns, setNumColumns] = useState(2); // Default to 2 columns

  const handleMenuItemClick = (href) => {
    // Navigate to the desired screen
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
            <View style={styles.iconContainer}>
              <Icon name="flash-outline" size={50} color="#fff" />
            </View>
            <Text style={{ color: "white", fontSize: 30 }}>: 8kWh</Text>
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
              height: 0,
            }}
            shadows
            gl={{ alpha: true }}
          >
            <color attach="red" args={["white"]} />
            <ambientLight intensity={0} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Environment preset="city" />
            <PerspectiveCamera makeDefault position={[0, 5, 9]} />
            <OrbitControls />
            <Model position={[0, -1, 0]} />
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
            numColumns={numColumns} // Use the numColumns state
            ListHeaderComponent={<Text style={styles.menuTitle}></Text>}
            key={numColumns} // Provide a unique key based on numColumns
          />
        </View>
      </View>
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
  energy: {
    height: 20,
    weight: 10,
    color: "white",
  },
  header: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    zIndex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
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
    marginTop: 0,
    overflow: "hidden",
  },
  roomIcons: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
    top: 400,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    zIndex: 2,
    backgroundColor: "rgba(119, 119, 119, 0.7)", // 0.7 is the transparency factor
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  iconWrapper: {
    alignItems: "center",
  },
  iconLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  menuContainer: {
    position: "absolute",
    top: 490,
    left: 20,
    right: 20,
    zIndex: 3,
  },
  menuTitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  menuItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(119, 119, 119, 0.7)", // 0.7 is the transparency factor
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
  },
  menuLabel: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
});

export default FlowerPot;
