// screens/HomeScreen.js
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Layout from "../components/Layout";

export default function HomeScreen({ navigation }) {
  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to WinDash</Text>
        <Button
          title="More Pages.."
          onPress={() => navigation.navigate("Details")}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
