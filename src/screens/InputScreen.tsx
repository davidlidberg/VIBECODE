import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { analyzeBet } from "../utils/analyzeBet";
import { useAppStore } from "../state/appStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Input">;

const DEFAULT_BETS = [
  "Mahomes over 2.5 TDs tonight",
  "Lakers ML against the Suns",
  "Curry over 28.5 points",
  "Yankees -1.5 run line",
];

export default function InputScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [betText, setBetText] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { setCurrentVerdict, setIsAnalyzing, isAnalyzing } = useAppStore();

  const handleDefaultBetClick = (bet: string) => {
    setBetText(bet);
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload screenshots!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
      mediaTypes: ["images"],
      allowEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!betText.trim() && !imageUri) {
      return;
    }

    Keyboard.dismiss();
    setIsAnalyzing(true);

    try {
      const verdict = await analyzeBet(betText, imageUri);
      setCurrentVerdict(verdict);
      navigation.navigate("Verdict");
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Failed to analyze bet. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setBetText("");
      setImageUri(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-6">
              {/* Header */}
              <View className="pt-8 pb-4">
                <Text className="text-5xl font-black text[[#39FF14] text-center tracking-tight">
                  Wpicks
                </Text> 