import { describe, it, expect } from "vitest";
import competitionTypes from "@/services/competition-type";
import type {
  RoundRobinGroup,
  PlayoffGroup,
  CupGroup,
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

    it("overtime is always 'regular' — single-attempt OT, ties allowed", () => {
      const group = makeRoundRobinGroup();
      expect(
        rr.overtime({ home: 2, away: 2, overtime: false }, group, 0, 0)
      ).toBe("regular");
      expect(
        rr.overtime({ home: 3, away: 1, overtime: false }, group, 0, 0)
      ).toBe("none");
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

    it("overtime is 'regular' on a draw, 'none' otherwise", () => {
      const group = {
        ...makeRoundRobinGroup(),
        type: "tournament" as const
      };
      expect(
        tourney.overtime({ home: 1, away: 1, overtime: false }, group, 0, 0)
      ).toBe("regular");
      expect(
        tourney.overtime({ home: 3, away: 1, overtime: false }, group, 0, 0)
      ).toBe("none");
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

    it("overtime is 'sudden-death' when result is a draw", () => {
      const group = makePlayoffGroup();
      expect(
        po.overtime({ home: 2, away: 2, overtime: false }, group, 0, 0)
      ).toBe("sudden-death");
    });

    it("overtime is 'none' when result is not a draw", () => {
      const group = makePlayoffGroup();
      expect(
        po.overtime({ home: 3, away: 1, overtime: false }, group, 0, 0)
      ).toBe("none");
      expect(
        po.overtime({ home: 0, away: 1, overtime: false }, group, 0, 0)
      ).toBe("none");
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

  describe("cup", () => {
    const cup = competitionTypes.cup;

    const makeCupGroup = (overrides: Partial<CupGroup> = {}): CupGroup => ({
      type: "cup",
      round: 0,
      name: "Test Cup Round",
      teams: [10, 20],
      matchups: [[0, 1]],
      schedule: [[{ home: 0, away: 1 }], [{ home: 1, away: 0 }]],
      stats: [],
      ...overrides
    });

    it("playMatch is always true", () => {
      const group = makeCupGroup();
      expect(cup.playMatch(group, 0, 0)).toBe(true);
      expect(cup.playMatch(group, 1, 0)).toBe(true);
    });

    it("never goes to overtime in leg 1 (round 0)", () => {
      const group = makeCupGroup();
      // Even a tied result in leg 1 is fine — leg 2 sorts it out.
      expect(
        cup.overtime({ home: 2, away: 2, overtime: false }, group, 0, 0)
      ).toBe("none");
    });

    it("triggers overtime in leg 2 only when aggregate would be tied", () => {
      // Leg 1: home(team A) 3 - 1 away(team B) → A leads 3-1
      // Leg 2: home(team B) 2 - 0 away(team A) → B catches up; agg 3-3
      const group = makeCupGroup({
        schedule: [
          [
            {
              home: 0,
              away: 1,
              result: { home: 3, away: 1, overtime: false }
            }
          ],
          [{ home: 1, away: 0 }]
        ]
      });
      expect(
        cup.overtime({ home: 2, away: 0, overtime: false }, group, 1, 0)
      ).toBe("sudden-death");
    });

    it("does not trigger overtime in leg 2 when aggregate is decisive", () => {
      // Leg 1: 3-1 to A. Leg 2: 1-0 to A → agg 4-1 to A.
      const group = makeCupGroup({
        schedule: [
          [
            {
              home: 0,
              away: 1,
              result: { home: 3, away: 1, overtime: false }
            }
          ],
          [{ home: 1, away: 0 }]
        ]
      });
      expect(
        cup.overtime({ home: 0, away: 1, overtime: false }, group, 1, 0)
      ).toBe("none");
    });

    it("stats returns CupMatchupStat[] with aggregated goals", () => {
      const group = makeCupGroup({
        schedule: [
          [
            {
              home: 0,
              away: 1,
              result: { home: 3, away: 1, overtime: false }
            }
          ],
          [
            {
              home: 1,
              away: 0,
              result: { home: 2, away: 1, overtime: false }
            }
          ]
        ]
      });
      const stats = cup.stats(group);
      expect(stats).toHaveLength(1);
      expect(stats[0].home.goals).toBe(4); // A: 3 + 1
      expect(stats[0].away.goals).toBe(3); // B: 1 + 2
      expect(stats[0].decided).toBe(true);
      expect(stats[0].victor).toBe("home");
    });
  });
});
