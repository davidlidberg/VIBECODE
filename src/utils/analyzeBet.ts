import { BetVerdict } from "../state/appStore";
import { getOpenAITextResponse } from "../api/chat-service";
import * as FileSystem from "expo-file-system";

/**
 * Analyzes a sports bet using AI and returns a verdict
 * @param betText - The bet description as text
 * @param imageUri - Optional screenshot of the bet
 * @returns A BetVerdict with W/L rating and three mini reasons
 */
export async function analyzeBet(
  betText: string,
  imageUri?: string | null,
): Promise<BetVerdict> {
  try {
    let imageBase64: string | null = null;

    // Convert image to base64 if provided
    if (imageUri) {
      imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    // Build the prompt with sports betting analysis context
    const systemPrompt = `You are a brutally honest sports betting analyst with a sense of humor. Analyze the bet and provide:
1. A verdict: either "W" (winner) or "L" (loser)
2. EV Rating (0-100): Mathematical expected value assessment
3. Player History: Recent performance trend (hot/cold/neutral)
4. Vibe/Aura: A fun, bold personality assessment

Be confident, slightly cocky, and entertaining. Use sports culture language. Make it shareable.

Return ONLY valid JSON in this exact format:
{
  "verdict": "W" or "L",
  "evRating": { "score": 0-100, "reason": "brief explanation" },
  "playerHistory": { "trend": "hot" | "cold" | "neutral", "reason": "brief explanation" },
  "vibeAura": { "emoji": "single emoji", "reason": "bold one-liner" }
}`;

    // Prepare messages with or without image
    const messages: any[] = [
      {
        role: "system",
        content: systemPrompt,
      },
    ];

    if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: betText || "Analyze this bet from the screenshot:",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: `Analyze this bet: ${betText}`,
      });
    }

    // Get AI response
    const response = await getOpenAITextResponse(messages, {
      model: "gpt-4o",
      temperature: 0.8, // Higher temp for more creative/bold responses
      maxTokens: 500,
    });

    // Parse the JSON response
    const analysisResult = JSON.parse(response.content);

    // Generate unique ID
    const id = `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Build and return the verdict
    const verdict: BetVerdict = {
      id,
      betDescription: betText || "Screenshot bet",
      verdict: analysisResult.verdict,
      evRating: {
        score: analysisResult.evRating.score,
        reason: analysisResult.evRating.reason,
      },
      playerHistory: {
        trend: analysisResult.playerHistory.trend,
        reason: analysisResult.playerHistory.reason,
      },
      vibeAura: {
        emoji: analysisResult.vibeAura.emoji,
        reason: analysisResult.vibeAura.reason,
      },
      timestamp: Date.now(),
    };

    return verdict;
  } catch (error) {
    console.error("Bet analysis error:", error);

    // Fallback mock verdict if AI fails
    return {
      id: `bet_${Date.now()}`,
      betDescription: betText || "Screenshot bet",
      verdict: "L",
      evRating: {
        score: 30,
        reason: "Analysis temporarily unavailable",
      },
      playerHistory: {
        trend: "neutral",
        reason: "Unable to fetch recent stats",
      },
      vibeAura: {
        emoji: "🤷",
        reason: "Try again in a moment",
      },
      timestamp: Date.now(),
    };
  }
}
