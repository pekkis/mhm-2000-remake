/**
 * Tests for `generateEffectsFromMatchResult`.
 *
 * Verifies that match results are correctly translated into game-engine
 * effects — morale deltas, and eventually other post-match bookkeeping.
 * The match simulation itself is tested in `simulate-match.test.ts`;
 * these tests take a `MatchResult` as input.
 */
import { describe, expect, it } from "vitest";
import { generateEffectsFromMatchResult } from "@/services/mhm-2000/match-effects";
import { createRandom } from "@/services/random";
import {
  simulateMatch,
  type MatchContext,
  type MatchSide
} from "@/services/mhm-2000/simulate-match";
import { teamLevels } from "@/data/levels";
import competitionDefinitions from "@/data/competitions";
import type { AIManager, AITeam } from "@/state/game";
import type { Group, Phase } from "@/types/competitions";
import { createAITeam, createAIManager } from "@/__tests__/factories";

// ─── helpers ─────────────────────────────────────────────────────────

const makeTeam = (overrides: Partial<AITeam> = {}): AITeam => {
  const tier = overrides.tier ?? 30;
  const lvl = teamLevels[tier - 1];
  return createAITeam({
    name: "Pasolini United",
    city: "Bologna",
    tier,
    strengthObj: {
      goalie: lvl.goalie,
      defence: lvl.defence,
      attack: lvl.attack
    },
    readiness: 10,
    ...overrides
  });
};

const makeManager = (overrides: Partial<AIManager> = {}): AIManager =>
  createAIManager(overrides);

const makeSide = (id: number, tier = 25): MatchSide => ({
  team: makeTeam({ id, tier }),
  manager: makeManager({ id: `mgr-${id}` })
});

const makeContext = (
  groupType: Group["type"] = "round-robin"
): MatchContext => {
  const competition =
    groupType === "tournament"
      ? { ...competitionDefinitions.tournaments.data, meta: {} }
      : { ...competitionDefinitions.phl.data, meta: {} };

  const phase: Phase = {
    type: groupType === "tournament" ? "tournament" : "round-robin",
    name: "test-phase",
    teams: [],
    groups: []
  };

  const group: Group =
    groupType === "tournament" || groupType === "round-robin"
      ? {
          type: groupType,
          round: 0,
          name: "test-group",
          teams: [],
          schedule: [],
          stats: [],
          penalties: [],
          colors: []
        }
      : {
          type: "playoffs",
          round: 0,
          teams: [],
          matchups: [],
          winsToAdvance: 4,
          schedule: [],
          stats: []
        };

  return { competition, phase, group, round: 0, matchup: 0 };
};

/**
 * Simulate a match and generate effects from the result. Convenience
 * wrapper for tests that need both.
 */
const simulateAndGenerateEffects = (
  home: MatchSide,
  away: MatchSide,
  context: MatchContext,
  seed: number
) => {
  const result = simulateMatch(home, away, context, createRandom(seed));
  return { result, effects: generateEffectsFromMatchResult(result) };
};

// ─── tests ───────────────────────────────────────────────────────────

describe("generateEffectsFromMatchResult", () => {
  describe("morale deltas", () => {
    it("winner gets +1 morale, loser gets -1", () => {
      // Heavily mismatched to guarantee a decisive result.
      const strong = makeSide(1, 50);
      const weak = makeSide(2, 5);
      const context = makeContext("round-robin");

      const { result, effects } = simulateAndGenerateEffects(
        strong,
        weak,
        context,
        99
      );

      expect(result.homeGoals).toBeGreaterThan(result.awayGoals);
      expect(effects).toEqual([
        { type: "incrementMorale", team: 1, amount: 1 },
        { type: "incrementMorale", team: 2, amount: -1 }
      ]);
    });

    it("tie produces zero morale change for both sides", () => {
      // Two evenly-matched low-tier teams — OT ties are possible.
      const home = makeSide(1, 8);
      const away = makeSide(2, 8);
      const context = makeContext("round-robin");

      const random = createRandom(13);
      let tieSeen = false;
      for (let i = 0; i < 200; i += 1) {
        const result = simulateMatch(home, away, context, random);
        if (result.homeGoals === result.awayGoals) {
          tieSeen = true;
          const effects = generateEffectsFromMatchResult(result);
          expect(effects).toEqual([
            { type: "incrementMorale", team: 1, amount: 0 },
            { type: "incrementMorale", team: 2, amount: 0 }
          ]);
        }
      }
      expect(tieSeen).toBe(true);
    });

    it("playoff win gives +1 / -1 morale", () => {
      const home = makeSide(1, 40);
      const away = makeSide(2, 10);
      const context: MatchContext = {
        ...makeContext("round-robin"),
        phase: { type: "playoffs", name: "playoffs", teams: [], groups: [] },
        group: {
          type: "playoffs",
          round: 0,
          teams: [],
          matchups: [],
          winsToAdvance: 4,
          schedule: [],
          stats: []
        }
      };

      const { result, effects } = simulateAndGenerateEffects(
        home,
        away,
        context,
        42
      );

      // Playoffs always produce a winner (sudden death OT).
      expect(result.homeGoals).not.toEqual(result.awayGoals);
      const winnerAmount = result.homeGoals > result.awayGoals ? 1 : -1;
      expect(effects).toContainEqual({
        type: "incrementMorale",
        team: 1,
        amount: winnerAmount
      });
      expect(effects).toContainEqual({
        type: "incrementMorale",
        team: 2,
        amount: -winnerAmount
      });
    });
  });

  describe("tournament morale skip", () => {
    it("tournament matches produce no morale effects", () => {
      // QB `turnauz <> 0` → morttivertti: block is skipped entirely.
      const home = makeSide(1, 50);
      const away = makeSide(2, 5);
      const context = makeContext("tournament");

      const { effects } = simulateAndGenerateEffects(home, away, context, 99);

      expect(effects).toEqual([]);
    });

    it("tournament matches produce no effects even on a tie", () => {
      const home = makeSide(1, 8);
      const away = makeSide(2, 8);
      const context = makeContext("tournament");

      const random = createRandom(13);
      for (let i = 0; i < 100; i += 1) {
        const result = simulateMatch(home, away, context, random);
        const effects = generateEffectsFromMatchResult(result);
        expect(effects).toEqual([]);
      }
    });

    it("same teams get morale effects in league but not in tournament", () => {
      // Same seed, same teams — the only difference is the competition.
      const home = makeSide(1, 50);
      const away = makeSide(2, 5);

      const leagueResult = simulateMatch(
        home,
        away,
        makeContext("round-robin"),
        createRandom(99)
      );
      const tournamentResult = simulateMatch(
        home,
        away,
        makeContext("tournament"),
        createRandom(99)
      );

      const leagueEffects = generateEffectsFromMatchResult(leagueResult);
      const tournamentEffects =
        generateEffectsFromMatchResult(tournamentResult);

      // League: should have morale effects
      expect(leagueEffects.length).toBeGreaterThan(0);
      expect(leagueEffects.some((e) => e.type === "incrementMorale")).toBe(
        true
      );

      // Tournament: empty
      expect(tournamentEffects).toEqual([]);
    });
  });
});
