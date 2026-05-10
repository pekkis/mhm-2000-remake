import { describe, expect, it } from "vitest";
import {
  basePerMatchFee,
  buildOfferPayouts,
  goalCategories,
  haggleSuccessThreshold,
  applyHaggleBump,
  rollCandidateJitter,
  emptySponsorPayouts,
  sponsorNames,
  sponsorPayoutSlots,
  type GoalCategoryId,
  type GoalLevel
} from "@/data/mhm2000/sponsors";
import { fixedRandom, scriptedRandom } from "@/__tests__/factories";

const noGoals: Record<GoalCategoryId, GoalLevel> = {
  phl: 1,
  divMut: 1,
  cup: 1,
  ehl: 1
};

const jitterOne = new Array<number>(20).fill(1);

describe("sponsorNames", () => {
  it("has 93 names matching the QB data file", () => {
    expect(sponsorNames).toHaveLength(93);
  });

  it("starts with Anttinen and ends with Woodhacker", () => {
    expect(sponsorNames[0]).toBe("Anttinen");
    expect(sponsorNames[92]).toBe("Woodhacker");
  });
});

describe("basePerMatchFee", () => {
  it("computes the per-match fee for a perennial champion on easy difficulty", () => {
    // sed=1, sedd=1, seddd=1 → sin1 = 49 - 1 = 48
    // 20000 * (1 + 48*0.07) * (200/100) = 20000 * 4.36 * 2 = 174400
    const fee = basePerMatchFee([1, 1, 1], 200);
    expect(fee).toBe(174400);
  });

  it("computes the per-match fee for a bottom-tier team on hard difficulty", () => {
    // sed=48, sedd=48, seddd=48 → sin1 = 49 - 48 = 1
    // 20000 * (1 + 1*0.07) * (90/100) = 20000 * 1.07 * 0.9 = 19260
    const fee = basePerMatchFee([48, 48, 48], 90);
    expect(fee).toBe(19260);
  });

  it("uses the rolling 3-season average", () => {
    // sed=1, sedd=24, seddd=48 → mean=24.333 → sin1 = 49 - 24.333 = 24.667
    // 20000 * (1 + 24.667*0.07) * (100/100) = 20000 * 2.72667 = 54533
    const fee = basePerMatchFee([1, 24, 48], 100);
    expect(fee).toBe(54533);
  });
});

describe("goalCategories", () => {
  it("enables PHL (max 4) only for tier 1 teams", () => {
    const cats = goalCategories(1, false);
    expect(cats[0]).toEqual({ id: "phl", maxLevel: 4 });
    expect(cats[1]).toEqual({ id: "divMut", maxLevel: 0 });
  });

  it("enables DIV/MUT (max 3) only for tier > 1", () => {
    const cats = goalCategories(2, false);
    expect(cats[0]).toEqual({ id: "phl", maxLevel: 0 });
    expect(cats[1]).toEqual({ id: "divMut", maxLevel: 3 });
  });

  it("always enables CUP (max 3)", () => {
    expect(goalCategories(1, false)[2]).toEqual({ id: "cup", maxLevel: 3 });
    expect(goalCategories(3, false)[2]).toEqual({ id: "cup", maxLevel: 3 });
  });

  it("enables EHL (max 3) only when qualified", () => {
    expect(goalCategories(1, false)[3]).toEqual({ id: "ehl", maxLevel: 0 });
    expect(goalCategories(1, true)[3]).toEqual({ id: "ehl", maxLevel: 3 });
  });
});

describe("buildOfferPayouts", () => {
  const base = 100_000;

  it("with no goals, only slot 20 (perMatchFee) is set", () => {
    const payouts = buildOfferPayouts(base, noGoals, 1, jitterOne);
    expect(payouts.perMatchFee).toBe(100_000);
    for (const slot of sponsorPayoutSlots) {
      if (slot !== "perMatchFee") {
        expect(payouts[slot]).toBe(0);
      }
    }
  });

  describe("PHL ambition", () => {
    it("level 2 (PLAY-OFFIT) sets slot 5, 13, 14, 15", () => {
      const payouts = buildOfferPayouts(
        base,
        { ...noGoals, phl: 2 },
        1,
        jitterOne
      );
      expect(payouts.playoffQualification).toBe(300_000); // 3 × base
      expect(payouts.playoffMiss).toBe(-360_000); // -1.2 × 300k
      expect(payouts.relegationPlayoff).toBe(-108_000); // 0.3 × -360k
      expect(payouts.relegated).toBe(-144_000); // 0.4 × -360k
    });

    it("level 3 (SEMIFINAALI) sets medal slots", () => {
      const payouts = buildOfferPayouts(
        base,
        { ...noGoals, phl: 3 },
        1,
        jitterOne
      );
      expect(payouts.phlChampion).toBe(500_000); // 5 × base
      expect(payouts.phlSilver).toBe(450_000);
      expect(payouts.phlBronze).toBe(400_000);
      expect(payouts.phlFourth).toBe(350_000);
      expect(payouts.semifinalElimination).toBe(-400_000); // -0.8 × 500k
    });

    it("level 4 (MITALI) sets big medal bonuses and penalties", () => {
      const payouts = buildOfferPayouts(
        base,
        { ...noGoals, phl: 4 },
        1,
        jitterOne
      );
      expect(payouts.phlChampion).toBe(800_000); // 8 × base
      expect(payouts.phlSilver).toBe(700_000);
      expect(payouts.phlBronze).toBe(600_000);
      expect(payouts.noMedal).toBe(-800_000); // -1 × 800k
    });
  });

  describe("CUP ambition", () => {
    it("level 3 (SEMIFINAALI) sets cup win and per-round", () => {
      const payouts = buildOfferPayouts(
        base,
        { ...noGoals, cup: 3 },
        1,
        jitterOne
      );
      expect(payouts.cupWinner).toBe(250_000); // 2.5 × base
      expect(payouts.cupPerRound).toBe(150_000); // 1.5 × base
      expect(payouts.cupPreSemifinalLoss).toBe(-900_000); // -6 × 150k
      expect(payouts.cupFirstRoundLoss).toBe(-300_000); // -2 × 150k
    });
  });

  describe("EHL ambition", () => {
    it("level 3 (EUROOPAN MESTARUUS) sets EHL champion and penalty", () => {
      const payouts = buildOfferPayouts(
        base,
        { ...noGoals, ehl: 3 },
        1,
        jitterOne
      );
      expect(payouts.ehlChampion).toBe(800_000); // 8 × base
      expect(payouts.ehlMiss).toBe(-720_000); // -0.9 × 800k
    });
  });

  describe("DIV/MUT ambition", () => {
    it("level 3 (SARJANOUSU) at tier 2 sets promotion + relegation penalties", () => {
      const payouts = buildOfferPayouts(
        base,
        { ...noGoals, divMut: 3 },
        2,
        jitterOne
      );
      expect(payouts.promoted).toBe(800_000); // 8 × base
      expect(payouts.playoffMiss).toBe(-80_000); // -0.1 × 800k
      expect(payouts.noPromotion).toBe(-600_000); // -0.75 × 800k
      // tier 2 extras
      expect(payouts.relegationPlayoff).toBe(-150_000); // 0.25 × -600k
      expect(payouts.relegated).toBe(-300_000); // 0.5 × -600k
    });

    it("level 3 (SARJANOUSU) at tier 3 omits the tier-2 extras", () => {
      const payouts = buildOfferPayouts(
        base,
        { ...noGoals, divMut: 3 },
        3,
        jitterOne
      );
      expect(payouts.promoted).toBe(800_000);
      expect(payouts.relegationPlayoff).toBe(0);
      expect(payouts.relegated).toBe(0);
    });
  });

  it("applies jitter as a multiplier with truncation", () => {
    const jitter = new Array<number>(20).fill(0.9);
    const payouts = buildOfferPayouts(base, noGoals, 1, jitter);
    expect(payouts.perMatchFee).toBe(90_000); // 100k * 0.9
  });
});

describe("rollCandidateJitter", () => {
  it("produces 20 values in the 0.90–0.95 range without arena bonus", () => {
    const random = fixedRandom(0.5);
    const jitter = rollCandidateJitter(random, false);
    expect(jitter).toHaveLength(20);
    // 0.9 + 0.05 * 0.5 = 0.925
    for (const v of jitter) {
      expect(v).toBeCloseTo(0.925, 10);
    }
  });

  it("adds +0.05 with arena bonus, reaching 0.95–1.00", () => {
    const random = fixedRandom(1.0);
    const jitter = rollCandidateJitter(random, true);
    // 0.9 + 0.05 * 1.0 + 0.05 = 1.0
    for (const v of jitter) {
      expect(v).toBeCloseTo(1.0, 10);
    }
  });
});

describe("haggleSuccessThreshold", () => {
  it("starts at 97 with neutral negotiator", () => {
    expect(haggleSuccessThreshold(0, 0)).toBe(97);
  });

  it("decreases by 5 per prior haggle", () => {
    expect(haggleSuccessThreshold(1, 0)).toBe(92);
    expect(haggleSuccessThreshold(3, 0)).toBe(82);
  });

  it("adds negotiation skill × 5", () => {
    expect(haggleSuccessThreshold(0, 3)).toBe(112);
    expect(haggleSuccessThreshold(0, -3)).toBe(82);
  });

  it("combines haggle count and skill", () => {
    // 97 - 2*5 + (-2)*5 = 97 - 10 - 10 = 77
    expect(haggleSuccessThreshold(2, -2)).toBe(77);
  });
});

describe("applyHaggleBump", () => {
  it("bumps positive slots by ~1.5–2.5% when the 50% roll hits", () => {
    const payouts = { ...emptySponsorPayouts, perMatchFee: 100_000 };
    // integer=1 (≤50 → hit), real=0.5 → bump = 0.015 + 0.01*0.5 = 0.02
    const random = scriptedRandom({ integer: [1], real: [0.5] });
    applyHaggleBump(payouts, random);
    expect(payouts.perMatchFee).toBe(102_000);
  });

  it("does not bump negative slots", () => {
    const payouts = { ...emptySponsorPayouts, noMedal: -500_000 };
    const random = fixedRandom(0);
    applyHaggleBump(payouts, random);
    expect(payouts.noMedal).toBe(-500_000);
  });

  it("skips zero slots", () => {
    const payouts = { ...emptySponsorPayouts };
    const random = fixedRandom(0);
    applyHaggleBump(payouts, random);
    expect(payouts.perMatchFee).toBe(0);
  });

  it("does not bump when the 50% roll misses", () => {
    const payouts = { ...emptySponsorPayouts, perMatchFee: 100_000 };
    // integer=51 (>50 → miss)
    const random = scriptedRandom({ integer: [51] });
    applyHaggleBump(payouts, random);
    expect(payouts.perMatchFee).toBe(100_000);
  });
});
