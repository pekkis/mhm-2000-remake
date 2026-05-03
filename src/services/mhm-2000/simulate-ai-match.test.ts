/**
 * Sanity tests for `simulateAiMatch`.
 *
 * These are NOT a full validation of the QB port — that needs a
 * statistical fixture against the original game. They're shape /
 * smoke checks: deterministic with a seed, scores in a sane range,
 * morale deltas correct, overtime fires on a forced tie.
 */
import { describe, expect, it } from "vitest";
import { createRandom } from "@/services/random";
import {
  simulateAiMatch,
  type AiMatchTeam
} from "@/services/mhm-2000/simulate-ai-match";
import { teamLevels } from "@/data/levels";

const teamFromTier = (
  id: number,
  name: string,
  tier: number,
  morale = 0,
  specialTeams = 0
): AiMatchTeam => {
  const lvl = teamLevels[tier - 1];
  return {
    id,
    name,
    goalie: lvl.goalie,
    defence: lvl.defence,
    attack: lvl.attack,
    specialTeams,
    morale
  };
};

describe("simulateAiMatch", () => {
  it("is deterministic for a given seed", () => {
    const home = teamFromTier(1, "TPS", 34);
    const away = teamFromTier(2, "HIFK", 31);

    const a = simulateAiMatch(home, away, { type: 1 }, createRandom(42));
    const b = simulateAiMatch(home, away, { type: 1 }, createRandom(42));
    expect(a).toEqual(b);
  });

  it("produces a sane regular-season score range", () => {
    const home = teamFromTier(1, "TPS", 34);
    const away = teamFromTier(2, "HIFK", 31);
    const random = createRandom(1);

    const totals: number[] = [];
    for (let i = 0; i < 100; i += 1) {
      const r = simulateAiMatch(home, away, { type: 1 }, random);
      totals.push(r.homeGoals + r.awayGoals);
    }
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
    // Hockey scores: 4-6 goals total per game is the realistic band.
    // Wide bounds because we only have 100 samples.
    expect(avg).toBeGreaterThan(2);
    expect(avg).toBeLessThan(12);
  });

  it("playoff matches always have a winner (sudden death overtime)", () => {
    const home = teamFromTier(1, "TPS", 34);
    const away = teamFromTier(2, "HIFK", 31);
    const random = createRandom(7);
    for (let i = 0; i < 50; i += 1) {
      const r = simulateAiMatch(home, away, { type: 42 }, random);
      expect(r.homeGoals).not.toEqual(r.awayGoals);
    }
  });

  it("regular-season ties are allowed (single OT attempt may not score)", () => {
    // Two evenly-matched low-tier teams ⇒ low-scoring ⇒ OT-tie possible.
    const home = teamFromTier(1, "Pasolini PHL", 8);
    const away = teamFromTier(2, "Pasolini Reserves", 8);
    const random = createRandom(13);
    let tieSeen = false;
    for (let i = 0; i < 200; i += 1) {
      const r = simulateAiMatch(home, away, { type: 1 }, random);
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
    const strong = teamFromTier(1, "Strong", 50);
    const weak = teamFromTier(2, "Weak", 5);
    const r = simulateAiMatch(strong, weak, { type: 1 }, createRandom(99));
    expect(r.homeGoals).toBeGreaterThan(r.awayGoals);
    expect(r.homeMoraleChange).toBe(1);
    expect(r.awayMoraleChange).toBe(-1);
  });

  it("home advantage shows up over many samples", () => {
    const home = teamFromTier(1, "Home", 25);
    const away = teamFromTier(2, "Away", 25);
    const random = createRandom(2026);
    let homeWins = 0;
    let awayWins = 0;
    for (let i = 0; i < 500; i += 1) {
      const r = simulateAiMatch(home, away, { type: 1 }, random);
      if (r.homeGoals > r.awayGoals) {
        homeWins += 1;
      } else if (r.awayGoals > r.homeGoals) {
        awayWins += 1;
      }
    }
    // QB etu: 1.0 vs 0.85 — home wins should clearly outpace away wins.
    expect(homeWins).toBeGreaterThan(awayWins);
  });
});
