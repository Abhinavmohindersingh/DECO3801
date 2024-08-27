import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Background from "../components/Background";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

import logo from "../icons/windashlog.png"; // Adjust the path as necessary

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
  const navigation = useNavigation(); // Hook to get the navigation object

  const handleLogin = () => {
    // You can add your authentication logic here
    if (isLogin) {
      // Assuming authentication is successful, navigate to the Profile screen
      navigation.navigate("Profile");
    } else {
      // Handle signup logic here
    }
  };

  return (
    <Background>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.logoText}></Text>
      </View>

      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setIsLogin(true)}
            style={[styles.toggleButton, isLogin && styles.activeButton]}
          >
            <Text style={styles.toggleText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsLogin(false)}
            style={[styles.toggleButton, !isLogin && styles.activeButton]}
          >
            <Text style={styles.toggleText}>Signup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Conditionally render confirm password field for signup */}
        {!isLogin && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        )}

        <Button
          bgcolor="white"
          textcolor="Black"
          buttonLabel={isLogin ? "Login" : "Signup"}
          onPress={handleLogin} // Call handleLogin when the button is pressed
        />

        {/* Add a 'Forgot password?' link only on the login form */}
        {isLogin && (
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        {/* Toggle between Login and Signup */}
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin
              ? "Not a member? Signup now"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 50,
    marginRight: 25,
    marginTop: 0,
    backgroundColor: "rgba(124, 110, 127, 0.1)",
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 350, // Adjust size as needed
    height: 250, // Adjust size as needed
    resizeMode: "contain",
  },
  logoText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#0066cc",
  },
  toggleText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },
  formGroup: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    width: "100%",
  },
  forgotPasswordText: {
    color: "white",
    marginTop: 10,
  },
  switchText: {
    color: "white",
    marginTop: 20,
  },
});

export default LoginScreen;
