import { describe, expect, it } from "vitest";
import { MersenneTwister19937, Random } from "random-js";
import {
  competitionStrengthAverages,
  distributeAIStrategies,
  proxyRatio,
  rollStrategyFromWeights,
  STRATEGY_COMPETITION_IDS,
  strategyWeightsForProxy,
  type StrategyWeights
} from "@/services/strategy";
import { createRandomWithEngine } from "@/services/random";
import type { AIManager, AITeam, Manager } from "@/state/game";
import type { TeamStrength } from "@/data/levels";
import type { StrategyId } from "@/data/mhm2000/strategies";
import { emptyAchievements } from "@/services/empties";

/**
 * Tests for the QB `SUB valitsestrattie` port. Cross-references
 * MHM2K.BAS:2470-2503 / ILEZ5.BAS:1990-2034 throughout.
 */

const makeStrength = (overrides: Partial<TeamStrength> = {}): TeamStrength => ({
  goalie: 10,
  defence: 50,
  attack: 100,
  ...overrides
});

const makeTeam = (overrides: Partial<AITeam> = {}): AITeam => ({
  id: 0,
  uid: "t",
  name: "Team",
  city: "City",
  arena: {
    level: 1,
    standingCount: 0,
    seatedCount: 0,
    hasBoxes: false,
    valuePoints: 0
  },
  budget: {
    coaching: 3,
    benefits: 3,
    goalieCoaching: 3,
    health: 3,
    juniors: 3
  },
  domestic: true,
  morale: 0,
  strategy: 0,
  readiness: 1,
  effects: [],
  opponentEffects: [],
  manager: undefined,
  tags: [],
  tier: 30,
  kind: "ai",
  strengthObj: makeStrength(),
  ...overrides
});

const makeManager = (overrides: Partial<AIManager> = {}): AIManager => ({
  id: "m",
  name: "Manager",
  nationality: "FI",
  stats: {
    games: {},
    achievements: emptyAchievements()
  },
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

/**
 * Deterministic stub that always returns the boundary values of every
 * `random.integer(min, max)` call, so we can directly assert which
 * weight band a roll falls into.
 */
const fixedRandom = (value: number): Random =>
  ({
    integer: () => value,
    real: () => value,
    bool: () => false,
    pick: <T>(arr: T[]) => arr[0]
  }) as unknown as Random;

describe("strategy / valitsestrattie port", () => {
  describe("competitionStrengthAverages", () => {
    it("returns undefined for an empty list", () => {
      expect(competitionStrengthAverages([])).toBeUndefined();
    });

    it("computes per-component arithmetic mean (1-1 with QB koko())", () => {
      // QB: koko(1) = AVG(mw), koko(2) = AVG(pw), koko(3) = AVG(hw).
      const teams = [
        makeTeam({
          id: 0,
          strengthObj: { goalie: 10, defence: 50, attack: 100 }
        }),
        makeTeam({
          id: 1,
          strengthObj: { goalie: 20, defence: 70, attack: 140 }
        }),
        makeTeam({
          id: 2,
          strengthObj: { goalie: 30, defence: 90, attack: 180 }
        })
      ];
      expect(competitionStrengthAverages(teams)).toEqual({
        goalie: 20,
        defence: 70,
        attack: 140
      });
    });

    it("uses calculateStrength so AI teams' strengthObj is the source", () => {
      // Only AI teams flow through here in practice — confirm the
      // service reads strengthObj rather than the rolled-up `strength`.
      const teams = [
        makeTeam({
          strengthObj: { goalie: 1, defence: 1, attack: 1 }
        })
      ];
      expect(competitionStrengthAverages(teams)).toEqual({
        goalie: 1,
        defence: 1,
        attack: 1
      });
    });
  });

  describe("proxyRatio", () => {
    it("returns 1.0 when own strength matches the average exactly", () => {
      // QB: proxy(4) = (1 + 1 + 1) / 3 = 1.0 → 'exactly average'.
      const avg = makeStrength({ goalie: 10, defence: 50, attack: 100 });
      expect(proxyRatio(avg, avg)).toBe(1);
    });

    it("matches the QB formula on a worked example", () => {
      // own goalie=12, defence=55, attack=110 vs avg 10/50/100
      //   p1 = 1.2  p2 = 1.1  p3 = 1.1
      //   p4 = (1.2 + 1.1 + 1.1) / 3 = 1.1333...
      const own = makeStrength({ goalie: 12, defence: 55, attack: 110 });
      const avg = makeStrength({ goalie: 10, defence: 50, attack: 100 });
      expect(proxyRatio(own, avg)).toBeCloseTo(3.4 / 3, 6);
    });

    it("falls back to 1.0 when any average component is zero", () => {
      // QB silently divides by zero; we treat 'all-zero competition' as
      // 'exactly average' so every team gets the middle band.
      const own = makeStrength({ goalie: 5, defence: 5, attack: 5 });
      const zeroGoalie = makeStrength({ goalie: 0, defence: 50, attack: 100 });
      expect(proxyRatio(own, zeroGoalie)).toBe(1);
      const zeroDefence = makeStrength({
        goalie: 10,
        defence: 0,
        attack: 100
      });
      expect(proxyRatio(own, zeroDefence)).toBe(1);
      const zeroAttack = makeStrength({ goalie: 10, defence: 50, attack: 0 });
      expect(proxyRatio(own, zeroAttack)).toBe(1);
    });
  });

  describe("strategyWeightsForProxy", () => {
    /**
     * 1-1 with the QB SELECT CASE table at MHM2K.BAS:2477-2491.
     * Every band's lower edge, midpoint, and just-below-upper-edge is
     * checked. The QB writes `.0000001` cliffs between adjacent CASE
     * arms — we model the same partitioning with strict `<` upper
     * bounds, which produces the identical assignment for any value
     * not exactly on the cliff.
     */
    const cases: Array<[number, StrategyWeights, string]> = [
      [0.0, [20, 40, 40], "≤ 0.7 — bottom band"],
      [0.5, [20, 40, 40], "≤ 0.7 — bottom band"],
      [0.6999, [20, 40, 40], "just below 0.7"],
      [0.7, [10, 40, 50], "0.7 lower edge"],
      [0.75, [10, 40, 50], "0.7 mid"],
      [0.7999, [10, 40, 50], "just below 0.8"],
      [0.8, [20, 30, 50], "0.8 lower edge"],
      [0.85, [20, 30, 50], "0.8 mid"],
      [0.8999, [20, 30, 50], "just below 0.9"],
      [0.9, [30, 10, 60], "0.9 lower edge"],
      [0.925, [30, 10, 60], "0.9 mid"],
      [0.9499, [30, 10, 60], "just below 0.95"],
      [0.95, [48, 4, 48], "0.95 lower edge"],
      [1.0, [48, 4, 48], "exactly average"],
      [1.0499, [48, 4, 48], "just below 1.05"],
      [1.05, [70, 1, 29], "1.05 lower edge"],
      [1.075, [70, 1, 29], "1.05 mid"],
      [1.0999, [70, 1, 29], "just below 1.1"],
      [1.1, [85, 0, 15], "1.1 lower edge"],
      [1.15, [85, 0, 15], "1.1 mid"],
      [1.1999, [85, 0, 15], "just below 1.2"],
      [1.2, [100, 0, 0], "1.2 lower edge"],
      [1.5, [100, 0, 0], "way above"],
      [10.0, [100, 0, 0], "absurdly above"]
    ];

    it.each(cases)("proxy(4)=%s → %j  (%s)", (proxy, expected, _desc) => {
      expect(strategyWeightsForProxy(proxy)).toEqual(expected);
    });

    it("every band's weights sum to 100 (QB invariant)", () => {
      // QB writes mahd as percentages summing to 100; the rolling
      // helper does not assume it, but parity says we should.
      for (const proxy of [0, 0.7, 0.8, 0.9, 0.95, 1.0, 1.05, 1.1, 1.2, 5.0]) {
        const [a, b, c] = strategyWeightsForProxy(proxy);
        expect(a + b + c).toBe(100);
      }
    });

    it("KAIKKI PELIIN! peaks for low-mid teams, vanishes for top teams", () => {
      // Sanity check on the design intent we rely on in dev menu.
      expect(strategyWeightsForProxy(0.5)[1]).toBe(40);
      expect(strategyWeightsForProxy(0.85)[1]).toBe(30);
      expect(strategyWeightsForProxy(1.0)[1]).toBe(4);
      expect(strategyWeightsForProxy(1.2)[1]).toBe(0);
    });

    it("SIMONOV monotonically increases across bands", () => {
      // Stronger teams skew toward Simonov (the "rough autumn,
      // strong spring" gamble). QB design: 20, 10 (dip), 20, 30,
      // 48, 70, 85, 100. Note the dip at 0.7-0.8 — that's QB
      // canon, not a bug.
      const seq = [0, 0.7, 0.8, 0.9, 0.95, 1.05, 1.1, 1.2].map(
        (p) => strategyWeightsForProxy(p)[0]
      );
      expect(seq).toEqual([20, 10, 20, 30, 48, 70, 85, 100]);
    });
  });

  describe("rollStrategyFromWeights", () => {
    it("picks SIMONOV (1) for rolls in [1, mahd1]", () => {
      const w: StrategyWeights = [20, 30, 50];
      expect(rollStrategyFromWeights(w, fixedRandom(1))).toBe(1);
      expect(rollStrategyFromWeights(w, fixedRandom(20))).toBe(1);
    });

    it("picks KAIKKI PELIIN (2) for rolls in [mahd1+1, mahd1+mahd2]", () => {
      const w: StrategyWeights = [20, 30, 50];
      expect(rollStrategyFromWeights(w, fixedRandom(21))).toBe(2);
      expect(rollStrategyFromWeights(w, fixedRandom(50))).toBe(2);
    });

    it("picks TASAINEN PUURTO (3) for rolls in [mahd1+mahd2+1, total]", () => {
      const w: StrategyWeights = [20, 30, 50];
      expect(rollStrategyFromWeights(w, fixedRandom(51))).toBe(3);
      expect(rollStrategyFromWeights(w, fixedRandom(100))).toBe(3);
    });

    it("never picks a strategy with weight 0 (QB top-band invariant)", () => {
      // Top-band weights [100, 0, 0]: every roll must land on SIMONOV.
      const w: StrategyWeights = [100, 0, 0];
      const r = createRandomWithEngine(MersenneTwister19937.seed(42));
      for (let i = 0; i < 1000; i++) {
        expect(rollStrategyFromWeights(w, r)).toBe(1);
      }
    });

    it("[85, 0, 15] never picks KAIKKI PELIIN", () => {
      const w: StrategyWeights = [85, 0, 15];
      const r = createRandomWithEngine(MersenneTwister19937.seed(42));
      const counts = { 1: 0, 2: 0, 3: 0 };
      for (let i = 0; i < 5000; i++) {
        counts[rollStrategyFromWeights(w, r)]++;
      }
      expect(counts[2]).toBe(0);
      expect(counts[1]).toBeGreaterThan(0);
      expect(counts[3]).toBeGreaterThan(0);
    });

    it("empirical distribution converges to the supplied weights", () => {
      // [48, 4, 48] band — middle of the table, all three strategies live.
      const w: StrategyWeights = [48, 4, 48];
      const r = createRandomWithEngine(MersenneTwister19937.seed(123));
      const counts = { 1: 0, 2: 0, 3: 0 };
      const trials = 20_000;
      for (let i = 0; i < trials; i++) {
        counts[rollStrategyFromWeights(w, r)]++;
      }
      // 2 percentage points slack on a 20k sample is comfortable.
      expect(counts[1] / trials).toBeGreaterThan(0.46);
      expect(counts[1] / trials).toBeLessThan(0.5);
      expect(counts[2] / trials).toBeGreaterThan(0.025);
      expect(counts[2] / trials).toBeLessThan(0.055);
      expect(counts[3] / trials).toBeGreaterThan(0.46);
      expect(counts[3] / trials).toBeLessThan(0.5);
    });

    it("falls back to TASAINEN PUURTO when weights total ≤ 0", () => {
      // Defensive guard — not reachable from QB data, but the helper
      // shouldn't divide-by-zero or pick from an empty range.
      const r = createRandomWithEngine(MersenneTwister19937.seed(1));
      expect(rollStrategyFromWeights([0, 0, 0], r)).toBe(3);
    });

    it("respects total weight other than 100 (helper does not assume)", () => {
      // QB always sums to 100; we don't hard-code that. Roll over a
      // [10, 10, 10] table → uniform thirds.
      const w: StrategyWeights = [10, 10, 10];
      const r = createRandomWithEngine(MersenneTwister19937.seed(7));
      const counts = { 1: 0, 2: 0, 3: 0 };
      const trials = 9_000;
      for (let i = 0; i < trials; i++) {
        counts[rollStrategyFromWeights(w, r)]++;
      }
      // ~3000 each ±5%
      for (const id of [1, 2, 3] as const) {
        expect(counts[id]).toBeGreaterThan(2700);
        expect(counts[id]).toBeLessThan(3300);
      }
    });
  });

  describe("distributeAIStrategies", () => {
    it("returns an empty map when there are no teams", () => {
      const r = createRandomWithEngine(MersenneTwister19937.seed(1));
      expect(distributeAIStrategies([], {}, r)).toEqual(new Map());
    });

    it("honours strategy:simonov tag (QB man=33 hard-code)", () => {
      // QB: IF man(sort(xx)) = 33 THEN mahd(1) = 100 — Simonov always
      // picks Simonov. We generalise to the 'strategy:simonov' tag.
      const manager = makeManager({
        id: "simonov",
        tags: ["strategy:simonov"]
      });
      const team = makeTeam({
        id: 0,
        manager: "simonov",
        // Bottom-band team — without the tag this would never be 100% Simonov.
        strengthObj: { goalie: 1, defence: 1, attack: 1 }
      });
      // Add a high-strength filler so averages are far above the tagged team.
      const filler = makeTeam({
        id: 1,
        manager: undefined,
        strengthObj: { goalie: 100, defence: 500, attack: 1000 }
      });
      const r = createRandomWithEngine(MersenneTwister19937.seed(1));
      const picks = distributeAIStrategies(
        [team, filler],
        { simonov: manager } as Record<string, Manager>,
        r
      );
      expect(picks.get(0)).toBe(1);
    });

    it("honours strategy:tasainen-puurto tag (Pasolini proxy)", () => {
      const manager = makeManager({
        id: "pasolini",
        tags: ["proxy", "light", "strategy:tasainen-puurto"]
      });
      const team = makeTeam({
        id: 0,
        manager: "pasolini",
        // Top-band strength — without the tag this would always pick Simonov.
        strengthObj: { goalie: 100, defence: 500, attack: 1000 }
      });
      const filler = makeTeam({
        id: 1,
        strengthObj: { goalie: 1, defence: 1, attack: 1 }
      });
      const r = createRandomWithEngine(MersenneTwister19937.seed(1));
      const picks = distributeAIStrategies(
        [team, filler],
        { pasolini: manager } as Record<string, Manager>,
        r
      );
      expect(picks.get(0)).toBe(3);
    });

    it("honours strategy:kaikki-peliin tag", () => {
      const manager = makeManager({
        id: "go4it",
        tags: ["strategy:kaikki-peliin"]
      });
      const team = makeTeam({
        id: 0,
        manager: "go4it",
        strengthObj: { goalie: 100, defence: 500, attack: 1000 }
      });
      const filler = makeTeam({
        id: 1,
        strengthObj: { goalie: 1, defence: 1, attack: 1 }
      });
      const r = createRandomWithEngine(MersenneTwister19937.seed(1));
      const picks = distributeAIStrategies(
        [team, filler],
        { go4it: manager } as Record<string, Manager>,
        r
      );
      expect(picks.get(0)).toBe(2);
    });

    it("dominant teams (proxy ≥ 1.2) always pick SIMONOV across many seeds", () => {
      // 1 team way above the average → proxy(4) >> 1.2 → mahd = [100,0,0].
      const top = makeTeam({
        id: 0,
        strengthObj: { goalie: 100, defence: 500, attack: 1000 }
      });
      const weak = makeTeam({
        id: 1,
        strengthObj: { goalie: 5, defence: 25, attack: 50 }
      });
      for (let seed = 0; seed < 25; seed++) {
        const r = createRandomWithEngine(MersenneTwister19937.seed(seed));
        const picks = distributeAIStrategies([top, weak], {}, r);
        expect(picks.get(0)).toBe(1);
      }
    });

    it("assigns a strategy to every supplied team", () => {
      const teams = Array.from({ length: 12 }, (_, i) =>
        makeTeam({
          id: i,
          strengthObj: {
            goalie: 5 + i,
            defence: 25 + 2 * i,
            attack: 50 + 4 * i
          }
        })
      );
      const r = createRandomWithEngine(MersenneTwister19937.seed(99));
      const picks = distributeAIStrategies(teams, {}, r);
      expect(picks.size).toBe(12);
      for (const t of teams) {
        const pick = picks.get(t.id);
        expect(pick).toBeDefined();
        expect([1, 2, 3]).toContain(pick);
      }
    });

    it("skips teams whose forced tag is unrelated (no match → fall through to lottery)", () => {
      // 'strategy:bogus' isn't recognised — manager falls through to
      // the proxy roll. Asserting it doesn't crash + still produces
      // a valid pick.
      const manager = makeManager({
        id: "weirdo",
        tags: ["strategy:not-a-real-strategy"]
      });
      const team = makeTeam({ id: 0, manager: "weirdo" });
      const filler = makeTeam({ id: 1 });
      const r = createRandomWithEngine(MersenneTwister19937.seed(1));
      const picks = distributeAIStrategies(
        [team, filler],
        { weirdo: manager } as Record<string, Manager>,
        r
      );
      expect([1, 2, 3]).toContain(picks.get(0) as StrategyId);
    });

    it("an all-equal-strength competition rolls every team in the [48, 4, 48] band", () => {
      // Identical strengths → proxy(4) = 1.0 for every team → middle
      // band. Empirically: ~48% Simonov, ~4% Kaikki Peliin, ~48% Tasainen.
      const teams = Array.from({ length: 12 }, (_, i) =>
        makeTeam({ id: i, strengthObj: makeStrength() })
      );
      const r = createRandomWithEngine(MersenneTwister19937.seed(2026));
      // Roll the same competition many times to build a sample.
      const counts: Record<StrategyId, number> = { 1: 0, 2: 0, 3: 0 };
      const seasons = 500;
      for (let s = 0; s < seasons; s++) {
        const picks = distributeAIStrategies(teams, {}, r);
        for (const id of picks.values()) {
          counts[id]++;
        }
      }
      const total = seasons * teams.length;
      // Tolerances generous enough to not flake on a fresh seed.
      expect(counts[1] / total).toBeGreaterThan(0.43);
      expect(counts[1] / total).toBeLessThan(0.53);
      expect(counts[2] / total).toBeGreaterThan(0.02);
      expect(counts[2] / total).toBeLessThan(0.07);
      expect(counts[3] / total).toBeGreaterThan(0.43);
      expect(counts[3] / total).toBeLessThan(0.53);
    });
  });

  describe("STRATEGY_COMPETITION_IDS", () => {
    it("matches the QB outer FOR a = 1 TO 3 loop (PHL, Divisioona, Mutasarja)", () => {
      // QB:
      //   a = 1 → b=1,  c=12  → PHL
      //   a = 2 → b=13, c=24  → Divisioona
      //   a = 3 → b=25, c=48  → Mutasarja
      expect(STRATEGY_COMPETITION_IDS).toEqual([
        "phl",
        "division",
        "mutasarja"
      ]);
    });
  });
});
