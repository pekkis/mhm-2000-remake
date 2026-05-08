import {
  applyConditionPenalty,
  applyPositionPenalty,
  applySpecialtyPenalty,
  effectiveStrength,
  floorAtZero
} from "@/services/lineup";
import type { HiredPlayer } from "@/state/player";
import { describe, expect, it } from "vitest";

const createPlayer = (partial: Partial<HiredPlayer> = {}): HiredPlayer => {
  const base: HiredPlayer = {
    id: "pasolini",
    initial: "P",
    surname: "Pasolini",
    nationality: "IT",
    age: 25,
    charisma: 10,
    condition: 0,
    contract: {
      duration: 1,
      salary: 1000,
      type: "regular"
    },
    effects: [],
    ego: 0,
    leadership: 0,
    penaltyKillMod: 0,
    position: "c",
    powerplayMod: 0,
    skill: 10,
    specialty: "none",
    stats: {
      season: {
        assists: 0,
        games: 0,
        goals: 0
      },
      total: {
        assists: 0,
        games: 0,
        goals: 0
      }
    },
    tags: [],
    type: "hired"
  };

  return {
    ...base,
    ...partial
  };
};

describe("applyPositionPenalty", () => {
  it("goalie slot: no penalty regardless of position", () => {
    const center = createPlayer({ position: "c" });
    expect(applyPositionPenalty(center.position, "g", 10)).toBe(10);
  });

  it("defense slot: defenseman at full value", () => {
    const def = createPlayer({ position: "d" });
    expect(applyPositionPenalty(def.position, "d", 10)).toBe(10);
  });

  it("defense slot: forward in D slot → ×0.7", () => {
    const center = createPlayer({ position: "c" });
    expect(applyPositionPenalty(center.position, "d", 10)).toBe(7);
  });

  it("forward slot: correct position at full value", () => {
    const center = createPlayer({ position: "c" });
    expect(applyPositionPenalty(center.position, "c", 10)).toBe(10);
  });

  it("forward slot: defenseman in forward slot → ×0.7", () => {
    const def = createPlayer({ position: "d" });
    expect(applyPositionPenalty(def.position, "lw", 10)).toBe(7);
  });

  it("forward slot: wrong forward type → −1", () => {
    const rw = createPlayer({ position: "rw" });
    expect(applyPositionPenalty(rw.position, "lw", 10)).toBe(9);
  });

  it("PK forward slot: any forward at full value", () => {
    const rw = createPlayer({ position: "rw" });
    expect(applyPositionPenalty(rw.position, "pkf", 10)).toBe(10);
  });

  it("PK forward slot: defenseman → ×0.7", () => {
    const def = createPlayer({ position: "d" });
    expect(applyPositionPenalty(def.position, "pkf", 10)).toBe(7);
  });

  it("PK forward slot: goalie → ×0.7", () => {
    const goalie = createPlayer({ position: "g" });
    expect(applyPositionPenalty(goalie.position, "pkf", 10)).toBe(7);
  });

  it("×0.7 uses Math.trunc (QB FIX), not Math.round", () => {
    // FIX(0.7 * 15) = FIX(10.5) = 10, not 11
    expect(applyPositionPenalty("c", "d", 15)).toBe(10);
  });
});

describe("applySpecialtyPenalty", () => {
  it("greedySurfer → ×0.7 rounded (QB CINT)", () => {
    expect(applySpecialtyPenalty("greedySurfer", 10)).toBe(7);
  });

  it("greedySurfer uses Math.round, not trunc", () => {
    // CINT(0.7 * 15) = CINT(10.5) = 11 (round), not 10 (trunc)
    expect(applySpecialtyPenalty("greedySurfer", 15)).toBe(11);
  });

  it("other specialties → no penalty", () => {
    expect(applySpecialtyPenalty("enforcer", 10)).toBe(10);
    expect(applySpecialtyPenalty("foulMouth", 10)).toBe(10);
    expect(applySpecialtyPenalty("evangelist", 10)).toBe(10);
  });

  it("null specialty → no penalty", () => {
    expect(applySpecialtyPenalty(null, 10)).toBe(10);
  });

  it("none specialty → no penalty", () => {
    expect(applySpecialtyPenalty("none", 10)).toBe(10);
  });
});

describe("applyConditionPenalty", () => {
  it("positive condition → no penalty", () => {
    expect(applyConditionPenalty(3, 10)).toBe(10);
  });

  it("zero condition → no penalty", () => {
    expect(applyConditionPenalty(0, 10)).toBe(10);
  });

  it("condition -1 → ×0.9", () => {
    expect(applyConditionPenalty(-1, 10)).toBe(9);
  });

  it("condition -2 → ×0.7", () => {
    expect(applyConditionPenalty(-2, 10)).toBe(7);
  });

  it("condition -3 → ×0.5", () => {
    expect(applyConditionPenalty(-3, 10)).toBe(5);
  });

  it("condition < -3 → ×0.3", () => {
    expect(applyConditionPenalty(-4, 10)).toBe(3);
    expect(applyConditionPenalty(-6, 10)).toBe(3);
  });

  it("uses Math.trunc (QB FIX)", () => {
    // FIX(0.9 * 7) = FIX(6.3) = 6
    expect(applyConditionPenalty(-1, 7)).toBe(6);
    // FIX(0.5 * 15) = FIX(7.5) = 7
    expect(applyConditionPenalty(-3, 15)).toBe(7);
  });
});

describe("floorAtZero", () => {
  it("positive → unchanged", () => {
    expect(floorAtZero(5)).toBe(5);
  });

  it("zero → zero", () => {
    expect(floorAtZero(0)).toBe(0);
  });

  it("negative → zero", () => {
    expect(floorAtZero(-3)).toBe(0);
  });
});

describe("effectiveStrength", () => {
  it("no penalties → base value unchanged", () => {
    expect(effectiveStrength(10, "c", "c", "none", 0)).toBe(10);
  });

  it("applies all penalties in QB order", () => {
    // Center in D slot, greedySurfer, condition -2
    // QB order: position → specialty → condition → floor
    // Step 1: position: C in D slot → trunc(0.7 * 20) = 14
    // Step 2: specialty: greedySurfer → round(0.7 * 14) = round(9.8) = 10
    // Step 3: condition -2: → trunc(0.7 * 10) = 7
    // Step 4: floor: 7 ≥ 0, no change
    expect(effectiveStrength(20, "c", "d", "greedySurfer", -2)).toBe(7);
  });

  it("floors negative results at zero", () => {
    // Wrong forward position gives −1; if base is 0, result goes negative
    // Step 1: position: LW in C slot → 0 - 1 = -1
    // Step 2: specialty: none → -1
    // Step 3: condition: 0 → -1
    // Step 4: floor → 0
    expect(effectiveStrength(0, "lw", "c", "none", 0)).toBe(0);
  });

  it("null specialty is fine", () => {
    expect(effectiveStrength(10, "rw", "rw", null, 0)).toBe(10);
  });

  it("pkf slot: any forward at full strength", () => {
    expect(effectiveStrength(10, "lw", "pkf", null, 0)).toBe(10);
    expect(effectiveStrength(10, "c", "pkf", null, 0)).toBe(10);
    expect(effectiveStrength(10, "rw", "pkf", null, 0)).toBe(10);
  });

  it("pkf slot: defenseman gets position penalty", () => {
    // trunc(0.7 * 10) = 7
    expect(effectiveStrength(10, "d", "pkf", null, 0)).toBe(7);
  });
});
