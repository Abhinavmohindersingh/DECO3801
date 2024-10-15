import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Background from "../components/Background";
import Icon from "react-native-vector-icons/MaterialIcons";

const HelpScreen = ({ navigation }) => {
  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Household Details Help</Text>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Number of Rooms</Text>
          <Text style={styles.infoText}>
            Select the total number of rooms in your home, including bedrooms,
            living areas, and other spaces.
          </Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Home Type</Text>
          <Text style={styles.infoText}>
            Choose the type of dwelling you live in, such as an apartment,
            single-family home, or townhouse.
          </Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Number of Occupants</Text>
          <Text style={styles.infoText}>
            Indicate how many people regularly live in your home.
          </Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Energy Source</Text>
          <Text style={styles.infoText}>
            Select the primary energy source used to power your home, such as
            electricity, natural gas, or solar.
          </Text>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#ccc",
    lineHeight: 24,
  },
});

export default HelpScreen;
