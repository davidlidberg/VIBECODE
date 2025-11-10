/**
 * Odds utility functions for converting between formats and calculating probabilities.
 */

/**
 * Converts American odds to decimal odds.
 * @param odds - American odds (e.g., -120 or +150)
 * @returns Decimal odds (e.g., 1.8333 or 2.5)
 */
export function americanToDecimal(odds: number): number {
  if (!Number.isFinite(odds)) {
    throw new Error("Invalid odds");
  }
  return odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);
}

/**
 * Converts decimal odds to implied probability.
 * @param decimalOdds - Decimal odds (must be > 1)
 * @returns Implied probability (0 to 1)
 */
export function decimalToImpliedProb(decimalOdds: number): number {
  if (!(decimalOdds > 1)) {
    throw new Error("Invalid decimal odds");
  }
  return 1 / decimalOdds;
}

/**
 * Converts American odds directly to implied probability.
 * @param odds - American odds (e.g., -120 or +150)
 * @returns Implied probability (0 to 1)
 */
export function impliedProbFromAmerican(odds: number): number {
  return decimalToImpliedProb(americanToDecimal(odds));
}

/**
 * Removes vig from two-way odds and returns normalized fair probabilities.
 * @param decA - Decimal odds for side A
 * @param decB - Decimal odds for side B
 * @returns Normalized fair probabilities for both sides
 */
export function normalizeTwoWayFairProbs(decA: number, decB: number): {
  pA: number;
  pB: number;
} {
  const pa = 1 / decA;
  const pb = 1 / decB;
  const sum = pa + pb;
  return { pA: pa / sum, pB: pb / sum };
}
