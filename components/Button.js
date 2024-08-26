import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Button({ buttonLabel, bgcolor, textcolor, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: bgcolor }]} // Apply bgcolor dynamically
    >
      <Text style={[styles.buttonText, { color: textcolor }]}>
        {buttonLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25, // Rounded corners
    alignItems: "center",
    width: 300,
    paddingVertical: 15, // Increased padding for a better look
  },
  buttonText: {
    fontSize: 18, // Adjusted font size
    fontWeight: "bold",
  },
});
