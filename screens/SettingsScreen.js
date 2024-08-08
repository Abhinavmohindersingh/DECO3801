// screens/SettingsScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CircularSlider from "../components/CircularSlider";

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adjust Volume</Text>
      <CircularSlider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121A2B",
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 20,
  },
});

export default SettingsScreen;
