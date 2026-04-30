import { describe, it, expect } from "vitest";
import competitionTypes from "@/services/competition-type";
import type {
  RoundRobinGroup,
  PlayoffGroup,
  MatchupStat
} from "@/types/competitions";

const makeRoundRobinGroup = (
  overrides: Partial<RoundRobinGroup> = {}
): RoundRobinGroup => ({
  type: "round-robin",
  round: 0,
  name: "Test Group",
  teams: [0, 1, 2, 3],
  schedule: [],
  stats: [],
  penalties: [],
  colors: [],
  ...overrides
});

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
  winsToAdvance: 3,
  schedule: [],
  stats: [],
  ...overrides
});

describe("competition-type", () => {
  describe("available types", () => {
    it("should have round-robin, tournament, and playoffs types", () => {
      expect(competitionTypes).toHaveProperty("round-robin");
      expect(competitionTypes).toHaveProperty("tournament");
      expect(competitionTypes).toHaveProperty("playoffs");
    });

    it("each type should have playMatch, overtime, and stats functions", () => {
      for (const [_name, type] of Object.entries(competitionTypes)) {
        expect(type.playMatch).toBeTypeOf("function");
        expect(type.overtime).toBeTypeOf("function");
        expect(type.stats).toBeTypeOf("function");
      }
    });
  });

  describe("round-robin", () => {
    const rr = competitionTypes["round-robin"];

    it("playMatch should always return true (all games are played)", () => {
      const group = makeRoundRobinGroup();
      expect(rr.playMatch(group, 0, 0)).toBe(true);
      expect(rr.playMatch(group, 5, 3)).toBe(true);
    });

    it("overtime should always return false (no overtime in round-robin)", () => {
      expect(rr.overtime({ home: 2, away: 2, overtime: false })).toBe(false);
      expect(rr.overtime({ home: 3, away: 1, overtime: false })).toBe(false);
    });

    it("stats should return league table (TeamStat[])", () => {
      const group = makeRoundRobinGroup({
        teams: [10, 20],
        schedule: [
          [
            {
              home: 0,
              away: 1,
              result: { home: 3, away: 1, overtime: false }
            }
          ]
        ]
      });
      const result = rr.stats(group);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      // Winner should have 2 points
      expect(result[0]).toHaveProperty("points");
    });
  });

  describe("tournament", () => {
    const tourney = competitionTypes.tournament;

    it("playMatch should always return true", () => {
      const group = makeRoundRobinGroup();
      expect(tourney.playMatch(group, 0, 0)).toBe(true);
    });

    it("overtime should always return false", () => {
      expect(tourney.overtime({ home: 1, away: 1, overtime: false })).toBe(
        false
      );
    });

    it("stats should return league table (same as round-robin)", () => {
      const group = {
        ...makeRoundRobinGroup({ teams: [0, 1], schedule: [] }),
        type: "tournament" as const
      };
      const result = tourney.stats(group);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("playoffs", () => {
    const po = competitionTypes.playoffs;

    it("overtime should return true when result is a draw", () => {
      expect(po.overtime({ home: 2, away: 2, overtime: false })).toBe(true);
    });

    it("overtime should return false when result is not a draw", () => {
      expect(po.overtime({ home: 3, away: 1, overtime: false })).toBe(false);
      expect(po.overtime({ home: 0, away: 1, overtime: false })).toBe(false);
    });

    it("playMatch should return true when neither team has enough wins", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 3,
        stats: [
          {
            home: { index: 0, id: 0, wins: 1, losses: 1 },
            away: { index: 1, id: 1, wins: 1, losses: 1 }
          },
          {
            home: { index: 2, id: 2, wins: 0, losses: 0 },
            away: { index: 3, id: 3, wins: 0, losses: 0 }
          }
        ] as MatchupStat[]
      });

      expect(po.playMatch(group, 0, 0)).toBe(true);
    });

    it("playMatch should return false when home team has enough wins", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 3,
        stats: [
          {
            home: { index: 0, id: 0, wins: 3, losses: 1 },
            away: { index: 1, id: 1, wins: 1, losses: 3 }
          }
        ] as MatchupStat[]
      });

      expect(po.playMatch(group, 0, 0)).toBe(false);
    });

    it("playMatch should return false when away team has enough wins", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 3,
        stats: [
          {
            home: { index: 0, id: 0, wins: 0, losses: 3 },
            away: { index: 1, id: 1, wins: 3, losses: 0 }
          }
        ] as MatchupStat[]
      });

      expect(po.playMatch(group, 0, 0)).toBe(false);
    });

    it("playMatch should check the correct matchup index", () => {
      const group = makePlayoffGroup({
        winsToAdvance: 2,
        stats: [
          {
            home: { index: 0, id: 0, wins: 2, losses: 0 },
            away: { index: 1, id: 1, wins: 0, losses: 2 }
          },
          {
            home: { index: 2, id: 2, wins: 1, losses: 0 },
            away: { index: 3, id: 3, wins: 0, losses: 1 }
          }
        ] as MatchupStat[]
      });

      // Matchup 0 is decided
      expect(po.playMatch(group, 0, 0)).toBe(false);
      // Matchup 1 is still in progress
      expect(po.playMatch(group, 0, 1)).toBe(true);
    });
  });
});
