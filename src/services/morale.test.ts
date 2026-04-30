import { describe, it, expect } from "vitest";
import { defaultMoraleBoost } from "@/services/morale";
import type { GameFacts } from "@/types/competitions";

describe("defaultMoraleBoost", () => {
  it("should return +1 for a win", () => {
    const facts: GameFacts = { isWin: true, isDraw: false, isLoss: false };
    expect(defaultMoraleBoost(facts)).toBe(1);
  });

  it("should return -1 for a loss", () => {
    const facts: GameFacts = { isWin: false, isDraw: false, isLoss: true };
    expect(defaultMoraleBoost(facts)).toBe(-1);
  });

  it("should return 0 for a draw", () => {
    const facts: GameFacts = { isWin: false, isDraw: true, isLoss: false };
    expect(defaultMoraleBoost(facts)).toBe(0);
  });

  it("should prioritize win over draw flag", () => {
    // Edge case: both isWin and isDraw set (shouldn't happen, but test robustness)
    const facts: GameFacts = { isWin: true, isDraw: true, isLoss: false };
    expect(defaultMoraleBoost(facts)).toBe(1);
  });
});
