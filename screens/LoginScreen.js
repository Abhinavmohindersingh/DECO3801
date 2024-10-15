import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Background from "../components/Background";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated, Easing } from "react-native";

import logo from "../icons/windashlog.png";

const LoginScreen = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const navigation = useNavigation();

  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const logoGlow = {
    transform: [
      {
        scale: glowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
    ],
    opacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    }),
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://34.116.90.99:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate("Home");
      } else {
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSignUp = async () => {
    if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const response = await fetch("http://34.40.131.213:4000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle successful signup
      navigation.navigate("Profile", { isSignUp: true });
    } else {
      // Handle signup failure, show error message
      alert(data.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Background>
      <View style={styles.logoContainer}>
        <Animated.Image source={logo} style={[styles.logo, logoGlow]} />
        <Text style={styles.logoText}>Real-Time Energy, Real-Life Savings</Text>
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
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setusername}
            keyboardType="username"
            autoCapitalize="none"
            maxLength={30}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showConfirmPassword}
            maxLength={30}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={24}
              color="Black"
            />
          </TouchableOpacity>
        </View>

        {!isLogin && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              maxLength={30}
            />
          </View>
        )}

        <Button
          zIndex="1"
          bgcolor="white"
          textcolor="Black"
          buttonLabel={isLogin ? "Login" : "Signup"}
          onPress={isLogin ? handleLogin : handleSignUp}
        />

        {isLogin && (
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        )}

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
    marginLeft: 35,
    marginRight: 35,
    marginTop: 0,
    padding: 10,
    backgroundColor: "rgba(124, 110, 127, 0.5)",
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
  },
  slogan: {
    height: 100,
    color: "red",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 350, // Adjust size as needed
    height: 250, // Adjust size as needed
    resizeMode: "contain",
    marginBottom: 0,
  },
  eyeIcon: {
    color: "white",
    position: "absolute",
    top: 35,
    left: 250,
  },
  logoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15,
    position: "absolute",
    top: 175,
    left: 50,
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
    zIndex: 5,
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
