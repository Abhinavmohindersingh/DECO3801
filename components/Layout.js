// components/Layout.js
import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // For Expo users

const Layout = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#003366", "#0066cc", "#ffff99"]}
        style={styles.header}
      >
        <Text style={styles.headerText}>WinDash</Text>
      </LinearGradient>
      <View style={styles.content}>{children}</View>
      <LinearGradient
        colors={["#003366", "#0066cc", "#ffff99"]}
        style={styles.footer}
      >
        <Text style={styles.footerText}>© 2024 WinDash, Inc.</Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    padding: 15,
    alignItems: "center",
    width: "100%", // Ensure the header takes full width
  },
  headerText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    width: "100%", // Ensure the content takes full width
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  footer: {
    padding: 10,
    alignItems: "center",
    width: "100%", // Ensure the footer takes full width
  },
  footerText: {
    color: "#fff",
  },
});

export default Layout;
