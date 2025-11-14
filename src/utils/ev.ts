/**
 * Expected Value (EV) calculation for betting odds.
 */
import { americanToDecimal, decimalToImpliedProb } from "./odds";

export type EVInput = {
  odds: number; // American odds, e.g. -120 or +150
  winProb: number; // Model/domestic estimate, 0..1 (e.g. 0.55)
  stake?: number; // default 1
  fairProb?: number; // optional, if caller provides fair prob (e.g., vig-removed)
};

export type EVOutput = {
  decimalOdds: number;
  impliedProb: number; // from book odds (no vig removed)
  fairProbUsed: number; // winProb or fairProb fallback
  evPerStake: number; // expected profit per 1 stake unit
  edge: number; // fairProbUsed - impliedProb
  verdict: "W" | "L";
  reasons: {
    evRating: string; // e.g., "EV +0.07 per unit"
    playerHistory: string; // placeholder, simple rule-based
    vibeAura: string; // playful one-liner
  };
};

/**
 * Helper function to pick an element from an array deterministically.
 */
const pick = <T,>(arr: T[], key: number): T => {
  return arr[Math.abs(key) % arr.length];
};

/**
 * Calculates Expected Value and provides verdict with mini-reasons.
 * @param input - EVInput containing odds, winProb, optional stake and fairProb
 * @returns EVOutput with calculation results and verdict
 */
export function calculateEV({
  odds,
  winProb,
  stake = 1,
  fairProb,
}: EVInput): EVOutput {
  // Input validation
  if (!Number.isFinite(odds)) {
    throw new Error("Invalid odds");
  }
  if (!(winProb >= 0 && winProb <= 1)) {
    throw new Error("Invalid winProb");
  }
  if (!(stake > 0)) {
    throw new Error("Invalid stake");
  }

  // Core calculations
  const decimalOdds = americanToDecimal(odds);
  const impliedProb = decimalToImpliedProb(decimalOdds);
  const p = fairProb ?? winProb;

  const profitIfWin = decimalOdds - 1; // per 1 unit
  const evPerStake = p * profitIfWin - (1 - p) * 1;
  const edge = p - impliedProb;
  const verdict: "W" | "L" = evPerStake >= 0 ? "W" : "L";

  // Mini reasons (rule-based)
  const evRating = `EV ${evPerStake >= 0 ? "+" : ""}${evPerStake.toFixed(2)} per unit`;

  const playerHistory =
    edge > 0.05
      ? "Trending hot vs market 🔥"
      : edge < -0.05
        ? "Cold read vs market ❄️"
        : "Within coin-flip range 🪙";

  const goodVibes = [
    "Main character energy 😎",
    "Crowd buff incoming 📣",
    "Green lights only 💡",
  ];
  const badVibes = [
    "Cold aura after that missed PK ❄️",
    "Narrative tax alert 🧾",
    "Trap line vibes 🪤",
  ];
  const vibeAura = pick(
    verdict === "W" ? goodVibes : badVibes,
    Math.round(odds * 1000)
  );

  return {
    decimalOdds,
    impliedProb,
    fairProbUsed: p,
    evPerStake,
    edge,
    verdict,
    reasons: { evRating, playerHistory, vibeAura },
  };
}
