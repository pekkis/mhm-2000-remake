import { describe, it, expect } from "vitest";
import {
  computeTeamNeedsRating,
  checkWillingness,
  computeWillingnessThreshold,
  computeNhlOptionThreshold,
  computeAskingPrice,
  computeAcceptanceProbability,
  attemptNegotiation,
  adjustSalary,
  type NegotiationPlayer
} from "./contract-negotiation";
import type { TeamBudget } from "@/data/mhm2000/budget";

// ─── Test fixtures ────────────────────────────────────────────────────────────

// BudgetLevel = 1|2|3|4|5 (no zeroes or negatives).
// computeTeamNeedsRating formula: coaching + health + benefits*2 - skill, capped at 0.
// With all-1 budget: 1+1+2=4.  All-3: 3+3+6=12.  All-5: 5+5+10=20.

const MID_BUDGET: TeamBudget = {
  coaching: 3,
  goalieCoaching: 3,
  health: 3,
  benefits: 3,
  juniors: 3
};

const TIGHT_BUDGET: TeamBudget = {
  coaching: 1,
  goalieCoaching: 1,
  health: 1,
  benefits: 1,
  juniors: 1
};

const GENEROUS_BUDGET: TeamBudget = {
  coaching: 5,
  goalieCoaching: 5,
  health: 5,
  benefits: 5,
  juniors: 5
};

const BASE_SKATER: NegotiationPlayer = {
  id: "test1",
  initial: "P",
  surname: "Pasolini",
  nationality: "IT",
  skill: 10,
  position: "c",
  age: 25,
  ego: 10,
  leadership: 6,
  charisma: 10,
  powerplayMod: 0,
  penaltyKillMod: 0,
  specialty: null,
  effects: [],
  tags: [],
  condition: 0,
  askingSalary: 10000,
  stats: {
    season: { games: 0, goals: 0, assists: 0 },
    total: { games: 0, goals: 0, assists: 0 }
  },
  hasSpecialContract: false
};

// ─── computeTeamNeedsRating ───────────────────────────────────────────────────

describe("computeTeamNeedsRating — port of QB `a` calculation", () => {
  it("returns 0 when team budget exceeds player skill", () => {
    // MID budget (all 3): coaching=3 + health=3 + benefits*2=6 - skill=3 = 9 → 0
    expect(
      computeTeamNeedsRating(MID_BUDGET, { position: "c", skill: 3 })
    ).toBe(0);
  });

  it("is always <= 0 (capped at zero)", () => {
    // GENEROUS budget always produces surplus for reasonable skills
    expect(
      computeTeamNeedsRating(GENEROUS_BUDGET, { position: "c", skill: 5 })
    ).toBe(0);
  });

  it("skater uses coaching slot (not goalieCoaching)", () => {
    // coaching=1, goalieCoaching=5, health=1, benefits=1
    // skater:  1+1+2 - 8 = -4
    // goalie:  5+1+2 - 8 =  0 (positive, capped)
    const budget: TeamBudget = { ...TIGHT_BUDGET, goalieCoaching: 5 };
    const skaterA = computeTeamNeedsRating(budget, { position: "c", skill: 8 });
    const goalieA  = computeTeamNeedsRating(budget, { position: "g", skill: 8 });
    expect(skaterA).toBe(-4);
    expect(goalieA).toBe(0);
  });

  it("goalie uses goalieCoaching slot (not coaching)", () => {
    // coaching=5, goalieCoaching=1, health=1, benefits=1
    // skater:  5+1+2 - 8 = 0 (surplus)
    // goalie:  1+1+2 - 8 = -4
    const budget: TeamBudget = { ...TIGHT_BUDGET, coaching: 5 };
    const skaterA = computeTeamNeedsRating(budget, { position: "lw", skill: 8 });
    const goalieA  = computeTeamNeedsRating(budget, { position: "g",  skill: 8 });
    expect(skaterA).toBe(0);
    expect(goalieA).toBe(-4);
  });

  it("benefits slot is multiplied by 2 — port of QB valb(5)*2", () => {
    // coaching=1, health=1, benefits=1, skill=5 → 1+1+2-5 = -1
    // coaching=1, health=1, benefits=2, skill=5 → 1+1+4-5 =  1 → 0 (capped)
    const low  = computeTeamNeedsRating({ ...TIGHT_BUDGET, benefits: 1 }, { position: "c", skill: 5 });
    const high = computeTeamNeedsRating({ ...TIGHT_BUDGET, benefits: 2 }, { position: "c", skill: 5 });
    expect(low).toBe(-1);
    expect(high).toBe(0); // benefits*2 pushed it into surplus
  });

  it("high-skill player with tight budget: deeply negative rating", () => {
    // TIGHT (all 1): 1+1+2-15 = -11
    const a = computeTeamNeedsRating(TIGHT_BUDGET, { position: "c", skill: 15 });
    expect(a).toBe(-11);
  });
});

// ─── checkWillingness ────────────────────────────────────────────────────────

describe("checkWillingness — port of ILEX5.BAS:6337-6352", () => {
  it("returns 'refused' when a <= -4", () => {
    expect(checkWillingness(-4)).toBe("refused");
    expect(checkWillingness(-10)).toBe("refused");
  });

  it("returns 'unhappy' when -4 < a < -1", () => {
    expect(checkWillingness(-3)).toBe("unhappy");
    expect(checkWillingness(-2)).toBe("unhappy");
  });

  it("returns 'neutral' when a = -1", () => {
    expect(checkWillingness(-1)).toBe("neutral");
  });

  it("returns 'happy' when a = 0", () => {
    expect(checkWillingness(0)).toBe("happy");
  });
});

// ─── computeWillingnessThreshold ─────────────────────────────────────────────

describe("computeWillingnessThreshold — port of sopimus(2) init", () => {
  it("baseline (a=0, charisma=0) = 85", () => {
    expect(computeWillingnessThreshold(0, 0)).toBe(85);
  });

  it("negative a increases threshold (player more willing to negotiate)", () => {
    // QB: 85 - a*10 + charisma*5; a is negative so -a*10 is positive
    expect(computeWillingnessThreshold(-3, 0)).toBe(85 + 30); // 115
  });

  it("positive managerCharisma adds to threshold", () => {
    expect(computeWillingnessThreshold(0, 3)).toBe(85 + 15); // 100
  });

  it("negative managerCharisma reduces threshold", () => {
    expect(computeWillingnessThreshold(0, -3)).toBe(85 - 15); // 70
  });

  it("combined a=-2, charisma=2 → 85 + 20 + 10 = 115", () => {
    expect(computeWillingnessThreshold(-2, 2)).toBe(115);
  });
});

// ─── computeNhlOptionThreshold ───────────────────────────────────────────────

describe("computeNhlOptionThreshold — port of ILEX5.BAS:6365-6376", () => {
  it("returns 0 for players aged 26+", () => {
    expect(computeNhlOptionThreshold(26, 13)).toBe(0);
    expect(computeNhlOptionThreshold(35, 20)).toBe(0);
  });

  describe("age <= 20", () => {
    it("skill >= 13 → threshold 2", () => {
      expect(computeNhlOptionThreshold(18, 13)).toBe(2);
      expect(computeNhlOptionThreshold(20, 15)).toBe(2);
    });
    it("skill 10..12 → threshold 3", () => {
      expect(computeNhlOptionThreshold(19, 10)).toBe(3);
      expect(computeNhlOptionThreshold(20, 12)).toBe(3);
    });
    it("skill 8..9 → threshold 4", () => {
      expect(computeNhlOptionThreshold(18, 8)).toBe(4);
    });
    it("skill < 8 → 0 (not eligible)", () => {
      expect(computeNhlOptionThreshold(20, 7)).toBe(0);
    });
  });

  describe("age 21..23", () => {
    it("skill >= 13 → threshold 2", () => {
      expect(computeNhlOptionThreshold(22, 13)).toBe(2);
    });
    it("skill 11..12 → threshold 3", () => {
      expect(computeNhlOptionThreshold(23, 11)).toBe(3);
    });
    it("skill 9..10 → threshold 4", () => {
      expect(computeNhlOptionThreshold(21, 9)).toBe(4);
    });
    it("skill < 9 → 0", () => {
      expect(computeNhlOptionThreshold(23, 8)).toBe(0);
    });
  });

  describe("age 24", () => {
    it("skill >= 13 → threshold 2", () => {
      expect(computeNhlOptionThreshold(24, 13)).toBe(2);
    });
    it("skill 12 → threshold 3", () => {
      expect(computeNhlOptionThreshold(24, 12)).toBe(3);
    });
    it("skill < 12 → 0", () => {
      expect(computeNhlOptionThreshold(24, 11)).toBe(0);
    });
  });

  describe("age 25", () => {
    it("skill >= 13 → threshold 2", () => {
      expect(computeNhlOptionThreshold(25, 13)).toBe(2);
    });
    it("skill < 13 → 0", () => {
      expect(computeNhlOptionThreshold(25, 12)).toBe(0);
    });
  });
});

// ─── computeAskingPrice ──────────────────────────────────────────────────────

describe("computeAskingPrice — port of palkehd(2) computation", () => {
  const baseSalary = 3311; // approx psk=10 neutral

  it("neutral ego=10, a=0, duration=1, no clause → asking ≈ baseSalary", () => {
    const asking = computeAskingPrice(BASE_SKATER, baseSalary, 0, 1, "none", 0);
    // ego=10: (1 + 0*0.01) = 1; a=0: *1; young penalty for duration=1: *1
    expect(asking).toBeCloseTo(baseSalary, 0);
  });

  it("high ego (20) increases asking price by 10%", () => {
    const base = computeAskingPrice(BASE_SKATER, baseSalary, 0, 1, "none", 0);
    const highEgo = computeAskingPrice(
      { ...BASE_SKATER, ego: 20 },
      baseSalary, 0, 1, "none", 0
    );
    expect(highEgo).toBeCloseTo(base * 1.1, 0);
  });

  it("low ego (1) reduces asking price by 9%", () => {
    const base = computeAskingPrice(BASE_SKATER, baseSalary, 0, 1, "none", 0);
    const lowEgo = computeAskingPrice(
      { ...BASE_SKATER, ego: 1 },
      baseSalary, 0, 1, "none", 0
    );
    expect(lowEgo).toBeCloseTo(base * (1 + (1 - 10) * 0.01), 0);
  });

  it("negative teamNeedsRating slightly reduces asking price", () => {
    const base = computeAskingPrice(BASE_SKATER, baseSalary, 0, 1, "none", 0);
    const stretched = computeAskingPrice(BASE_SKATER, baseSalary, -3, 1, "none", 0);
    expect(stretched).toBeLessThan(base);
  });

  it("longer contract increases asking price for young players (26-age premium)", () => {
    const d1 = computeAskingPrice(
      { ...BASE_SKATER, age: 20 }, baseSalary, 0, 1, "none", 0
    );
    const d4 = computeAskingPrice(
      { ...BASE_SKATER, age: 20 }, baseSalary, 0, 4, "none", 0
    );
    expect(d4).toBeGreaterThan(d1);
  });

  it("free-fire clause increases asking price", () => {
    const base = computeAskingPrice(BASE_SKATER, baseSalary, 0, 1, "none", 0);
    const ff = computeAskingPrice(BASE_SKATER, baseSalary, 0, 1, "free-fire", 0);
    expect(ff).toBeGreaterThan(base);
  });

  it("free-fire premium scales with leadership", () => {
    const lowLdr = computeAskingPrice(
      { ...BASE_SKATER, leadership: 1 }, baseSalary, 0, 1, "free-fire", 0
    );
    const highLdr = computeAskingPrice(
      { ...BASE_SKATER, leadership: 20 }, baseSalary, 0, 1, "free-fire", 0
    );
    expect(highLdr).toBeGreaterThan(lowLdr);
  });

  it("long contract without NHL clause adds premium when player is eligible", () => {
    // threshold=2 means NHL clause required for 2+ year contracts
    const withNhl = computeAskingPrice(
      { ...BASE_SKATER, age: 20, skill: 15 }, baseSalary, 0, 3, "nhl", 2
    );
    const withoutNhl = computeAskingPrice(
      { ...BASE_SKATER, age: 20, skill: 15 }, baseSalary, 0, 3, "none", 2
    );
    expect(withoutNhl).toBeGreaterThan(withNhl);
  });

  it("NHL clause avoids the long-contract premium", () => {
    const base = computeAskingPrice(
      { ...BASE_SKATER, age: 20, skill: 15 }, baseSalary, 0, 1, "none", 2
    );
    const nhlLong = computeAskingPrice(
      { ...BASE_SKATER, age: 20, skill: 15 }, baseSalary, 0, 3, "nhl", 2
    );
    // NHL clause avoids the premium so long contract with NHL < long without
    expect(nhlLong).toBeCloseTo(base * (1 + (26 - 20) * 0.01 * (3 - 1)), 0);
  });
});

// ─── computeAcceptanceProbability ────────────────────────────────────────────

describe("computeAcceptanceProbability — port of sin1 computation", () => {
  it("exact match (ratio=1) with neutral negotiation → 50", () => {
    const p = computeAcceptanceProbability(1000, 1000, 0);
    expect(p).toBeCloseTo(50, 5);
  });

  it("offering more than asking (ratio > 1) increases probability beyond 50", () => {
    const p = computeAcceptanceProbability(1100, 1000, 0);
    expect(p).toBeGreaterThan(50);
  });

  it("offering less than asking (ratio < 1) decreases probability below 50", () => {
    const p = computeAcceptanceProbability(900, 1000, 0);
    expect(p).toBeLessThan(50);
  });

  it("positive managerNegotiation adds to probability (each +1 = +5 points)", () => {
    const base = computeAcceptanceProbability(1000, 1000, 0);
    const skilled = computeAcceptanceProbability(1000, 1000, 3);
    expect(skilled - base).toBeCloseTo(15, 5);
  });

  it("negative managerNegotiation reduces probability", () => {
    const base = computeAcceptanceProbability(1000, 1000, 0);
    const bad = computeAcceptanceProbability(1000, 1000, -3);
    expect(base - bad).toBeCloseTo(15, 5);
  });

  it("very low offer (ratio << 1) results in negative probability", () => {
    // ratio=0.1 → cubed=0.001 → p = 50 - (100 - 0.1) = -49.9
    const p = computeAcceptanceProbability(100, 1000, 0);
    expect(p).toBeCloseTo(-49.9, 0);
    expect(p).toBeLessThan(0);
  });
});

// ─── attemptNegotiation ──────────────────────────────────────────────────────

describe("attemptNegotiation — port of ILEX5.BAS CASE 4 handler", () => {
  it("accepts when random roll < acceptanceProbability (sin2 < sin1)", () => {
    // probability=80 → any roll < 80% accepts
    const result = attemptNegotiation(80, 100, 2, 0, 0.5); // sin2=50 < 80
    expect(result.outcome).toBe("accepted");
  });

  it("rejects when random roll >= acceptanceProbability", () => {
    const result = attemptNegotiation(30, 100, 2, 0, 0.9); // sin2=90 > 30
    expect(result.outcome).toBe("rejected");
  });

  it("happy=true when acceptance margin > 50", () => {
    // probability=80, sin2=10 → margin=70 > 50
    const result = attemptNegotiation(80, 100, 2, 0, 0.1);
    expect(result.outcome).toBe("accepted");
    if (result.outcome === "accepted") {
      expect(result.happy).toBe(true);
    }
  });

  it("happy=false when acceptance margin <= 50", () => {
    // probability=80, sin2=35 → margin=45 <= 50
    const result = attemptNegotiation(80, 100, 2, 0, 0.35);
    expect(result.outcome).toBe("accepted");
    if (result.outcome === "accepted") {
      expect(result.happy).toBe(false);
    }
  });

  it("on rejection, threshold decrements by negotiationRound", () => {
    // threshold=100, round=4, managerNeg=0, roll=0 → recovery=0
    // newThreshold = 100 - 4 + 0 = 96
    const result = attemptNegotiation(30, 100, 4, 0, 0.9);
    expect(result.outcome).toBe("rejected");
    if (result.outcome === "rejected") {
      expect(result.newThreshold).toBe(96);
    }
  });

  it("positive managerNegotiation adds INT(neg*roll) recovery to threshold", () => {
    // threshold=100, round=2, managerNeg=3, roll=0.9 → recovery=INT(3*0.9)=2
    // newThreshold = 100 - 2 + 2 = 100
    const result = attemptNegotiation(30, 100, 2, 3, 0.9);
    if (result.outcome === "rejected") {
      // recovery = floor(3 * 0.9) = floor(2.7) = 2
      expect(result.newThreshold).toBe(100 - 2 + 2);
    }
  });

  it("very negative probability (< -10) immediately zeros threshold", () => {
    // probability = -50 → newThreshold set to 0 before decrement, then 0 - round + recovery
    const result = attemptNegotiation(-50, 100, 2, 0, 0.99);
    expect(result.outcome).toBe("rejected");
    if (result.outcome === "rejected") {
      // threshold zeroed → 0 - 2 + 0 = -2 (player walked)
      expect(result.newThreshold).toBeLessThanOrEqual(0);
    }
  });
});

// ─── adjustSalary ────────────────────────────────────────────────────────────

describe("adjustSalary — ±1.5% per click, min 50", () => {
  it("up: increases salary by ~1.5%", () => {
    const result = adjustSalary(1000, "up");
    expect(result).toBe(1015);
  });

  it("down: decreases salary by ~1.5%", () => {
    const result = adjustSalary(1000, "down");
    expect(result).toBe(985);
  });

  it("down: floors at 50", () => {
    expect(adjustSalary(50, "down")).toBe(50);
    expect(adjustSalary(51, "down")).toBeGreaterThanOrEqual(50);
  });

  it("repeated up/down is approximately symmetric", () => {
    const up = adjustSalary(1000, "up");
    const back = adjustSalary(up, "down");
    expect(Math.abs(back - 1000)).toBeLessThanOrEqual(2); // rounding noise
  });
});
