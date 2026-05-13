/**
 * Tests for the new-game wizard's manager-strength + team-gating port.
 *
 * Pinned against the QB SUB omasopimus algorithm (`ILEZ5.BAS:1133`) and the
 * SELECT CASE ladder at `MHM2K.BAS:1842` / `ILEZ5.BAS:1156`.
 */

import { describe, it, expect } from "vitest";

import {
  computeManagerStrength,
  computeTeamThreshold,
  isTeamSelectable,
  sin1ToThreshold,
  statsFromExperience
} from "@/machines/new-game";
import { emptyAchievements } from "@/services/empties";
import type { AchievementsStat, GamesPlayedStats } from "@/state/game";
import type { ManagedTeamDefinition } from "@/data/mhm2000/teams";

// ---------------------------------------------------------------------------
// Stub builders
// ---------------------------------------------------------------------------

const emptyStats = (): {
  games: GamesPlayedStats;
  achievements: AchievementsStat;
} => ({
  games: {},
  achievements: emptyAchievements()
});

const buildTeam = (
  previousRankings: [number, number, number]
): ManagedTeamDefinition => ({
  kind: "managed",
  id: 0,
  name: "Pasolini",
  city: "Hirvikoski",
  league: "phl",
  previousRankings,
  tier: 30,
  arena: {
    name: "Stadio Olimpico",
    level: 1,
    standingCount: 30,
    seatedCount: 30,
    hasBoxes: false,
    valuePoints: 0
  },
  tags: [],
  nationality: "FI"
});

// ---------------------------------------------------------------------------
// computeManagerStrength
// ---------------------------------------------------------------------------

describe("computeManagerStrength (sin1)", () => {
  it("returns 0 for a clean rookie (no games, no achievements)", () => {
    expect(computeManagerStrength(emptyStats())).toBe(0);
  });

  it("PHL regular season: games × 0.3 × win-rate modifier (50% baseline)", () => {
    // 10 games, 5W/0T/5L → 50% win-rate → modifier (1 + 0) = 1.
    const stats = emptyStats();
    stats.games.phl = { 0: { win: 5, draw: 0, loss: 5 } };
    // sin1 = 10 * 0.3 * 1 = 3.
    expect(computeManagerStrength(stats)).toBeCloseTo(3, 6);
  });

  it("PHL regular season: 100% win-rate boosts modifier to (1 + 50*0.004)=1.2", () => {
    const stats = emptyStats();
    stats.games.phl = { 0: { win: 10, draw: 0, loss: 0 } };
    // sin1 = 10 * 0.3 * 1.2 = 3.6.
    expect(computeManagerStrength(stats)).toBeCloseTo(3.6, 6);
  });

  it("PHL regular season: 0% win-rate drops modifier to (1 - 50*0.004)=0.8", () => {
    const stats = emptyStats();
    stats.games.phl = { 0: { win: 0, draw: 0, loss: 10 } };
    // sin1 = 10 * 0.3 * 0.8 = 2.4.
    expect(computeManagerStrength(stats)).toBeCloseTo(2.4, 6);
  });

  it("PHL playoff games: phase>=1 contribute 1.0 each (bonus on top of regular)", () => {
    const stats = emptyStats();
    // 4 PO games (all wins): contributes
    //   regular branch: 0 (no phase 0), then * 0.3 weight uses ALL games for sin2.
    //   But: sin2 denominator = total games (here 4). win-rate=100% → modifier 1.2.
    //   regular all.games is sumGames("all")=4 → 4 * 0.3 * 1.2 = 1.44
    //   po branch:      4 * 1.0           = 4
    //   sin1 = 5.44
    stats.games.phl = { 1: { win: 4, draw: 0, loss: 0 } };
    expect(computeManagerStrength(stats)).toBeCloseTo(5.44, 6);
  });

  it("Divisioona uses 0.2/0.6 weights", () => {
    const stats = emptyStats();
    stats.games.division = {
      0: { win: 5, draw: 0, loss: 5 }, // 10 reg @ 50%
      1: { win: 2, draw: 0, loss: 0 } // 2 PO
    };
    // all.games=12, wins=7, ties=0 → sin2 = (7/12)*100 ≈ 58.333.
    // mod = 1 + (58.333-50)*0.004 ≈ 1.03333.
    // sin1 = 12 * 0.2 * 1.03333 + 2 * 0.6 = 2.48 + 1.2 = 3.68.
    expect(computeManagerStrength(stats)).toBeCloseTo(3.68, 4);
  });

  it("Mutasarja uses 0.1/0.3 weights", () => {
    const stats = emptyStats();
    stats.games.mutasarja = { 0: { win: 5, draw: 0, loss: 5 } };
    // 10 * 0.1 * 1 = 1.
    expect(computeManagerStrength(stats)).toBeCloseTo(1, 6);
  });

  it("EHL: per-game flat 1.0 + extra 10.0 for playoff games (PO double-counted), IGNORES win-rate", () => {
    const stats = emptyStats();
    stats.games.ehl = {
      0: { win: 0, draw: 0, loss: 4 }, // 4 reg, 0% win
      1: { win: 0, draw: 0, loss: 2 } // 2 PO, 0% win
    };
    // QB: sin1 += otte(4,1) * 1 (TOTAL games, includes playoffs)
    //     sin1 += otte(4,2) * 10 (playoff games, additional bonus)
    // → 6 * 1 + 2 * 10 = 26.
    expect(computeManagerStrength(stats)).toBe(26);
  });

  it("achievements: gold=20, silver=15, bronze=10, ehl=20, promoted=10, relegated=-10, cup=15", () => {
    const stats = emptyStats();
    stats.achievements = {
      gold: 1, // +20
      silver: 1, // +15
      bronze: 1, // +10
      ehl: 1, // +20
      promoted: 1, // +10
      relegated: 1, // -10
      cup: 1 // +15
    };
    // Sum = 20+15+10+20+10-10+15 = 80.
    expect(computeManagerStrength(stats)).toBe(80);
  });

  it("draws (ties): each tie counts as 0.5 in sin2 win-rate", () => {
    const stats = emptyStats();
    // 10 PHL: 0W/10T/0L → win-rate = 50% (10*0.5/10).
    stats.games.phl = { 0: { win: 0, draw: 10, loss: 0 } };
    expect(computeManagerStrength(stats)).toBeCloseTo(3, 6);
  });
});

// ---------------------------------------------------------------------------
// sin1ToThreshold — exhaustive ladder coverage
// ---------------------------------------------------------------------------

describe("sin1ToThreshold (MHM2K.BAS:1842 SELECT CASE)", () => {
  // [sin1, threshold]. Includes both intentional gaps.
  const cases: Array<[number, number]> = [
    // Band: 0..6 → 44
    [0, 44],
    [3, 44],
    [6, 44],
    // Band: 7..12 → 40
    [7, 40],
    [12, 40],
    // Band: 13..18 → 35
    [13, 35],
    [18, 35],
    // INTENTIONAL GAP: 19, 20 → 0
    [19, 0],
    [20, 0],
    // Band: 21..30 → 29
    [21, 29],
    [30, 29],
    // Band: 31..50 → 23
    [31, 23],
    [50, 23],
    // Band: 51..80 → 18
    [51, 18],
    [80, 18],
    // Band: 81..110 → 14
    [81, 14],
    [110, 14],
    // INTENTIONAL GAP: 111..120 → 0
    [111, 0],
    [115, 0],
    [120, 0],
    // Band: 121..150 → 10
    [121, 10],
    [150, 10],
    // Band: 151..200 → 8
    [151, 8],
    [200, 8],
    // Band: 201..300 → 6
    [201, 6],
    [300, 6],
    // Band: 301..400 → 4
    [301, 4],
    [400, 4],
    // Band: 401..500 → 3
    [401, 3],
    [500, 3],
    // Band: >=501 → 1
    [501, 1],
    [9999, 1]
  ];
  it.each(cases)("sin1=%i → threshold %i", (sin1, expected) => {
    expect(sin1ToThreshold(sin1)).toBe(expected);
  });

  it("negative sin1 → falls through to 0 (no QB band covers it)", () => {
    expect(sin1ToThreshold(-1)).toBe(0);
    expect(sin1ToThreshold(-100)).toBe(0);
  });

  it("non-integer sin1 in 19.5 region: still falls through (gap is integer-keyed)", () => {
    // QB tests INTEGER sin1; we just preserve it. 19.5 ∈ (19, 20] → both
    // `sin1 >= 13 && sin1 <= 18` (false, 19.5 > 18) and
    // `sin1 >= 21 && sin1 <= 30` (false, 19.5 < 21) → 0.
    expect(sin1ToThreshold(19.5)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// computeTeamThreshold — sanity wiring
// ---------------------------------------------------------------------------

describe("computeTeamThreshold", () => {
  it("composes computeManagerStrength + sin1ToThreshold", () => {
    const stats = emptyStats();
    // sin1 = 0 → threshold = 44.
    expect(computeTeamThreshold(stats)).toBe(44);
  });

  it("legend-tier achievements push the manager into the elite band", () => {
    const stats = emptyStats();
    // Pile on 30 cup wins: 30 * 15 = 450. Falls into 401..500 → 3.
    stats.achievements.cup = 30;
    expect(computeTeamThreshold(stats)).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// isTeamSelectable — the QB gate
// ---------------------------------------------------------------------------

describe("isTeamSelectable", () => {
  it("rookie (sin1=0, threshold=44): only the worst teams pass", () => {
    const stats = emptyStats();
    // Avg ranking 44 → exactly equal → passes.
    expect(isTeamSelectable(buildTeam([44, 44, 44]), stats)).toBe(true);
    // Avg 43 → fails (< 44).
    expect(isTeamSelectable(buildTeam([43, 43, 43]), stats)).toBe(false);
  });

  it("strong manager (sin1=450, threshold=3): top 1-2 teams stay blocked; everything else opens up", () => {
    const stats = emptyStats();
    stats.achievements.cup = 30; // sin1 = 450, threshold = 3.
    // QB rule is `avg >= a`. avg=1 < 3 → BLOCKED. The top of the
    // pyramid is gated off even for legendary managers — a tiny QB
    // courtesy preventing instant Jokerit grabs. Verbatim port,
    // verbatim weirdness.
    expect(isTeamSelectable(buildTeam([1, 1, 1]), stats)).toBe(false);
    expect(isTeamSelectable(buildTeam([2, 2, 2]), stats)).toBe(false);
    // avg=3 → exactly meets threshold.
    expect(isTeamSelectable(buildTeam([3, 3, 3]), stats)).toBe(true);
    // Mid and bottom teams obviously pass.
    expect(isTeamSelectable(buildTeam([20, 20, 20]), stats)).toBe(true);
    expect(isTeamSelectable(buildTeam([48, 48, 48]), stats)).toBe(true);
  });

  it("absolute peak manager (threshold=1): every team selectable, including #1", () => {
    const stats = emptyStats();
    // Need sin1 >= 501. 50 cup wins = 750 → threshold = 1.
    stats.achievements.cup = 50;
    expect(isTeamSelectable(buildTeam([1, 1, 1]), stats)).toBe(true);
    expect(isTeamSelectable(buildTeam([48, 48, 48]), stats)).toBe(true);
  });

  it("uses (sed + sedd + seddd) / 3 — the rolling 3-season average", () => {
    const stats = emptyStats();
    // sin1 = 0, threshold = 44. avg = (10+50+72)/3 = 44 → passes.
    expect(isTeamSelectable(buildTeam([10, 50, 72]), stats)).toBe(true);
    // avg = (10+50+71)/3 = 43.666... → fails.
    expect(isTeamSelectable(buildTeam([10, 50, 71]), stats)).toBe(false);
  });

  it("inside the QB sin1∈{19,20} GAP: threshold collapses to 0, every team passes", () => {
    // Build stats producing sin1 = 19.
    // Easiest: 1 cup (15) + 4 promoted (4*10=40) → 55. Too high.
    // Just stub via a raw stats blob — sin1 = 19 if we set:
    //   1 silver (15) + … not easy. Use a freshly tuned achievement combo:
    //   1 silver (15) + 2 relegated (-20) + 2.4 cups → not integer.
    // Stick to PHL games for clean integer sin1: 19 ÷ 0.3 = 63.33 reg games
    // at 50%. Use 100%: 19 / (0.3*1.2) = 52.78. Awkward.
    // Cleanest path: 1 silver + 1 bronze - 1 relegated + 1 cup =
    //   15 + 10 - 10 + 15 = 30. Nope. Try: 1 ehl (20) - 1 relegated (-10)
    //   + 1 promoted (10) - 1 relegated (-10) + 1 promoted (10)…
    // Skip the trick — just call `sin1ToThreshold(19)` confirms 0 already
    // (covered above). Verify that when threshold is 0, even avg-48 passes.
    const stats = emptyStats();
    // Force the threshold-0 outcome by feeding a sin1 inside the gap via
    // computeManagerStrength: pile 19 promotions (190)? No, that's 121-150 band.
    // Direct check: a stats blob with sin1=0 maps to threshold 44, NOT 0.
    // The "every team passes" claim is about the gap value itself; tested
    // via sin1ToThreshold(19) === 0 above. Round-tripping via stats is too
    // brittle — a single asserted invariant is enough.
    expect(sin1ToThreshold(19)).toBe(0);
    // And confirm the predicate behaviour at threshold = 0:
    const team = buildTeam([1, 1, 1]); // best-ranked
    // Stats giving sin1 = 0 → threshold 44 → fails. So we synthesise the
    // gap by directly feeding `isTeamSelectable` a stats source that lands
    // in another threshold-0 band. The only stats-reachable threshold=0
    // requires sin1 in {19, 20} or {111..120}. Promotions pay 10 apiece,
    // so 12 promoted = 120 → in the second gap.
    stats.achievements.promoted = 12; // sin1 = 120 → threshold = 0.
    expect(isTeamSelectable(team, stats)).toBe(true);
    // Even a worst-team passes:
    expect(isTeamSelectable(buildTeam([48, 48, 48]), stats)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// statsFromExperience — sanity ordering
// ---------------------------------------------------------------------------

describe("statsFromExperience ordering", () => {
  it("rookie ≤ veteran ≤ legend strength", () => {
    const r = computeManagerStrength(statsFromExperience("rookie"));
    const v = computeManagerStrength(statsFromExperience("veteran"));
    const l = computeManagerStrength(statsFromExperience("legend"));
    expect(r).toBeLessThanOrEqual(v);
    expect(v).toBeLessThanOrEqual(l);
  });
});
