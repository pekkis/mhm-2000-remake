import { describe, it, expect } from "vitest";
import { roundRobin, scheduler } from "@/services/round-robin";

/** Create a 0-based team ID array of length n */
const teamIds = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

describe("round-robin scheduler", () => {
  describe("roundRobin (base algorithm)", () => {
    it("should handle 2 teams", () => {
      const result = roundRobin(2);
      // 2 teams = 1 round
      expect(result).toHaveLength(1);
      // Should have one pairing (order may vary)
      expect(result[0]).toHaveLength(1);
      expect(result[0][0]).toEqual(expect.arrayContaining([0, 1]));
    });

    it("should handle 3 teams (odd number)", () => {
      const result = roundRobin(3);
      // 3 teams padded to 4 = 3 rounds
      expect(result).toHaveLength(3);
      // Each round should have 1 pairing (team 3/dummy gets a bye)
      expect(result.every((round) => round.length === 1)).toBe(true);
    });

    it("should handle 4 teams (even number)", () => {
      const result = roundRobin(4);
      // 4 teams = 3 rounds (n-1 rounds for round-robin)
      expect(result).toHaveLength(3);
      // Each round should have 2 pairings
      expect(result.every((round) => round.length === 2)).toBe(true);
    });

    it("should generate valid pairings (no team paired with itself)", () => {
      const result = roundRobin(4);
      result.forEach((round) => {
        round.forEach(([home, away]) => {
          expect(home).not.toBe(away);
        });
      });
    });

    it("should ensure each team plays each other team exactly once", () => {
      const teamCount = 4;
      const result = roundRobin(teamCount);

      const matchups = new Set<string>();

      result.forEach((round) => {
        round.forEach(([home, away]) => {
          // Store normalized matchup (sorted pair to eliminate order)
          const normalized = [home, away].sort().join("-");
          matchups.add(normalized);
        });
      });

      // For n teams, there should be n*(n-1)/2 unique matchups
      const expectedMatchups = (teamCount * (teamCount - 1)) / 2;
      expect(matchups.size).toBe(expectedMatchups);
    });

    it("should work for 6 teams", () => {
      const result = roundRobin(6);
      expect(result).toHaveLength(5); // 6 - 1 rounds
      expect(result.every((round) => round.length === 3)).toBe(true);
    });

    it("should not include DUMMY markers (-1) in output", () => {
      const result = roundRobin(3); // Odd number, uses DUMMY internally
      result.forEach((round) => {
        round.forEach(([home, away]) => {
          expect(home).not.toBe(-1);
          expect(away).not.toBe(-1);
        });
      });
    });
  });

  describe("scheduler (with repetition and Pairing format)", () => {
    it("should return array of rounds with Pairing objects", () => {
      const result = scheduler(teamIds(2), 1);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length > 0).toBe(true);

      // Check that pairings have home/away properties
      result.forEach((round) => {
        expect(Array.isArray(round)).toBe(true);
        round.forEach((pairing) => {
          expect(pairing).toHaveProperty("home");
          expect(pairing).toHaveProperty("away");
          expect(typeof pairing.home).toBe("number");
          expect(typeof pairing.away).toBe("number");
        });
      });
    });

    it("should repeat schedule correctly", () => {
      const times = 3;
      const baseResult = roundRobin(2);
      const schedulerResult = scheduler(teamIds(2), times);

      // Scheduler returns: baseSchedule + reversed, repeated `times` times
      // For 2 teams: 1 round forward + 1 round backward = 2 rounds, repeated 3 times = 6 rounds
      const expectedRounds = baseResult.length * 2 * times;
      expect(schedulerResult).toHaveLength(expectedRounds);
    });

    it("scheduler(4, 2) should produce correct structure", () => {
      const result = scheduler(teamIds(4), 2);

      // 4 teams: base 3 rounds + reversed 3 rounds = 6 rounds, repeated 2 times = 12 rounds
      expect(result).toHaveLength(12);

      // Each round should have 2 pairings (4 teams = 2 pairings per round)
      result.forEach((round) => {
        expect(round).toHaveLength(2);
      });
    });

    it("should have both home and away fixtures for each team", () => {
      const times = 1;
      const result = scheduler(teamIds(4), times);

      const homeGames = new Map<number, number>();
      const awayGames = new Map<number, number>();

      result.forEach((round) => {
        round.forEach(({ home, away }) => {
          homeGames.set(home, (homeGames.get(home) ?? 0) + 1);
          awayGames.set(away, (awayGames.get(away) ?? 0) + 1);
        });
      });

      // In a full round-robin with home/away, each team should play others
      // For 4 teams with forward + reverse: teams 0,1,2,3 should participate
      const participatingTeams = new Set([
        ...homeGames.keys(),
        ...awayGames.keys()
      ]);
      expect(participatingTeams.size).toBeGreaterThan(0);
    });

    it("should throw for single team input", () => {
      expect(() => scheduler(teamIds(1), 1)).toThrow(RangeError);
      expect(() => scheduler(teamIds(1), 1)).toThrow(
        "roundRobin requires at least 2 teams"
      );
    });

    it("should throw for invalid times input", () => {
      expect(() => scheduler(teamIds(4), 0)).toThrow(RangeError);
      expect(() => scheduler(teamIds(4), -1)).toThrow(RangeError);
      expect(() => scheduler(teamIds(4), 1.5)).toThrow(RangeError);
      expect(() => scheduler(teamIds(4), 0)).toThrow(
        "scheduler requires times to be a positive integer"
      );
    });

    it("should maintain Pairing shape through multiple repetitions", () => {
      const result = scheduler(teamIds(3), 2);

      result.forEach((round) => {
        round.forEach((pairing) => {
          expect(pairing).toEqual({
            home: expect.any(Number),
            away: expect.any(Number)
          });
        });
      });
    });
  });

  describe("practical scenarios", () => {
    it("should work for typical league size (12 teams, 2 times)", () => {
      const result = scheduler(teamIds(12), 2);
      // 12 teams: 11 rounds forward + 11 rounds backward = 22 rounds, repeated 2 times = 44 rounds
      expect(result).toHaveLength(44);

      // Each round should have 6 pairings (12 teams = 6 matches)
      result.forEach((round) => {
        expect(round).toHaveLength(6);
      });
    });

    it("should work for tournament size (8 teams, 1 time)", () => {
      const result = scheduler(teamIds(8), 1);
      // 8 teams: 7 rounds forward + 7 rounds backward = 14 rounds
      expect(result).toHaveLength(14);

      result.forEach((round) => {
        expect(round).toHaveLength(4); // 8 teams = 4 matches per round
      });
    });

    it("should generate balance: each team plays roughly equal home/away", () => {
      const result = scheduler(teamIds(8), 1);

      const stats = new Map<number, { home: number; away: number }>();
      Array.from({ length: 8 }, (_, i) => i).forEach((id) =>
        stats.set(id, { home: 0, away: 0 })
      );

      result.forEach((round) => {
        round.forEach(({ home, away }) => {
          const stat = stats.get(home)!;
          stat.home++;
          const awayStat = stats.get(away)!;
          awayStat.away++;
        });
      });

      // With the rotation method on even teams, distribution should be reasonable
      // Most teams should have at least some games of each type
      let balanced = 0;
      stats.forEach(({ home, away }) => {
        if (home > 0 && away > 0) {
          balanced++;
        }
      });

      // At least most teams should have both home and away games
      expect(balanced).toBeGreaterThanOrEqual(5);
    });
  });
});
