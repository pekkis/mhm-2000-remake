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
import { createAITeam, createAIManager } from "@/__tests__/factories";

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
const makeContext = (phaseType: "round-robin" | "playoffs"): MatchContext => {
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

        expect(r.effects).toEqual([
          {
            amount: 0,
            team: 1,
            type: "incrementMorale"
          },
          {
            amount: 0,
            team: 2,
            type: "incrementMorale"
          }
        ]);
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

    expect(r.effects).toEqual([
      {
        amount: 1,
        team: 1,
        type: "incrementMorale"
      },
      {
        amount: -1,
        team: 2,
        type: "incrementMorale"
      }
    ]);
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

  // -------------------------------------------------------------------------
  // Intensity
  // -------------------------------------------------------------------------

  describe("intensity modifier", () => {
    it("HURJA (2) team beats LAISKA (0) team over many samples", () => {
      const hurja = sideFromTier(1, "Hurja", 25);
      hurja.team = makeTeam({ id: 1, name: "Hurja", tier: 25, intensity: 2 });
      const laiska = sideFromTier(2, "Laiska", 25);
      laiska.team = makeTeam({
        id: 2,
        name: "Laiska",
        tier: 25,
        intensity: 0
      });
      const random = createRandom(808);
      let hurjaWins = 0;
      let laiskaWins = 0;
      for (let i = 0; i < 500; i += 1) {
        const r = simulateMatch(hurja, laiska, regularContext, random);
        if (r.homeGoals > r.awayGoals) {hurjaWins += 1;}
        else if (r.awayGoals > r.homeGoals) {laiskaWins += 1;}
      }
      expect(hurjaWins).toBeGreaterThan(laiskaWins);
    });

    it("effective intensity is forced to normaali in tournaments", () => {
      const hurja = sideFromTier(1, "Hurja", 25);
      hurja.team = makeTeam({ id: 1, name: "Hurja", tier: 25, intensity: 2 });
      const laiska = sideFromTier(2, "Laiska", 25);
      laiska.team = makeTeam({
        id: 2,
        name: "Laiska",
        tier: 25,
        intensity: 0
      });

      const tournamentContext: MatchContext = {
        ...regularContext,
        phase: {
          type: "tournament",
          name: "test-tournament",
          teams: [],
          groups: []
        }
      };

      const random = createRandom(808);
      const results = Array.from({ length: 100 }, () =>
        simulateMatch(hurja, laiska, tournamentContext, random)
      );

      // Both should report effective intensity 1 (normaali)
      for (const r of results) {
        expect(r.homeIntensity).toBe(1);
        expect(r.awayIntensity).toBe(1);
      }
    });

    it("result carries effective intensity values", () => {
      const home = sideFromTier(1, "Home", 25);
      home.team = makeTeam({ id: 1, name: "Home", tier: 25, intensity: 2 });
      const away = sideFromTier(2, "Away", 25);
      away.team = makeTeam({ id: 2, name: "Away", tier: 25, intensity: 0 });

      const r = simulateMatch(home, away, regularContext, createRandom(1));
      expect(r.homeIntensity).toBe(2);
      expect(r.awayIntensity).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // Fan group (erik(1))
  // -------------------------------------------------------------------------

  describe("fan group service", () => {
    it("fanGroup=2 team outperforms fanGroup=0 team over many samples", () => {
      const withFans = sideFromTier(1, "Fans", 25);
      withFans.team = makeTeam({
        id: 1,
        name: "Fans",
        tier: 25,
        services: { fanGroup: 2, alcoholSales: 0, doping: 0, travel: 0 }
      });
      const noFans = sideFromTier(2, "NoFans", 25);

      const random = createRandom(303);
      let fansWins = 0;
      let noFansWins = 0;
      for (let i = 0; i < 500; i += 1) {
        const r = simulateMatch(withFans, noFans, regularContext, random);
        if (r.homeGoals > r.awayGoals) {fansWins += 1;}
        else if (r.awayGoals > r.homeGoals) {noFansWins += 1;}
      }
      // fanGroup=2 gives +0.02 etu to both home AND away matches
      // plus the regular home advantage → should win more
      expect(fansWins).toBeGreaterThan(noFansWins);
    });

    it("fanGroup is NOT applied in tournament context", () => {
      // Two identical teams, one with fanGroup=2. In a tournament
      // competition (doesTravelApply → false), services are gated off,
      // so results should be identical to two teams without services.
      const withFans = sideFromTier(1, "Fans", 25);
      withFans.team = makeTeam({
        id: 1,
        name: "Fans",
        tier: 25,
        services: { fanGroup: 2, alcoholSales: 0, doping: 0, travel: 0 }
      });
      const noFans = sideFromTier(2, "NoFans", 25);

      const tournamentContext: MatchContext = {
        competition: competitionDefinitions.tournaments.data,
        phase: {
          type: "tournament",
          name: "test-tournament",
          teams: [],
          groups: []
        },
        group: regularContext.group,
        round: 0,
        matchup: 0
      };

      const seed = 555;
      // Same two teams but both with no services, same seed
      const baseline1 = sideFromTier(1, "Base1", 25);
      const baseline2 = sideFromTier(2, "Base2", 25);

      const withServices = Array.from({ length: 100 }, (_, i) =>
        simulateMatch(
          withFans,
          noFans,
          tournamentContext,
          createRandom(seed + i)
        )
      );
      const withoutServices = Array.from({ length: 100 }, (_, i) =>
        simulateMatch(
          baseline1,
          baseline2,
          tournamentContext,
          createRandom(seed + i)
        )
      );

      // Identical seeds + identical effective params → identical results
      expect(withServices.map((r) => r.homeGoals)).toEqual(
        withoutServices.map((r) => r.homeGoals)
      );
    });
  });

  // -------------------------------------------------------------------------
  // Travel (erik(4))
  // -------------------------------------------------------------------------

  describe("travel service", () => {
    it("away team with travel=4 outperforms away team with travel=0", () => {
      // Home team is the same in both runs. Compare away win rates.
      const home = sideFromTier(1, "Home", 25);
      const awayWithTravel = sideFromTier(2, "AwayTravel", 25);
      awayWithTravel.team = makeTeam({
        id: 2,
        name: "AwayTravel",
        tier: 25,
        services: { fanGroup: 0, alcoholSales: 0, doping: 0, travel: 4 }
      });
      const awayNoTravel = sideFromTier(3, "AwayNoTravel", 25);

      const random1 = createRandom(777);
      const random2 = createRandom(777);
      let winsWithTravel = 0;
      let winsNoTravel = 0;

      for (let i = 0; i < 500; i += 1) {
        const r1 = simulateMatch(home, awayWithTravel, regularContext, random1);
        const r2 = simulateMatch(home, awayNoTravel, regularContext, random2);
        if (r1.awayGoals > r1.homeGoals) {winsWithTravel += 1;}
        if (r2.awayGoals > r2.homeGoals) {winsNoTravel += 1;}
      }
      // travel=4 gives +0.08 etu to the away side → more away wins
      expect(winsWithTravel).toBeGreaterThan(winsNoTravel);
    });

    it("travel is NOT applied in tournament context", () => {
      const home = sideFromTier(1, "Home", 25);
      const awayWithTravel = sideFromTier(2, "AwayTravel", 25);
      awayWithTravel.team = makeTeam({
        id: 2,
        name: "AwayTravel",
        tier: 25,
        services: { fanGroup: 0, alcoholSales: 0, doping: 0, travel: 4 }
      });
      const awayNoTravel = sideFromTier(3, "AwayNoTravel", 25);

      const tournamentContext: MatchContext = {
        competition: competitionDefinitions.tournaments.data,
        phase: {
          type: "tournament",
          name: "test-tournament",
          teams: [],
          groups: []
        },
        group: regularContext.group,
        round: 0,
        matchup: 0
      };

      // Same seed → identical results when services are gated off
      const withTravel = Array.from({ length: 50 }, (_, i) =>
        simulateMatch(
          home,
          awayWithTravel,
          tournamentContext,
          createRandom(900 + i)
        )
      );
      const withoutTravel = Array.from({ length: 50 }, (_, i) =>
        simulateMatch(
          home,
          awayNoTravel,
          tournamentContext,
          createRandom(900 + i)
        )
      );

      expect(withTravel.map((r) => r.awayGoals)).toEqual(
        withoutTravel.map((r) => r.awayGoals)
      );
    });
  });
});
