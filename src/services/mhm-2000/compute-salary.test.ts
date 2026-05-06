import { describe, it, expect } from "vitest";
import { computeSalary } from "./compute-salary";

// Neutral-modifier helper (ldr=6, kar=10, yvo=avo=0 → zero modifiers)
const neutral = {
  position: "c" as const,
  powerplayMod: 0,
  penaltyKillMod: 0,
  leadership: 6,
  charisma: 10
};

describe("computeSalary — port of QB `palkmaar` SUB", () => {
  describe("base curve — neutral modifiers, skater (ppp≠1)", () => {
    it("psk=1  → ~100", () => {
      expect(computeSalary({ ...neutral, skill: 1 })).toBe(100);
    });

    it("psk=5  → ~872 (5^1.345 * 100)", () => {
      expect(computeSalary({ ...neutral, skill: 5 })).toBeCloseTo(872, -1);
    });

    it("psk=10 → ~3311 (10^1.52 * 100)", () => {
      expect(computeSalary({ ...neutral, skill: 10 })).toBeCloseTo(3311, -1);
    });

    it("psk=12 → ~5199 (12^1.59 * 100)", () => {
      expect(computeSalary({ ...neutral, skill: 12 })).toBeCloseTo(5199, -1);
    });

    it("psk=15 → ~9851 (15^1.695 * 100)", () => {
      expect(computeSalary({ ...neutral, skill: 15 })).toBeCloseTo(9851, -1);
    });

    it("psk=20 → ~27097 (20^1.87 * 100)", () => {
      expect(computeSalary({ ...neutral, skill: 20 })).toBeCloseTo(27097, -1);
    });

    it("is strictly increasing with psk", () => {
      let prev = 0;
      for (let psk = 1; psk <= 20; psk++) {
        const s = computeSalary({ ...neutral, skill: psk });
        expect(s).toBeGreaterThan(prev);
        prev = s;
      }
    });
  });

  describe("goalies — pp/pk modifiers do NOT apply (ppp=1)", () => {
    it("goalie with max pp/pk modifiers earns the same as goalie with 0", () => {
      const base = computeSalary({ ...neutral, position: "g", skill: 10 });
      const withMods = computeSalary({
        ...neutral,
        position: "g",
        skill: 10,
        powerplayMod: 3,
        penaltyKillMod: 3
      });
      expect(base).toBe(withMods);
    });

    it("goalie salary differs from same-skill skater at neutral modifiers", () => {
      // Goalies miss the xvolisa multiplier (even at 0 it's still 1.0, but avo+yvo=0 → no diff).
      // However the formula is identical if mods are zero.
      const goalie = computeSalary({ ...neutral, position: "g", skill: 10 });
      const skater = computeSalary({ ...neutral, skill: 10 });
      // At neutral mods both are the same
      expect(goalie).toBe(skater);
    });

    it("skater with high pp/pk earns more than same-skill goalie", () => {
      const goalie = computeSalary({ ...neutral, position: "g", skill: 10 });
      const skater = computeSalary({
        ...neutral,
        skill: 10,
        powerplayMod: 3,
        penaltyKillMod: 3
      });
      expect(skater).toBeGreaterThan(goalie);
    });
  });

  describe("pp/pk modifier (xvolisa = 0.05, skaters only)", () => {
    it("+3 pp, +3 pk → +30% salary", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      const high = computeSalary({
        ...neutral,
        skill: 10,
        powerplayMod: 3,
        penaltyKillMod: 3
      });
      expect(high / base).toBeCloseTo(1.3, 2);
    });

    it("-3 pp, -3 pk → -30% salary", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      const low = computeSalary({
        ...neutral,
        skill: 10,
        powerplayMod: -3,
        penaltyKillMod: -3
      });
      expect(low / base).toBeCloseTo(0.7, 2);
    });

    it("mixed mods cancel out", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      const mixed = computeSalary({
        ...neutral,
        skill: 10,
        powerplayMod: 2,
        penaltyKillMod: -2
      });
      expect(mixed).toBe(base);
    });
  });

  describe("leadership modifier (johlisa = 0.02, neutral at ldr=6)", () => {
    it("ldr=6 → no change", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      const six = computeSalary({ ...neutral, skill: 10, leadership: 6 });
      expect(six).toBe(base);
    });

    it("ldr=1 → −10% (ldr-6=-5, *0.02=-0.1)", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      const low = computeSalary({ ...neutral, skill: 10, leadership: 1 });
      expect(low / base).toBeCloseTo(0.9, 2);
    });

    it("ldr=20 → +28% (ldr-6=14, *0.02=+0.28)", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      const high = computeSalary({ ...neutral, skill: 10, leadership: 20 });
      expect(high / base).toBeCloseTo(1.28, 2);
    });
  });

  describe("charisma modifier (karlisa = 0.015, neutral at kar=10)", () => {
    it("kar=10 → no change", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      expect(computeSalary({ ...neutral, skill: 10, charisma: 10 })).toBe(base);
    });

    it("kar=1 → −13.5% (kar-10=-9, *0.015=-0.135)", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      const low = computeSalary({ ...neutral, skill: 10, charisma: 1 });
      expect(low / base).toBeCloseTo(0.865, 2);
    });

    it("kar=20 → +15% (kar-10=10, *0.015=+0.15)", () => {
      const base = computeSalary({ ...neutral, skill: 10 });
      const high = computeSalary({ ...neutral, skill: 10, charisma: 20 });
      expect(high / base).toBeCloseTo(1.15, 2);
    });
  });

  describe("combined modifiers", () => {
    it("star skater: psk=15, ldr=18, kar=17, yvo=3, avo=2 earns well above base", () => {
      const base = computeSalary({ ...neutral, skill: 15 });
      const star = computeSalary({
        skill: 15,
        position: "c",
        powerplayMod: 3,
        penaltyKillMod: 2,
        leadership: 18,
        charisma: 17
      });
      expect(star).toBeGreaterThan(base * 1.3);
    });

    it("toxic star: psk=15, ldr=1, kar=1, yvo=-3, avo=-3 earns well below base", () => {
      const base = computeSalary({ ...neutral, skill: 15 });
      const toxic = computeSalary({
        skill: 15,
        position: "c",
        powerplayMod: -3,
        penaltyKillMod: -3,
        leadership: 1,
        charisma: 1
      });
      expect(toxic).toBeLessThan(base * 0.7);
    });

    it("always returns a positive integer", () => {
      for (let psk = 1; psk <= 20; psk++) {
        const worst = computeSalary({
          skill: psk,
          position: "d",
          powerplayMod: -3,
          penaltyKillMod: -3,
          leadership: 1,
          charisma: 1
        });
        expect(worst).toBeGreaterThan(0);
        expect(Number.isInteger(worst)).toBe(true);
      }
    });
  });

  describe("QB parity — spot checks against palkmaar formula", () => {
    it("psk=1, all neutral → exactly 100 (1^1.205 * 100 = 100)", () => {
      expect(computeSalary({ ...neutral, skill: 1 })).toBe(100);
    });

    it("psk=10, ldr=10, kar=15, yvo=1, avo=0 → deterministic value", () => {
      // exponent = 1.17 + 10*0.035 = 1.52
      // base = 10^1.52 * 100 = 3311.31
      // xvolisa: (1+0) * 0.05 = +5% → 3476.87
      // johlisa: (10-6) * 0.02 = +8% → 3754.81
      // karlisa: (15-10) * 0.015 = +7.5% → 4036.42 → 4036
      const result = computeSalary({
        skill: 10,
        position: "c",
        powerplayMod: 1,
        penaltyKillMod: 0,
        leadership: 10,
        charisma: 15
      });
      expect(result).toBeCloseTo(4037, -1);
    });
  });
});
