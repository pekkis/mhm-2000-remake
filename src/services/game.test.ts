import { describe, it, expect } from "vitest";
import { resultFacts, gameFacts } from "@/services/game";
import type { GameResult } from "@/types/competitions";

describe("game service", () => {
  describe("resultFacts", () => {
    it("should detect a home win", () => {
      const result: GameResult = { home: 3, away: 1, overtime: false };
      const facts = resultFacts(result, "home");
      expect(facts).toEqual({ isWin: true, isDraw: false, isLoss: false });
    });

    it("should detect an away win", () => {
      const result: GameResult = { home: 1, away: 4, overtime: false };
      const facts = resultFacts(result, "away");
      expect(facts).toEqual({ isWin: true, isDraw: false, isLoss: false });
    });

    it("should detect a home loss", () => {
      const result: GameResult = { home: 0, away: 2, overtime: false };
      const facts = resultFacts(result, "home");
      expect(facts).toEqual({ isWin: false, isDraw: false, isLoss: true });
    });

    it("should detect a draw", () => {
      const result: GameResult = { home: 2, away: 2, overtime: false };
      const facts = resultFacts(result, "home");
      expect(facts).toEqual({ isWin: false, isDraw: true, isLoss: false });
    });

    it("should detect a draw for away team too", () => {
      const result: GameResult = { home: 0, away: 0, overtime: false };
      const facts = resultFacts(result, "away");
      expect(facts).toEqual({ isWin: false, isDraw: true, isLoss: false });
    });

    it("should work with overtime results", () => {
      const result: GameResult = { home: 4, away: 3, overtime: true };
      const homeFacts = resultFacts(result, "home");
      const awayFacts = resultFacts(result, "away");
      expect(homeFacts.isWin).toBe(true);
      expect(awayFacts.isLoss).toBe(true);
    });
  });

  describe("gameFacts", () => {
    it("should resolve facts for home team", () => {
      const game = {
        home: 5,
        away: 10,
        result: { home: 3, away: 1, overtime: false } as GameResult
      };
      const facts = gameFacts(game, 5); // team 5 is home
      expect(facts.isWin).toBe(true);
    });

    it("should resolve facts for away team", () => {
      const game = {
        home: 5,
        away: 10,
        result: { home: 3, away: 1, overtime: false } as GameResult
      };
      const facts = gameFacts(game, 10); // team 10 is away
      expect(facts.isLoss).toBe(true);
    });

    it("should handle draws correctly", () => {
      const game = {
        home: 5,
        away: 10,
        result: { home: 2, away: 2, overtime: false } as GameResult
      };
      expect(gameFacts(game, 5).isDraw).toBe(true);
      expect(gameFacts(game, 10).isDraw).toBe(true);
    });
  });
});
