import { describe, it, expect } from "vitest";
import { victors, eliminated, matchups } from "@/services/playoffs";
import playoffScheduler from "@/services/playoffs";
import type { PlayoffGroup, Pairing } from "@/types/competitions";

const makePlayoffGroup = (
  overrides: Partial<PlayoffGroup> = {}
): PlayoffGroup => ({
  type: "playoffs",
  round: 0,
  teams: [0, 1, 2, 3],
  matchups: [
    [0, 1],
    [2, 3]
  ],
  winsToAdvance: 2,
  schedule: [],
  stats: [],
  ...overrides
});

describe("playoffs", () => {
  describe("playoffScheduler (default export)", () => {
    it("should generate correct number of rounds for best-of-3 (winsToAdvance=2)", () => {
      const matchupList: [number, number][] = [
        [0, 1],
        [2, 3]
      ];
      const rounds = playoffScheduler(matchupList, 2);
      // winsToAdvance=2, max games = 2*2 - 1 = 3 rounds
      expect(rounds).toHaveLength(3);
    });

    it("should generate correct number of rounds for best-of-5 (winsToAdvance=3)", () => {
      const matchupList: [number, number][] = [[0, 1]];
      const rounds = playoffScheduler(matchupList, 3);
      // max games = 2*3 - 1 = 5 rounds
      expect(rounds).toHaveLength(5);
    });

    it("should alternate home/away between rounds", () => {
      const matchupList: [number, number][] = [[0, 1]];
      const rounds = playoffScheduler(matchupList, 2);

      // Round 1 (index 0, r=1, odd): home=0, away=1
      expect(rounds[0][0]).toEqual({ home: 0, away: 1 });
      // Round 2 (index 1, r=2, even): home=1, away=0
      expect(rounds[1][0]).toEqual({ home: 1, away: 0 });
      // Round 3 (index 2, r=3, odd): home=0, away=1
      expect(rounds[2][0]).toEqual({ home: 0, away: 1 });
    });

    it("should handle multiple matchups in parallel", () => {
      const matchupList: [number, number][] = [
        [0, 3],
        [1, 2]
      ];
      const rounds = playoffScheduler(matchupList, 2);

      // Each round should have 2 pairings
      rounds.forEach((round) => {
        expect(round).toHaveLength(2);
      });
    });

    it("should return Pairing objects", () => {
      const rounds = playoffScheduler([[0, 1]], 2);
      rounds.forEach((round) => {
        round.forEach((pairing) => {
          expect(pairing).toHaveProperty("home");
          expect(pairing).toHaveProperty("away");
        });
      });
    });
  });

  describe("victors", () => {
    it("should return teams that have reached winsToAdvance", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 2,
        stats: [
          {
            home: { index: 0, id: 10, wins: 2, losses: 1 },
            away: { index: 1, id: 20, wins: 1, losses: 2 }
          },
          {
            home: { index: 2, id: 30, wins: 0, losses: 2 },
            away: { index: 3, id: 40, wins: 2, losses: 0 }
          }
        ]
      });

      const result = victors(group);
      expect(result).toHaveLength(2);
      expect(result.map((v) => v.id)).toEqual([10, 40]);
    });

    it("should return empty array when no team has enough wins", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 3,
        stats: [
          {
            home: { index: 0, id: 10, wins: 1, losses: 1 },
            away: { index: 1, id: 20, wins: 1, losses: 1 }
          }
        ]
      });

      expect(victors(group)).toHaveLength(0);
    });

    it("should sort victors by index", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 2,
        stats: [
          {
            home: { index: 3, id: 40, wins: 2, losses: 0 },
            away: { index: 0, id: 10, wins: 0, losses: 2 }
          },
          {
            home: { index: 2, id: 30, wins: 2, losses: 1 },
            away: { index: 1, id: 20, wins: 1, losses: 2 }
          }
        ]
      });

      const result = victors(group);
      expect(result.map((v) => v.index)).toEqual([2, 3]);
    });
  });

  describe("eliminated", () => {
    it("should return teams that have losses equal to winsToAdvance", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 2,
        stats: [
          {
            home: { index: 0, id: 10, wins: 2, losses: 1 },
            away: { index: 1, id: 20, wins: 1, losses: 2 }
          },
          {
            home: { index: 2, id: 30, wins: 0, losses: 2 },
            away: { index: 3, id: 40, wins: 2, losses: 0 }
          }
        ]
      });

      const result = eliminated(group);
      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toEqual([20, 30]);
    });

    it("should return empty when series is still in progress", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 3,
        stats: [
          {
            home: { index: 0, id: 10, wins: 1, losses: 2 },
            away: { index: 1, id: 20, wins: 2, losses: 1 }
          }
        ]
      });

      expect(eliminated(group)).toHaveLength(0);
    });
  });

  describe("matchups", () => {
    it("should compute matchup stats from schedule results", () => {
      const schedule: Pairing[][] = [
        [{ home: 0, away: 1, result: { home: 3, away: 1, overtime: false } }],
        [{ home: 1, away: 0, result: { home: 2, away: 4, overtime: false } }],
        [{ home: 0, away: 1, result: { home: 1, away: 2, overtime: false } }]
      ];

      const group = makePlayoffGroup({
        teams: [10, 20],
        matchups: [[0, 1]],
        winsToAdvance: 2,
        schedule
      });

      const result = matchups(group);
      expect(result).toHaveLength(1);

      // Team index 0 (id 10): won game 1 (3-1), won game 2 (4-2), lost game 3 (1-2) → 2W 1L
      expect(result[0].home).toMatchObject({
        index: 0,
        id: 10,
        wins: 2,
        losses: 1
      });
      // Team index 1 (id 20): lost game 1, lost game 2, won game 3 → 1W 2L
      expect(result[0].away).toMatchObject({
        index: 1,
        id: 20,
        wins: 1,
        losses: 2
      });
    });

    it("should handle games without results (not yet played)", () => {
      const schedule: Pairing[][] = [
        [{ home: 0, away: 1, result: { home: 2, away: 1, overtime: false } }],
        [{ home: 1, away: 0 }] // not played yet
      ];

      const group = makePlayoffGroup({
        teams: [10, 20],
        matchups: [[0, 1]],
        winsToAdvance: 2,
        schedule
      });

      const result = matchups(group);
      // Only 1 game counted
      expect(result[0].home.wins).toBe(1);
      expect(result[0].home.losses).toBe(0);
    });

    it("should handle multiple matchups in a playoff round", () => {
      const schedule: Pairing[][] = [
        [
          { home: 0, away: 1, result: { home: 3, away: 0, overtime: false } },
          { home: 2, away: 3, result: { home: 1, away: 2, overtime: false } }
        ]
      ];

      const group = makePlayoffGroup({
        teams: [10, 20, 30, 40],
        matchups: [
          [0, 1],
          [2, 3]
        ],
        winsToAdvance: 2,
        schedule
      });

      const result = matchups(group);
      expect(result).toHaveLength(2);

      // Matchup 1: team 0 beat team 1
      expect(result[0].home.wins).toBe(1);
      expect(result[0].away.wins).toBe(0);

      // Matchup 2: team 3 beat team 2
      expect(result[1].home.wins).toBe(0);
      expect(result[1].away.wins).toBe(1);
    });
  });
});
