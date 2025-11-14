import { describe, it, expect } from "vitest";
import { calculateEV } from "./ev";

describe("calculateEV", () => {
  it("classifies -120 with 0.55 as W", () => {
    const result = calculateEV({ odds: -120, winProb: 0.55 });
    expect(result.verdict).toBe("W");
    expect(Number(result.evPerStake.toFixed(3))).toBeCloseTo(0.008, 3);
  });

  it("classifies +150 with 0.35 as L", () => {
    const result = calculateEV({ odds: 150, winProb: 0.35 });
    expect(result.verdict).toBe("L");
    expect(Number(result.evPerStake.toFixed(3))).toBeCloseTo(-0.125, 3);
  });

  it("handles positive odds correctly", () => {
    const result = calculateEV({ odds: 200, winProb: 0.5 });
    // Decimal odds: 1 + 200/100 = 3.0
    // Implied prob: 1/3 = 0.333...
    // Profit if win: 3.0 - 1 = 2.0
    // EV: 0.5 * 2.0 - 0.5 * 1 = 1.0 - 0.5 = 0.5
    expect(result.decimalOdds).toBe(3);
    expect(result.evPerStake).toBeCloseTo(0.5, 2);
    expect(result.verdict).toBe("W");
  });

  it("handles negative odds correctly", () => {
    const result = calculateEV({ odds: -200, winProb: 0.6 });
    // Decimal odds: 1 + 100/200 = 1.5
    // Profit if win: 1.5 - 1 = 0.5
    // EV: 0.6 * 0.5 - 0.4 * 1 = 0.3 - 0.4 = -0.1
    expect(result.decimalOdds).toBe(1.5);
    expect(result.evPerStake).toBeCloseTo(-0.1, 2);
    expect(result.verdict).toBe("L");
  });

  it("uses fairProb when provided", () => {
    const result = calculateEV({
      odds: -120,
      winProb: 0.5,
      fairProb: 0.6,
    });
    // Should use fairProb (0.6) instead of winProb (0.5)
    expect(result.fairProbUsed).toBe(0.6);
  });

  it("uses default stake of 1 when not provided", () => {
    const result = calculateEV({ odds: -120, winProb: 0.55 });
    // Should work without stake parameter
    expect(result).toBeDefined();
    expect(result.evPerStake).toBeDefined();
  });

  it("validates input odds", () => {
    expect(() => calculateEV({ odds: NaN, winProb: 0.5 })).toThrow(
      "Invalid odds"
    );
  });

  it("validates input winProb", () => {
    expect(() => calculateEV({ odds: -120, winProb: 1.5 })).toThrow(
      "Invalid winProb"
    );
    expect(() => calculateEV({ odds: -120, winProb: -0.1 })).toThrow(
      "Invalid winProb"
    );
  });

  it("validates input stake", () => {
    expect(() => calculateEV({ odds: -120, winProb: 0.5, stake: 0 })).toThrow(
      "Invalid stake"
    );
    expect(() => calculateEV({ odds: -120, winProb: 0.5, stake: -1 })).toThrow(
      "Invalid stake"
    );
  });

  it("provides reasons in output", () => {
    const result = calculateEV({ odds: -120, winProb: 0.55 });
    expect(result.reasons).toBeDefined();
    expect(result.reasons.evRating).toContain("EV");
    expect(result.reasons.playerHistory).toBeDefined();
    expect(result.reasons.vibeAura).toBeDefined();
  });

  it("handles edge > 0.05 for trending hot", () => {
    const result = calculateEV({ odds: 200, winProb: 0.5 });
    // Edge: 0.5 - 0.333... = 0.166... > 0.05
    expect(result.edge).toBeGreaterThan(0.05);
    expect(result.reasons.playerHistory).toBe("Trending hot vs market 🔥");
  });

  it("handles edge < -0.05 for cold read", () => {
    const result = calculateEV({ odds: -300, winProb: 0.5 });
    // Decimal: 1 + 100/300 = 1.333...
    // Implied: 1/1.333 = 0.75
    // Edge: 0.5 - 0.75 = -0.25 < -0.05
    expect(result.edge).toBeLessThan(-0.05);
    expect(result.reasons.playerHistory).toBe("Cold read vs market ❄️");
  });

  it("handles edge within coin-flip range", () => {
    const result = calculateEV({ odds: -110, winProb: 0.52 });
    // Should be within the coin-flip range
    expect(Math.abs(result.edge)).toBeLessThanOrEqual(0.05);
    expect(result.reasons.playerHistory).toBe("Within coin-flip range 🪙");
  });
});
