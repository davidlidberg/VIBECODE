/**
 * Service wrapper for Expected Value calculations.
 * Provides a local, synchronous interface for EV calculations.
 */
import { calculateEV, EVInput, EVOutput } from "../utils/ev";

/**
 * Gets Expected Value calculation for given betting parameters.
 * This is a local, synchronous operation with no network calls.
 * @param input - EVInput containing odds, winProb, optional stake
 * @returns EVOutput with calculation results and verdict
 * @throws Error if input validation fails
 */
export function getEV(input: EVInput): EVOutput {
  // Schema guard - validate inputs
  if (!Number.isFinite(input.odds)) {
    throw new Error("Bad odds");
  }
  if (!(input.winProb >= 0 && input.winProb <= 1)) {
    throw new Error("Bad winProb");
  }
  const stake = input.stake ?? 1;
  if (!(stake > 0)) {
    throw new Error("Bad stake");
  }

  return calculateEV({ ...input, stake });
}
