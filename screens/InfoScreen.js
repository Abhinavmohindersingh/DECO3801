import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Background from "../components/Background";

const InfoScreen = ({ navigation }) => {
  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.heading}>Information</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            This is the Bill Estimation screen. Here you can see your estimated
            usage, costs, and remaining days for your electricity bill.
          </Text>
          <Text style={styles.infoText}>
            The chart shows the hourly usage divided into different categories
            with the corresponding cost and usage information.
          </Text>
          <Text style={styles.infoText}>
            You can navigate back to the main screen by using the back button or
            closing this info screen.
          </Text>

          <Button
            title="Back to Main Screen"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    top: 50,
    left: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    display: "flex",
    color: "white",
  },
  infoContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background to make it stand out
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "90%", // Adjust width as necessary
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
});

export default InfoScreen;
