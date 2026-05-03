import { describe, it, expect } from "vitest";
import { getEffective, getEffectiveOpponent } from "@/services/effects";
import type { Team, TeamEffect } from "@/state/game";

const makeTeam = (overrides: Partial<Team> = {}): Team => ({
  id: 0,
  uid: "salo",
  name: "Pier Paolo Pasolini FC",
  city: "Bologna",
  tags: [],
  arena: {
    level: 1,
    standingCount: 0,
    seatedCount: 0,
    hasBoxes: false,
    valuePoints: 0
  },
  strength: 50,
  domestic: true,
  morale: 50,
  strategy: 0,
  readiness: 0,
  effects: [],
  opponentEffects: [],
  manager: undefined,
  ...overrides
});

describe("effects", () => {
  describe("getEffective", () => {
    it("should return team unchanged when there are no effects", () => {
      const team = makeTeam({ strength: 60, morale: 40 });
      const result = getEffective(team);
      expect(result.strength).toBe(60);
      expect(result.morale).toBe(40);
    });

    it("should apply a single numeric strength effect", () => {
      const team = makeTeam({
        strength: 50,
        effects: [{ parameter: ["strength"], amount: 10, duration: 1 }]
      });
      const result = getEffective(team);
      expect(result.strength).toBe(60);
    });

    it("should apply a single numeric morale effect", () => {
      const team = makeTeam({
        morale: 50,
        effects: [{ parameter: ["morale"], amount: -5, duration: 2 }]
      });
      const result = getEffective(team);
      expect(result.morale).toBe(45);
    });

    it("should apply multiple effects cumulatively", () => {
      const effects: TeamEffect[] = [
        { parameter: ["strength"], amount: 10, duration: 1 },
        { parameter: ["strength"], amount: -3, duration: 1 },
        { parameter: ["morale"], amount: 5, duration: 1 }
      ];
      const team = makeTeam({ strength: 50, morale: 40, effects });
      const result = getEffective(team);
      expect(result.strength).toBe(57);
      expect(result.morale).toBe(45);
    });

    it("should apply named 'rally' effect", () => {
      const team = makeTeam({
        morale: 30,
        effects: [
          {
            parameter: ["morale"],
            amount: "rally",
            duration: 1,
            extra: { rallyMorale: 75 }
          }
        ]
      });
      const result = getEffective(team);
      // rally replaces morale with the rallyMorale value
      expect(result.morale).toBe(75);
    });

    it("should throw for unknown named effect", () => {
      const team = makeTeam({
        effects: [
          {
            parameter: ["strength"],
            amount: "nonexistent_effect",
            duration: 1
          }
        ]
      });
      expect(() => getEffective(team)).toThrow(
        'Unknown named effect "nonexistent_effect"'
      );
    });

    it("should not mutate the original team", () => {
      const team = makeTeam({
        strength: 50,
        effects: [{ parameter: ["strength"], amount: 10, duration: 1 }]
      });
      const original = { ...team };
      getEffective(team);
      expect(team.strength).toBe(original.strength);
    });
  });

  describe("getEffectiveOpponent", () => {
    it("should return team unchanged when opponent has no opponentEffects", () => {
      const team = makeTeam({ strength: 60 });
      const opponent = makeTeam({ opponentEffects: [] });
      const result = getEffectiveOpponent(team, opponent);
      expect(result.strength).toBe(60);
    });

    it("should apply opponent's opponentEffects to the target team", () => {
      const team = makeTeam({ strength: 60 });
      const opponent = makeTeam({
        opponentEffects: [{ parameter: ["strength"], amount: -10, duration: 1 }]
      });
      const result = getEffectiveOpponent(team, opponent);
      expect(result.strength).toBe(50);
    });

    it("should apply multiple opponent effects", () => {
      const team = makeTeam({ strength: 60, morale: 50 });
      const opponent = makeTeam({
        opponentEffects: [
          { parameter: ["strength"], amount: -5, duration: 1 },
          { parameter: ["morale"], amount: -10, duration: 1 }
        ]
      });
      const result = getEffectiveOpponent(team, opponent);
      expect(result.strength).toBe(55);
      expect(result.morale).toBe(40);
    });

    it("should not be affected by opponent's own effects (only opponentEffects)", () => {
      const team = makeTeam({ strength: 60 });
      const opponent = makeTeam({
        effects: [{ parameter: ["strength"], amount: 100, duration: 1 }],
        opponentEffects: [{ parameter: ["strength"], amount: -5, duration: 1 }]
      });
      const result = getEffectiveOpponent(team, opponent);
      expect(result.strength).toBe(55);
    });
  });

  describe("getEffective + getEffectiveOpponent composition", () => {
    it("should chain correctly: apply own effects then opponent effects", () => {
      const team = makeTeam({
        strength: 50,
        effects: [{ parameter: ["strength"], amount: 10, duration: 1 }]
      });
      const opponent = makeTeam({
        opponentEffects: [{ parameter: ["strength"], amount: -5, duration: 1 }]
      });

      // This is the actual game.ts pattern:
      // getEffectiveOpponent(getEffective(team), opponent)
      const effective = getEffective(team);
      expect(effective.strength).toBe(60);

      const withOpponentEffects = getEffectiveOpponent(effective, opponent);
      expect(withOpponentEffects.strength).toBe(55);
    });
  });
});
