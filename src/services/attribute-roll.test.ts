import { describe, expect, it } from "vitest";
import { MersenneTwister19937 } from "random-js";
import { createRandomWithEngine } from "@/services/random";
import {
  createAttributeRollService,
  attributeRollProbability
} from "@/services/attribute-roll";
import type { ManagerAttributes } from "@/data/managers";

const baseAttrs: ManagerAttributes = {
  strategy: 0,
  specialTeams: 0,
  negotiation: 0,
  resourcefulness: 0,
  charisma: 0,
  luck: 0
};

describe("attributeRoll", () => {
  it("never succeeds when threshold is 0 (roll < 0 impossible)", () => {
    const r = createRandomWithEngine(MersenneTwister19937.seed(42));
    const { attributeRoll } = createAttributeRollService(r);
    for (let i = 0; i < 1000; i++) {
      // luck = 0, weight = 15, base = 0 → threshold = 0
      expect(attributeRoll(baseAttrs, "luck", 15, 0)).toBe(false);
    }
  });

  it("always succeeds when threshold > 100", () => {
    const r = createRandomWithEngine(MersenneTwister19937.seed(42));
    const { attributeRoll } = createAttributeRollService(r);
    const lucky: ManagerAttributes = { ...baseAttrs, resourcefulness: 3 };
    // resourcefulness 3 × 50 + base 15 = 165 ⇒ always true
    for (let i = 0; i < 1000; i++) {
      expect(attributeRoll(lucky, "resourcefulness", 50, 15)).toBe(true);
    }
  });

  it("uses strict less-than (off-by-one is intentional)", () => {
    // Pier Paolo Pasolini, our test subject, has charisma = 1.
    // Call: attributeRoll(pasolini, "charisma", 30, 0)
    //   threshold = 0 + 1*30 = 30
    //   succeed iff roll ∈ {1..29} ⇒ 29/100 = 29%
    const pasolini: ManagerAttributes = { ...baseAttrs, charisma: 1 };
    expect(attributeRollProbability(pasolini, "charisma", 30, 0)).toBeCloseTo(
      0.29,
      5
    );
  });

  it("matches QB mafia luck check distribution", () => {
    // tarko(u(pv), 6, 15, 0) with luck = 3 ⇒ threshold = 45 ⇒ 44%
    const lucky: ManagerAttributes = { ...baseAttrs, luck: 3 };
    expect(attributeRollProbability(lucky, "luck", 15, 0)).toBeCloseTo(0.44, 5);
    // luck = -3 ⇒ threshold = -45 ⇒ 0%
    const cursed: ManagerAttributes = { ...baseAttrs, luck: -3 };
    expect(attributeRollProbability(cursed, "luck", 15, 0)).toBe(0);
  });

  it("empirical distribution converges to the analytical probability", () => {
    const r = createRandomWithEngine(MersenneTwister19937.seed(7));
    const { attributeRoll } = createAttributeRollService(r);
    const pasolini: ManagerAttributes = { ...baseAttrs, charisma: 1 };
    let hits = 0;
    const trials = 10000;
    for (let i = 0; i < trials; i++) {
      if (attributeRoll(pasolini, "charisma", 30, 0)) {
        hits++;
      }
    }
    const empirical = hits / trials;
    // 29% expected; allow 2pp tolerance
    expect(empirical).toBeGreaterThan(0.27);
    expect(empirical).toBeLessThan(0.31);
  });
});
