// components/PowerUsageCard.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PowerUsageCard = ({ iconName }) => {
  return (
    <View style={styles.card}>
      <Icon name={iconName} size={30} color="#FFFFFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 60,
    height: 60,
    backgroundColor: "#1F2A44",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
});

export default PowerUsageCard;
