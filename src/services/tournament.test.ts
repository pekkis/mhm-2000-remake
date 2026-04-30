import { describe, it, expect } from "vitest";
import tournamentScheduler from "@/services/tournament";

describe("tournamentScheduler", () => {
  it("should return an array of rounds with Pairing objects", () => {
    const result = tournamentScheduler(4);
    expect(Array.isArray(result)).toBe(true);
    result.forEach((round) => {
      round.forEach((pairing) => {
        expect(pairing).toHaveProperty("home");
        expect(pairing).toHaveProperty("away");
        expect(typeof pairing.home).toBe("number");
        expect(typeof pairing.away).toBe("number");
      });
    });
  });

  it("should produce n-1 rounds for n teams (even)", () => {
    const result = tournamentScheduler(6);
    expect(result).toHaveLength(5);
  });

  it("should produce n rounds for n teams (odd, padded to n+1)", () => {
    // odd number gets padded: 5 → 6 teams internally, so 5 rounds with byes
    const result = tournamentScheduler(5);
    expect(result).toHaveLength(5);
  });

  it("should not pair any team with itself", () => {
    const result = tournamentScheduler(8);
    result.forEach((round) => {
      round.forEach(({ home, away }) => {
        expect(home).not.toBe(away);
      });
    });
  });

  it("should ensure each team plays each other exactly once", () => {
    const teamCount = 6;
    const result = tournamentScheduler(teamCount);

    const matchups = new Set<string>();
    result.forEach((round) => {
      round.forEach(({ home, away }) => {
        const normalized = [home, away].toSorted().join("-");
        matchups.add(normalized);
      });
    });

    const expectedMatchups = (teamCount * (teamCount - 1)) / 2;
    expect(matchups.size).toBe(expectedMatchups);
  });

  it("should not include DUMMY markers (-1) in output", () => {
    const result = tournamentScheduler(5); // odd, uses DUMMY internally
    result.forEach((round) => {
      round.forEach(({ home, away }) => {
        expect(home).not.toBe(-1);
        expect(away).not.toBe(-1);
      });
    });
  });

  it("should return Pairing objects (not raw arrays)", () => {
    const result = tournamentScheduler(4);
    const firstPairing = result[0][0];
    // Should be { home, away }, not [number, number]
    expect(firstPairing).toEqual({
      home: expect.any(Number),
      away: expect.any(Number)
    });
  });

  it("should handle 2 teams (minimum)", () => {
    const result = tournamentScheduler(2);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1);
  });
});
