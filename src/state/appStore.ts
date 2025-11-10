import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type VerdictType = "W" | "L";

export interface BetVerdict {
  id: string;
  betDescription: string;
  verdict: VerdictType;
  evRating: {
    score: number; // 0-100
    reason: string;
  };
  playerHistory: {
    trend: "hot" | "cold" | "neutral";
    reason: string;
  };
  vibeAura: {
    emoji: string;
    reason: string;
  };
  timestamp: number;
}

interface AppState {
  // Verdict history (persisted)
  verdicts: BetVerdict[];
  addVerdict: (verdict: BetVerdict) => void;
  clearVerdicts: () => void;

  // Current analysis state (not persisted)
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  currentVerdict: BetVerdict | null;
  setCurrentVerdict: (verdict: BetVerdict | null) => void;
}

// Split into persisted and non-persisted stores for better performance
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      verdicts: [],
      addVerdict: (verdict) =>
        set((state) => ({
          verdicts: [verdict, ...state.verdicts].slice(0, 50), // Keep only last 50
        })),
      clearVerdicts: () => set({ verdicts: [] }),

      // These won't be persisted
      isAnalyzing: false,
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      currentVerdict: null,
      setCurrentVerdict: (verdict) => set({ currentVerdict: verdict }),
    }),
    {
      name: "wpicks-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ verdicts: state.verdicts }), // Only persist verdicts
    },
  ),
);
