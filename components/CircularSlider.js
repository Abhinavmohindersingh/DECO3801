// components/CircularSlider.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { PanGestureHandler } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const CIRCLE_RADIUS = (width / 2) * 0.4; // Adjust the radius to be a percentage of screen width
const CIRCLE_STROKE_WIDTH = 20;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const CircularSlider = () => {
  const [value, setValue] = useState(0);

  const handlePanGesture = ({ nativeEvent }) => {
    // Calculate angle based on touch position
    const angle = Math.atan2(
      nativeEvent.y - CIRCLE_RADIUS,
      nativeEvent.x - CIRCLE_RADIUS
    );
    const percent = (angle + Math.PI) / (2 * Math.PI);
    const newValue = Math.round(percent * 100);
    setValue(newValue);
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={width}>
        <Circle
          cx={width / 2}
          cy={width / 2}
          r={CIRCLE_RADIUS}
          stroke="#BDC3C7"
          strokeWidth={CIRCLE_STROKE_WIDTH}
          fill="none"
        />
        <Path
          stroke="#FF6F61"
          strokeWidth={CIRCLE_STROKE_WIDTH}
          strokeDasharray={`${
            (CIRCLE_CIRCUMFERENCE * value) / 100
          } ${CIRCLE_CIRCUMFERENCE}`}
          strokeLinecap="round"
          d={`M ${width / 2}, ${width / 2} m 0, -${CIRCLE_RADIUS}
              a ${CIRCLE_RADIUS},${CIRCLE_RADIUS} 0 1,1 0,${2 * CIRCLE_RADIUS}
              a ${CIRCLE_RADIUS},${CIRCLE_RADIUS} 0 1,1 0,-${
            2 * CIRCLE_RADIUS
          }`}
        />

      <PanGestureHandler onGestureEvent={handlePanGesture}>
        <View style={styles.gestureContainer} />
      </PanGestureHandler>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: width,
  },
  gestureContainer: {
    position: "absolute",
    width: width,
    height: width,
  },
  value: {
    fontSize: 24,
    color: "#FFFFFF",
    position: "absolute",
    bottom: 20,
  },
});

export default CircularSlider;
