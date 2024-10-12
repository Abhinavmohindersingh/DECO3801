import React, { Children } from "react";
import { View, StyleSheet, ImageBackground, BackHandler } from "react-native";

const Background = ({ children }) => (
  <ImageBackground
    source={require("../icons/background.jpeg")}
    style={styles.background}
  >
    {children}
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  // other styles...
});

export default Background;
