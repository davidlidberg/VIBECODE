import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { LinearGradient } from "expo-linear-gradient";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Signup">;

export default function SignupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email.trim() || !phone.trim()) {
      return;
    }

    Keyboard.dismiss();
    setIsSubmitted(true);

    // In a real app, you would send this to your CPA offer endpoint
    console.log("Signup submitted:", { email, phone });

    // Show success state for 2 seconds then go back
    setTimeout(() => {
      navigation.navigate("Input");
    }, 2000);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isSubmitted) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center px-6">
        <View className="items-center">
          <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark" size={48} color="#fff" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            You are In!
          </Text>
          <Text className="text-gray-400 text-base text-center">
            Check your phone for 3 real +EV picks
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header */}
            <View className="px-6 pt-4 pb-6 flex-row items-center">
              <Pressable onPress={handleBack} className="p-2">
                <Ionicons name="close" size={28} color="#fff" />
              </Pressable>
            </View>

            {/* Content */}
            <View className="flex-1 px-6 justify-center">
              {/* Hero Section */}
              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl items-center justify-center mb-4">
                  <Text className="text-3xl">🔥</Text>
                </View>
                <Text className="text-white text-3xl font-black text-center mb-3">
                  Unlock Real +EV Picks
                </Text>
                <Text className="text-gray-400 text-base text-center">
                  Get 3 data-backed picks with actual positive expected value. No BS.
                </Text>
              </View>

              {/* Features */}
              <View className="bg-zinc-900 rounded-2xl p-5 mb-6 border border-zinc-800">
                <View className="flex-row items-start mb-4">
                  <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mr-3">
                    <Ionicons name="trending-up" size={16} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold mb-1">
                      +EV Math-Backed Picks
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Real statistical edges, not guesses
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start mb-4">
                  <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mr-3">
                    <Ionicons name="speedometer" size={16} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold mb-1">
                      Daily Fresh Picks
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Updated daily based on live odds
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mr-3">
                    <Ionicons name="analytics" size={16} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold mb-1">
                      Transparent Tracking
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      See our win rate and ROI history
                    </Text>
                  </View>
                </View>
              </View>

              {/* Form */}
              <View className="space-y-4">
                <View>
                  <Text className="text-white text-sm font-semibold mb-2">
                    Email
                  </Text>
                  <TextInput
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white text-base"
                    placeholder="your@email.com"
                    placeholderTextColor="#52525b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View className="mt-4">
                  <Text className="text-white text-sm font-semibold mb-2">
                    Phone
                  </Text>
                  <TextInput
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white text-base"
                    placeholder="(555) 123-4567"
                    placeholderTextColor="#52525b"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <Pressable
                  onPress={handleSubmit}
                  disabled={!email.trim() || !phone.trim()}
                  className="mt-6 rounded-xl py-5"
                  style={
                    !email.trim() || !phone.trim()
                      ? { backgroundColor: "#27272a" }
                      : { backgroundColor: "#10b981" }
                  }
                >
                  <Text className="text-white font-bold text-base text-center">
                    Get My Picks Now
                  </Text>
                </Pressable>
              </View>

              {/* Legal */}
              <Text className="text-gray-500 text-xs text-center mt-6">
                By signing up, you agree to receive SMS and email updates. Msg & data rates
                may apply. 21+ only. Gambling problem? Call 1-800-GAMBLER.
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
