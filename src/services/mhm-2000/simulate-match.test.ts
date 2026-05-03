/**
 * Sanity tests for `simulateMatch`.
 *
 * These are NOT a full validation of the QB port — that needs a
 * statistical fixture against the original game. They're shape /
 * smoke checks: deterministic with a seed, scores in a sane range,
 * morale deltas correct, overtime fires on a forced tie.
 */
import { describe, expect, it } from "vitest";
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

const makeTeam = (overrides: Partial<AITeam> = {}): AITeam => {
  const tier = overrides.tier ?? 30;
  const lvl = teamLevels[tier - 1];
  return {
    id: 0,
    uid: "test-team",
    name: "Pasolini United",
    city: "Bologna",
    kind: "ai",
    tags: [],
    tier,
    strengthObj: {
      goalie: lvl.goalie,
      defence: lvl.defence,
      attack: lvl.attack
    },
    arena: {
      level: 1,
      standingCount: 0,
      seatedCount: 0,
      hasBoxes: false,
      valuePoints: 0
    },
    strength: 50,
    domestic: true,
    morale: 0,
    strategy: 0,
    readiness: 10,
    effects: [],
    opponentEffects: [],
    manager: undefined,
    ...overrides
  };
};

const makeManager = (overrides: Partial<AIManager> = {}): AIManager => ({
  id: "ai-manager",
  name: "AI Manager",
  nationality: "FI",
  attributes: {
    strategy: 0,
    specialTeams: 0,
    negotiation: 0,
    resourcefulness: 0,
    charisma: 0,
    luck: 0
  },
  tags: [],
  kind: "ai",
  difficulty: 2,
  ...overrides
});

const sideFromTier = (
  id: number,
  name: string,
  tier: number,
  morale = 0,
  specialTeams = 0
): MatchSide => ({
  team: makeTeam({ id, name, tier, morale }),
  manager: makeManager({
    id: `mgr-${id}`,
    attributes: {
      strategy: 0,
      specialTeams,
      negotiation: 0,
      resourcefulness: 0,
      charisma: 0,
      luck: 0
    }
  })
});

/**
 * Build a `MatchContext` for the engine. PHL is used as the carrier
 * competition (etu 1.0 / 0.85) — the only thing the engine reads off
 * `competition` is `homeAndAwayTeamAdvantages(phase)`, and PHL gives
 * us a faithful regular-season slope. Playoffs reuse the same etu;
 * the only behavioural difference is `phase.type` driving overtime
 * mode in `competition-type.ts`.
 *
 * `group`/`round`/`matchup` are stub values — only the cup overtime
 * branch reads them (leg-1 aggregate lookup), and we don't simulate
 * cup matches here.
 */
const makeContext = (
  phaseType: "round-robin" | "playoffs"
): MatchContext => {
  const competition = competitionDefinitions.phl.data;
  const phase: Phase = {
    type: phaseType,
    name: "test-phase",
    teams: [],
    groups: []
  };
  const group: Group =
    phaseType === "round-robin"
      ? {
          type: "round-robin",
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

const regularContext = makeContext("round-robin");
const playoffContext = makeContext("playoffs");

describe("simulateMatch", () => {
  it("is deterministic for a given seed", () => {
    const home = sideFromTier(1, "TPS", 34);
    const away = sideFromTier(2, "HIFK", 31);

    const a = simulateMatch(home, away, regularContext, createRandom(42));
    const b = simulateMatch(home, away, regularContext, createRandom(42));
    expect(a).toEqual(b);
  });

  it("produces a sane regular-season score range", () => {
    const home = sideFromTier(1, "TPS", 34);
    const away = sideFromTier(2, "HIFK", 31);
    const random = createRandom(1);

    const totals: number[] = [];
    for (let i = 0; i < 100; i += 1) {
      const r = simulateMatch(home, away, regularContext, random);
      totals.push(r.homeGoals + r.awayGoals);
    }
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
    // Hockey scores: 4-6 goals total per game is the realistic band.
    // Wide bounds because we only have 100 samples.
    expect(avg).toBeGreaterThan(2);
    expect(avg).toBeLessThan(12);
  });

  it("playoff matches always have a winner (sudden death overtime)", () => {
    const home = sideFromTier(1, "TPS", 34);
    const away = sideFromTier(2, "HIFK", 31);
    const random = createRandom(7);
    for (let i = 0; i < 50; i += 1) {
      const r = simulateMatch(home, away, playoffContext, random);
      expect(r.homeGoals).not.toEqual(r.awayGoals);
    }
  });

  it("regular-season ties are allowed (single OT attempt may not score)", () => {
    // Two evenly-matched low-tier teams ⇒ low-scoring ⇒ OT-tie possible.
    const home = sideFromTier(1, "Pasolini PHL", 8);
    const away = sideFromTier(2, "Pasolini Reserves", 8);
    const random = createRandom(13);
    let tieSeen = false;
    for (let i = 0; i < 200; i += 1) {
      const r = simulateMatch(home, away, regularContext, random);
      if (r.homeGoals === r.awayGoals) {
        tieSeen = true;
        expect(r.overtime).toBe(true);
        expect(r.homeMoraleChange).toBe(0);
        expect(r.awayMoraleChange).toBe(0);
      }
    }
    expect(tieSeen).toBe(true);
  });

  it("winner gets +1 morale, loser -1", () => {
    // Heavily mismatched teams to make a decisive result very likely.
    const strong = sideFromTier(1, "Strong", 50);
    const weak = sideFromTier(2, "Weak", 5);
    const r = simulateMatch(strong, weak, regularContext, createRandom(99));
    expect(r.homeGoals).toBeGreaterThan(r.awayGoals);
    expect(r.homeMoraleChange).toBe(1);
    expect(r.awayMoraleChange).toBe(-1);
  });

  it("home advantage shows up over many samples", () => {
    const home = sideFromTier(1, "Home", 25);
    const away = sideFromTier(2, "Away", 25);
    const random = createRandom(2026);
    let homeWins = 0;
    let awayWins = 0;
    for (let i = 0; i < 500; i += 1) {
      const r = simulateMatch(home, away, regularContext, random);
      if (r.homeGoals > r.awayGoals) {
        homeWins += 1;
      } else if (r.awayGoals > r.homeGoals) {
        awayWins += 1;
      }
    }
    // QB etu: 1.0 vs 0.85 — home wins should clearly outpace away wins.
    expect(homeWins).toBeGreaterThan(awayWins);
  });

  it("manager specialTeams attribute boosts PP/PK weights", () => {
    // Same tier, but home has +3 specialTeams, away has -3.
    // Over many samples, home should win clearly more often than the
    // pure home-advantage delta alone would predict.
    const home = sideFromTier(1, "Home", 25, 0, 3);
    const away = sideFromTier(2, "Away", 25, 0, -3);
    const random = createRandom(31337);
    let homeWins = 0;
    let awayWins = 0;
    for (let i = 0; i < 500; i += 1) {
      const r = simulateMatch(home, away, regularContext, random);
      if (r.homeGoals > r.awayGoals) {
        homeWins += 1;
      } else if (r.awayGoals > r.homeGoals) {
        awayWins += 1;
      }
    }
    expect(homeWins).toBeGreaterThan(awayWins * 2);
  });
});
