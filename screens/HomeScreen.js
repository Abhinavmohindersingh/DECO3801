// screens/HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import PowerUsageCard from '../components/PowerUsageCard';

const HomeScreen = ({ navigation }) => {
  const [energyUsage, setEnergyUsage] = useState(0);
  const [alert, setAlert] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current; // Initial position off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Final position
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const mockFetchData = () => {
    setEnergyUsage(45); // Example value
    if (energyUsage > 50) setAlert(true);
  };

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  const devices = [
    { id: '1', iconName: 'fridge-outline' },
    { id: '2', iconName: 'television-classic' },
    { id: '3', iconName: 'lightbulb-outline' },
    { id: '4', iconName: 'washing-machine' },
    { id: '5', iconName: 'air-conditioner' },
    //{ id: '6', iconName: 'oven' }, // this causes errors
    { id: '7', iconName: 'fan' },
    { id: '8', iconName: 'water-pump' },
    { id: '9', iconName: 'desktop-classic' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Weekly Energy Usage</Text>
      <BarChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix="kWh"
        chartConfig={{
          backgroundColor: '#1F2A44',
          backgroundGradientFrom: '#1F2A44',
          backgroundGradientTo: '#1F2A44',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#4E5D78',
          },
        }}
        style={styles.chartStyle}
      />
      <Text style={styles.title}>Energy Usage: {energyUsage} kWh</Text>
      {alert && <Text style={styles.alert}>Alert: High Usage!</Text>}
      <Button title="Fetch Data" onPress={mockFetchData} color="#4E5D78" />

      <View style={styles.grid}>
        {devices.map(device => (
          <PowerUsageCard key={device.id} iconName={device.iconName} />
        ))}
      </View>

      <Animated.View
        style={[
          styles.customizeButton,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <View style={styles.buttonBackground}>
            <Text style={styles.buttonText}>Customize the Energy Plan</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#121A2B',
    paddingTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  alert: {
    marginTop: 20,
    color: '#FF5C5C',
    fontSize: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  customizeButton: {
    position: 'absolute',
    bottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5, // Add shadow for popping look
  },
  buttonBackground: {
    backgroundColor: '#FF6F61', // Vibrant color
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
