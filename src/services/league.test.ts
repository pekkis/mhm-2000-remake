import { describe, it, expect } from "vitest";
import { groupStats, sortStats } from "@/services/league";
import table from "@/services/league";
import type {
  Pairing,
  RoundRobinGroup,
  TeamStat,
  Penalty
} from "@/types/competitions";

const makeGroup = (
  overrides: Partial<RoundRobinGroup> = {}
): RoundRobinGroup => ({
  type: "round-robin",
  round: 0,
  name: "Pasolini Division",
  teams: [0, 1, 2, 3],
  schedule: [],
  stats: [],
  penalties: [],
  colors: [],
  ...overrides
});

const makePairing = (
  home: number,
  away: number,
  result?: { home: number; away: number; overtime: boolean }
): Pairing => ({
  home,
  away,
  result
});

describe("league", () => {
  describe("groupStats", () => {
    it("should return initial zeroed stats for all teams when no games played", () => {
      const group = makeGroup({ teams: [10, 20, 30], schedule: [] });
      const stats = groupStats(group);

      expect(stats).toHaveLength(3);
      stats.forEach((stat) => {
        expect(stat.gamesPlayed).toBe(0);
        expect(stat.wins).toBe(0);
        expect(stat.draws).toBe(0);
        expect(stat.losses).toBe(0);
        expect(stat.goalsFor).toBe(0);
        expect(stat.goalsAgainst).toBe(0);
        expect(stat.points).toBe(0);
      });
    });

    it("should correctly assign team ids and indices", () => {
      const group = makeGroup({ teams: [10, 20, 30] });
      const stats = groupStats(group);

      expect(stats[0]).toMatchObject({ index: 0, id: 10 });
      expect(stats[1]).toMatchObject({ index: 1, id: 20 });
      expect(stats[2]).toMatchObject({ index: 2, id: 30 });
    });

    it("should award 2 points for a win", () => {
      const group = makeGroup({
        teams: [0, 1],
        schedule: [[makePairing(0, 1, { home: 3, away: 1, overtime: false })]]
      });
      const stats = groupStats(group);

      const winner = stats.find((s) => s.index === 0)!;
      expect(winner.wins).toBe(1);
      expect(winner.points).toBe(2);
      expect(winner.goalsFor).toBe(3);
      expect(winner.goalsAgainst).toBe(1);
    });

    it("should award 1 point each for a draw", () => {
      const group = makeGroup({
        teams: [0, 1],
        schedule: [[makePairing(0, 1, { home: 2, away: 2, overtime: false })]]
      });
      const stats = groupStats(group);

      expect(stats[0].draws).toBe(1);
      expect(stats[0].points).toBe(1);
      expect(stats[1].draws).toBe(1);
      expect(stats[1].points).toBe(1);
    });

    it("should award 0 points for a loss", () => {
      const group = makeGroup({
        teams: [0, 1],
        schedule: [[makePairing(0, 1, { home: 0, away: 5, overtime: false })]]
      });
      const stats = groupStats(group);

      const loser = stats.find((s) => s.index === 0)!;
      expect(loser.losses).toBe(1);
      expect(loser.points).toBe(0);
    });

    it("should skip games without results", () => {
      const group = makeGroup({
        teams: [0, 1],
        schedule: [[makePairing(0, 1)]] // no result
      });
      const stats = groupStats(group);

      expect(stats[0].gamesPlayed).toBe(0);
      expect(stats[1].gamesPlayed).toBe(0);
    });

    it("should accumulate stats across multiple rounds", () => {
      const group = makeGroup({
        teams: [0, 1, 2],
        schedule: [
          [
            makePairing(0, 1, { home: 3, away: 1, overtime: false }),
            makePairing(2, 0, { home: 0, away: 2, overtime: false })
          ],
          [makePairing(1, 2, { home: 4, away: 0, overtime: false })]
        ]
      });
      const stats = groupStats(group);

      // Team index 0: won vs 1 (3-1), won vs 2 (2-0)
      const team0 = stats[0];
      expect(team0.gamesPlayed).toBe(2);
      expect(team0.wins).toBe(2);
      expect(team0.points).toBe(4);
      expect(team0.goalsFor).toBe(5);
      expect(team0.goalsAgainst).toBe(1);
    });

    it("should apply penalty points", () => {
      const group = makeGroup({
        teams: [0, 1],
        schedule: [[makePairing(0, 1, { home: 3, away: 1, overtime: false })]],
        penalties: [{ team: 0, penalty: -4 }]
      });
      const stats = groupStats(group);

      const penalized = stats.find((s) => s.id === 0)!;
      // 2 points for win, -4 penalty = -2
      expect(penalized.points).toBe(-2);
    });

    it("should apply multiple penalties to the same team", () => {
      const penalties: Penalty[] = [
        { team: 0, penalty: -2 },
        { team: 0, penalty: -3 }
      ];
      const group = makeGroup({
        teams: [0, 1],
        schedule: [],
        penalties
      });
      const stats = groupStats(group);

      const penalized = stats.find((s) => s.id === 0)!;
      expect(penalized.points).toBe(-5);
    });
  });

  describe("sortStats", () => {
    const makeStat = (overrides: Partial<TeamStat>): TeamStat => ({
      index: 0,
      id: 0,
      gamesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      ...overrides
    });

    it("should sort by points descending", () => {
      const stats = [
        makeStat({ id: 1, points: 4 }),
        makeStat({ id: 2, points: 8 }),
        makeStat({ id: 3, points: 6 })
      ];
      const sorted = sortStats(stats);
      expect(sorted.map((s) => s.id)).toEqual([2, 3, 1]);
    });

    it("should break ties by goal difference descending", () => {
      const stats = [
        makeStat({ id: 1, points: 6, goalsFor: 10, goalsAgainst: 8 }), // +2
        makeStat({ id: 2, points: 6, goalsFor: 15, goalsAgainst: 5 }), // +10
        makeStat({ id: 3, points: 6, goalsFor: 8, goalsAgainst: 3 }) // +5
      ];
      const sorted = sortStats(stats);
      expect(sorted.map((s) => s.id)).toEqual([2, 3, 1]);
    });

    it("should break further ties by goals scored descending", () => {
      const stats = [
        makeStat({ id: 1, points: 6, goalsFor: 8, goalsAgainst: 3 }), // +5, 8 GF
        makeStat({ id: 2, points: 6, goalsFor: 10, goalsAgainst: 5 }) // +5, 10 GF
      ];
      const sorted = sortStats(stats);
      expect(sorted.map((s) => s.id)).toEqual([2, 1]);
    });

    it("should break further ties by wins descending", () => {
      const stats = [
        makeStat({
          id: 1,
          points: 6,
          goalsFor: 10,
          goalsAgainst: 5,
          wins: 2
        }),
        makeStat({
          id: 2,
          points: 6,
          goalsFor: 10,
          goalsAgainst: 5,
          wins: 3
        })
      ];
      const sorted = sortStats(stats);
      expect(sorted.map((s) => s.id)).toEqual([2, 1]);
    });

    it("should use id as stable tiebreaker when all else is equal", () => {
      const stats = [
        makeStat({ id: 5, points: 6, goalsFor: 10, goalsAgainst: 5, wins: 3 }),
        makeStat({ id: 2, points: 6, goalsFor: 10, goalsAgainst: 5, wins: 3 })
      ];
      const sorted = sortStats(stats);
      // Lower id first (stable sort)
      expect(sorted.map((s) => s.id)).toEqual([2, 5]);
    });

    it("should not mutate the original array", () => {
      const stats = [
        makeStat({ id: 3, points: 2 }),
        makeStat({ id: 1, points: 8 })
      ];
      const original = [...stats];
      sortStats(stats);
      expect(stats[0].id).toBe(original[0].id);
    });
  });

  describe("table (default export — groupStats + sortStats combined)", () => {
    it("should return sorted standings for a group with results", () => {
      const group = makeGroup({
        teams: [10, 20, 30],
        schedule: [
          [
            makePairing(10, 20, { home: 3, away: 1, overtime: false }) // 10 beats 20
            // team 30 has bye
          ],
          [
            makePairing(20, 30, { home: 0, away: 2, overtime: false }) // 30 beats 20
          ],
          [
            makePairing(10, 30, { home: 1, away: 1, overtime: false }) // 10 draws 30
          ]
        ]
      });

      const result = table(group);

      // Team 10 (idx 0): W3-1 + D1-1 = 3 pts (2+1), GF:4 GA:2, GD:+2
      // Team 30 (idx 2): W2-0 + D1-1 = 3 pts (2+1), GF:3 GA:1, GD:+2
      // Team 20 (idx 1): L1-3 + L0-2 = 0 pts
      // 10 vs 30 tiebreaker: same GD (+2), 10 has more GF (4 vs 3) → 10 first
      expect(result[0].id).toBe(10);
      expect(result[1].id).toBe(30);
      expect(result[2].id).toBe(20);
    });
  });
});
