import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./src/screens/Home";
import MapsRouting from "./src/screens/MapsRouting";
const Tab = createBottomTabNavigator();
import Constants from "expo-constants";

const statusBarHeight = Constants.statusBarHeight;

export default () => {
  return (
    <NavigationContainer>
      <View style={{ height: statusBarHeight }} />
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="MapsRouting" component={MapsRouting} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
