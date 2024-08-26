import React, { Children } from "react";
import { View, StyleSheet, ImageBackground, BackHandler } from "react-native";

const Background = ({ children }) => {
  return (
    <View>
      <ImageBackground
        source={require("../icons/background.jpeg")}
        style={{ height: "100%" }}
      />
      <View style={{ position: "absolute" }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Background;
