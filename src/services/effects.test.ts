import { describe, it, expect } from "vitest";
import { getEffective, getEffectiveOpponent } from "@/services/effects";
import type { AITeam, TeamEffect } from "@/state/game";
import { rollTeamStrength } from "@/services/levels";
import { createAITeam } from "@/__tests__/factories";

const makeTeam = (overrides: Partial<AITeam> = {}): AITeam =>
  createAITeam({
    uid: "salo",
    name: "Pier Paolo Pasolini FC",
    city: "Bologna",
    morale: 50,
    readiness: 0,
    strengthObj: rollTeamStrength(30),
    ...overrides
  });

describe("effects", () => {
  describe("getEffective", () => {
    it("should return team unchanged when there are no effects", () => {
      const team = makeTeam({ morale: 40 });
      const result = getEffective(team);
      expect(result.morale).toBe(40);
    });

    it("should apply a single numeric strength effect", () => {
      const team = makeTeam({
        morale: 50,
        effects: [{ parameter: ["morale"], amount: 10, duration: 1 }]
      });
      const result = getEffective(team);
      expect(result.morale).toBe(60);
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
        { parameter: ["morale"], amount: 5, duration: 1 },
        { parameter: ["morale"], amount: 5, duration: 1 }
      ];
      const team = makeTeam({ morale: 40, effects });
      const result = getEffective(team);

      expect(result.morale).toBe(50);
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
        morale: 50,
        effects: [{ parameter: ["morale"], amount: 10, duration: 1 }]
      });
      const original = { ...team };
      getEffective(team);
      expect(team.morale).toBe(original.morale);
    });
  });

  describe("getEffectiveOpponent", () => {
    it("should return team unchanged when opponent has no opponentEffects", () => {
      const team = makeTeam({ morale: 60 });
      const opponent = makeTeam({ opponentEffects: [] });
      const result = getEffectiveOpponent(team, opponent);
      expect(result.morale).toBe(60);
    });

    it("should apply opponent's opponentEffects to the target team", () => {
      const team = makeTeam({ morale: 60 });
      const opponent = makeTeam({
        morale: 100,
        opponentEffects: [{ parameter: ["morale"], amount: -10, duration: 1 }]
      });
      const result = getEffectiveOpponent(team, opponent);
      expect(result.morale).toBe(50);
    });

    it("should apply multiple opponent effects", () => {
      const team = makeTeam({ morale: 50 });
      const opponent = makeTeam({
        opponentEffects: [{ parameter: ["morale"], amount: -10, duration: 1 }]
      });
      const result = getEffectiveOpponent(team, opponent);
      expect(result.morale).toBe(40);
    });

    it("should not be affected by opponent's own effects (only opponentEffects)", () => {
      const team = makeTeam({ morale: 50 });
      const opponent = makeTeam({
        effects: [{ parameter: ["morale"], amount: -3, duration: 1 }],
        opponentEffects: [{ parameter: ["morale"], amount: 4, duration: 1 }]
      });
      const result = getEffectiveOpponent(team, opponent);
      expect(result.morale).toBe(54);
    });
  });
});
