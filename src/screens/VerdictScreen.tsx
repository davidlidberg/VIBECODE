import React from "react";
import { View, Text, Pressable, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useAppStore } from "../state/appStore";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Verdict">;

export default function VerdictScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentVerdict, addVerdict } = useAppStore();
  const verdictCardRef = React.useRef<View>(null);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animate card entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Save verdict to history
    if (currentVerdict) {
      addVerdict(currentVerdict);
    }
  }, [currentVerdict]);

  if (!currentVerdict) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">No verdict available</Text>
      </SafeAreaView>
    );
  }

  const isWinner = currentVerdict.verdict === "W";
  const verdictColor = isWinner ? "#10b981" : "#ef4444";
  const verdictGradient: [string, string] = isWinner
    ? ["#10b981", "#059669"]
    : ["#ef4444", "#dc2626"];

  const getTrendEmoji = (trend: string) => {
    switch (trend) {
      case "hot":
        return "🔥";
      case "cold":
        return "❄️";
      default:
        return "📊";
    }
  };

  const handleShare = async () => {
    try {
      if (!verdictCardRef.current) return;

      const uri = await captureRef(verdictCardRef, {
        format: "png",
        quality: 1,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share your Wpicks verdict",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleUnlock = () => {
    navigation.navigate("Signup");
  };

  const handleNewBet = () => {
    navigation.navigate("Input");
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
          <Pressable onPress={handleNewBet} className="p-2">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </Pressable>
          <Text className="text-white text-xl font-bold">Verdict</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Verdict Card */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            marginHorizontal: 20,
          }}
        >
          <View ref={verdictCardRef} className="bg-zinc-900 rounded-3xl overflow-hidden">
            {/* Header with gradient */}
            <LinearGradient
              colors={verdictGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 24 }}
            >
              <View className="items-center">
                <Text className="text-white text-7xl font-black mb-2">
                  {currentVerdict.verdict}
                </Text>
                <Text className="text-white text-lg font-semibold opacity-90">
                  {isWinner ? "WINNER ENERGY" : "TAKE THE L"}
                </Text>
              </View>
            </LinearGradient>

            {/* Bet Description */}
            <View className="px-6 pt-6 pb-4 border-b border-zinc-800">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Your Bet
              </Text>
              <Text className="text-white text-base font-medium">
                {currentVerdict.betDescription}
              </Text>
            </View>

            {/* Three Mini Reasons */}
            <View className="px-6 py-4">
              {/* EV Rating */}
              <View className="mb-5">
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: "#1f2937" }}
                  >
                    <Text className="text-lg">📈</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-sm font-bold mb-1">
                      EV Rating: {currentVerdict.evRating.score}/100
                    </Text>
                    <View className="bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${currentVerdict.evRating.score}%`,
                          backgroundColor: verdictColor,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <Text className="text-gray-400 text-sm ml-13">
                  {currentVerdict.evRating.reason}
                </Text>
              </View>

              {/* Player History */}
              <View className="mb-5">
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: "#1f2937" }}
                  >
                    <Text className="text-lg">
                      {getTrendEmoji(currentVerdict.playerHistory.trend)}
                    </Text>
                  </View>
                  <Text className="text-white text-sm font-bold flex-1">
                    Player History:{" "}
                    <Text className="capitalize">{currentVerdict.playerHistory.trend}</Text>
                  </Text>
                </View>
                <Text className="text-gray-400 text-sm ml-13">
                  {currentVerdict.playerHistory.reason}
                </Text>
              </View>

              {/* Vibe/Aura */}
              <View>
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: "#1f2937" }}
                  >
                    <Text className="text-lg">{currentVerdict.vibeAura.emoji}</Text>
                  </View>
                  <Text className="text-white text-sm font-bold flex-1">
                    Vibe Check
                  </Text>
                </View>
                <Text className="text-gray-400 text-sm ml-13">
                  {currentVerdict.vibeAura.reason}
                </Text>
              </View>
            </View>

            {/* Wpicks branding */}
            <View className="px-6 py-4 border-t border-zinc-800">
              <Text className="text-gray-500 text-xs font-semibold text-center">
                Rated by Wpicks
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View className="px-6 mt-8">
          {/* Share Button */}
          <Pressable
            onPress={handleShare}
            className="bg-white rounded-2xl py-4 mb-4 flex-row items-center justify-center"
          >
            <Ionicons name="share-social" size={20} color="#000" />
            <Text className="text-black font-bold text-base ml-2">
              Share Verdict
            </Text>
          </Pressable>

          {/* CPA Offer Button */}
          <Pressable
            onPress={handleUnlock}
            className="rounded-2xl py-4 mb-4"
            style={{ backgroundColor: verdictColor }}
          >
            <Text className="text-white font-bold text-base text-center">
              🔥 Unlock 3 Real +EV Picks Today
            </Text>
          </Pressable>

          {/* New Bet Button */}
          <Pressable
            onPress={handleNewBet}
            className="bg-zinc-800 rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-semibold text-base">
              Rate Another Bet
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
