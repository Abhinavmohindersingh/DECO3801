// screens/DetailsScreen.js
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Layout from "../components/Layout"; // Adjust the path if needed

export default function DetailsScreen() {
  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>To be Added</Text>
        <Text>More on the way..</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
