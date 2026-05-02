import { describe, expect, it } from "vitest";
import { MersenneTwister19937 } from "random-js";
import { createRandomWithEngine } from "@/services/random";
import { createTeamStrengthService, getTeamLevel } from "@/services/levels";

describe("rollTeamStrength", () => {
  it("stays within ±1 / ±2 / ±4 of the level base", () => {
    const r = createRandomWithEngine(MersenneTwister19937.seed(42));
    const { rollTeamStrength } = createTeamStrengthService(r);
    for (let level = 1; level <= 58; level++) {
      const base = getTeamLevel(level);
      for (let i = 0; i < 200; i++) {
        const s = rollTeamStrength(level);
        expect(s.goalie).toBeGreaterThanOrEqual(base.goalie - 1);
        expect(s.goalie).toBeLessThanOrEqual(base.goalie + 1);
        expect(s.defence).toBeGreaterThanOrEqual(base.defence - 2);
        expect(s.defence).toBeLessThanOrEqual(base.defence + 2);
        expect(s.attack).toBeGreaterThanOrEqual(base.attack - 4);
        expect(s.attack).toBeLessThanOrEqual(base.attack + 4);
      }
    }
  });

  it("covers the full noise range over enough rolls", () => {
    // Pier Paolo Pasolini coaches level 30. ±1/±2/±4 means we should see
    // every value in [base-N, base+N] given sufficient samples.
    const r = createRandomWithEngine(MersenneTwister19937.seed(1));
    const { rollTeamStrength } = createTeamStrengthService(r);
    const base = getTeamLevel(30);
    const seen = {
      goalie: new Set<number>(),
      defence: new Set<number>(),
      attack: new Set<number>()
    };
    for (let i = 0; i < 5000; i++) {
      const s = rollTeamStrength(30);
      seen.goalie.add(s.goalie);
      seen.defence.add(s.defence);
      seen.attack.add(s.attack);
    }
    expect(seen.goalie.size).toBe(3); // base-1, base, base+1
    expect(seen.defence.size).toBe(5);
    expect(seen.attack.size).toBe(9);
    expect(Math.min(...seen.attack)).toBe(base.attack - 4);
    expect(Math.max(...seen.attack)).toBe(base.attack + 4);
  });

  it("throws on out-of-range level", () => {
    const { rollTeamStrength } = createTeamStrengthService();
    expect(() => rollTeamStrength(0)).toThrow();
    expect(() => rollTeamStrength(59)).toThrow();
  });
});
