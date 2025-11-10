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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
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
                <Text className="text-5xl font-black text-blue-500 text-center tracking-tight">
                  Wpicks
                </Text>
                <Text className="text-gray-400 text-center mt-2 text-base">
                  Drop your bet. Get the verdict.
                </Text>
              </View>

              {/* Default Bet Suggestions */}
              <View className="pb-4">
                <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                  Try These
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {DEFAULT_BETS.map((bet, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleDefaultBetClick(bet)}
                      className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2"
                    >
                      <Text className="text-gray-300 text-sm">{bet}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Input Area */}
              <View className="flex-1 justify-center">
              <View className="bg-zinc-900 rounded-3xl p-6 border-2 border-zinc-800">
                <TextInput
                  className="text-white text-lg min-h-[120px]"
                  placeholder="Type your bet... (e.g., Mahomes over 2.5 TDs)"
                  placeholderTextColor="#52525b"
                  multiline
                  value={betText}
                  onChangeText={setBetText}
                  textAlignVertical="top"
                />

                {imageUri && (
                  <View className="mt-4 bg-zinc-800 rounded-xl p-3 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="image" size={20} color="#10b981" />
                      <Text className="text-green-500 ml-2 text-sm font-semibold">
                        Screenshot attached
                      </Text>
                    </View>
                    <Pressable onPress={() => setImageUri(null)}>
                      <Ionicons name="close-circle" size={20} color="#ef4444" />
                    </Pressable>
                  </View>
                )}

                <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                  <Pressable
                    onPress={handleImagePick}
                    className="flex-row items-center bg-zinc-800 px-4 py-3 rounded-xl"
                  >
                    <Ionicons name="camera" size={20} color="#a1a1aa" />
                    <Text className="text-gray-400 ml-2 text-sm font-medium">
                      Upload Screenshot
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* CTA Button */}
              <Pressable
                onPress={handleAnalyze}
                disabled={(!betText.trim() && !imageUri) || isAnalyzing}
                className={`mt-6 rounded-2xl py-5 ${
                  (!betText.trim() && !imageUri) || isAnalyzing
                    ? "bg-zinc-800"
                    : "bg-gradient-to-r from-green-500 to-emerald-600"
                }`}
                style={
                  (!betText.trim() && !imageUri) || isAnalyzing
                    ? { backgroundColor: "#27272a" }
                    : {
                        backgroundColor: "#10b981",
                      }
                }
              >
                {isAnalyzing ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Analyzing...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold text-lg text-center">
                    Rate My Bet
                  </Text>
                )}
              </Pressable>
            </View>

            {/* Bottom hint */}
            <View className="pb-6">
              <Text className="text-gray-500 text-center text-sm">
                Text or screenshot. We will roast it either way.
              </Text>
            </View>
          </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
