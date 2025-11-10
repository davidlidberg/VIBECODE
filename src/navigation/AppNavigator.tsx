import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import InputScreen from "../screens/InputScreen";
import VerdictScreen from "../screens/VerdictScreen";
import SignupScreen from "../screens/SignupScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#000000" },
      }}
      initialRouteName="Input"
    >
      <Stack.Screen name="Input" component={InputScreen} />
      <Stack.Screen name="Verdict" component={VerdictScreen} />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}
