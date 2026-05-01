import { describe, expect, it } from "vitest";

import { teams } from "@/data/mhm2000/teams";
import {
  arenaFreePoints,
  buildRankMultiplier,
  canAffordProject,
  constructionRounds,
  roundPayment,
  tickConstruction,
  downPayment,
  newArenaCost,
  qbCint,
  renovationCost,
  renovationMaxValuePoints,
  seatAllocationPoints
} from "./arena";

describe("qbCint (banker's rounding)", () => {
  it("rounds non-half values normally", () => {
    expect(qbCint(0.4)).toBe(0);
    expect(qbCint(0.6)).toBe(1);
    expect(qbCint(2.4)).toBe(2);
    expect(qbCint(2.6)).toBe(3);
  });

  it("rounds halves to the nearest even integer (positive)", () => {
    // Diverges from Math.round, which rounds half-up for positives.
    expect(qbCint(0.5)).toBe(0);
    expect(qbCint(1.5)).toBe(2);
    expect(qbCint(2.5)).toBe(2);
    expect(qbCint(3.5)).toBe(4);
    expect(qbCint(4.5)).toBe(4);
    expect(qbCint(1135.5)).toBe(1136);
    expect(qbCint(1136.5)).toBe(1136);
  });

  it("rounds halves to the nearest even integer (negative)", () => {
    expect(qbCint(-0.5)).toBe(0);
    expect(qbCint(-1.5)).toBe(-2);
    expect(qbCint(-2.5)).toBe(-2);
  });
});

describe("seatAllocationPoints", () => {
  it("matches every base team's stored ppiste", () => {
    for (const team of teams) {
      const points = seatAllocationPoints(
        team.arena.level,
        team.arena.standingCount,
        team.arena.seatedCount,
        team.arena.hasBoxes
      );
      expect(points).toBe(team.arena.valuePoints);
    }
  });

  it("ignores boxes at levels where they're unavailable", () => {
    expect(seatAllocationPoints(3, 10, 10, true)).toBe(seatAllocationPoints(3, 10, 10, false));
  });
});

describe("buildRankMultiplier", () => {
  it("rank 1 = 0.95, rank 2 = 1.00, rank 3 = 1.05", () => {
    expect(buildRankMultiplier(1)).toBeCloseTo(0.95);
    expect(buildRankMultiplier(2)).toBeCloseTo(1.0);
    expect(buildRankMultiplier(3)).toBeCloseTo(1.05);
  });
});

describe("renovationCost", () => {
  it("base case: rank-2 builder, no growth → 1 000 € per existing point", () => {
    const arena = teams[0]!.arena; // TPS, 1032 ppiste
    expect(renovationCost(arena, arena.valuePoints, 2)).toBe(1032 * 1000);
  });

  it("scales added points by 20 000 €", () => {
    const arena = teams[0]!.arena;
    const expected = 100 * 20_000 + (arena.valuePoints + 100) * 1_000;
    expect(renovationCost(arena, arena.valuePoints + 100, 2)).toBe(expected);
  });

  it("applies builder multiplier with banker's rounding", () => {
    const arena = teams[0]!.arena;
    const r1 = renovationCost(arena, arena.valuePoints, 1);
    const r3 = renovationCost(arena, arena.valuePoints, 3);
    expect(r1).toBe(qbCint(arena.valuePoints * 1_000 * 0.95));
    expect(r3).toBe(qbCint(arena.valuePoints * 1_000 * 1.05));
  });
});

describe("renovationMaxValuePoints", () => {
  it("clean 10% growth on round value points", () => {
    expect(renovationMaxValuePoints({ ...teams[0]!.arena, valuePoints: 1000 })).toBe(1100);
    expect(renovationMaxValuePoints({ ...teams[0]!.arena, valuePoints: 1032 })).toBe(1135);
  });

  it("uses banker's rounding on .5 boundaries (diverges from Math.round)", () => {
    // 1.1 * 15 = 16.5 → CINT picks 16 (even); Math.round would give 17.
    expect(renovationMaxValuePoints({ ...teams[0]!.arena, valuePoints: 15 })).toBe(16);
    expect(renovationMaxValuePoints({ ...teams[0]!.arena, valuePoints: 25 })).toBe(28);
    expect(renovationMaxValuePoints({ ...teams[0]!.arena, valuePoints: 35 })).toBe(38);
    // 1.1 * 45 = 49.5 → CINT picks 50 (even).
    expect(renovationMaxValuePoints({ ...teams[0]!.arena, valuePoints: 45 })).toBe(50);
  });
});

describe("newArenaCost", () => {
  it("baseline = points × 10 000 with both ranks at 2", () => {
    expect(newArenaCost(500, 2, 2)).toBe(5_000_000);
  });

  it("rank 3 architect + rank 1 builder applies multipliers sequentially with rounds between", () => {
    // Verbatim reproduction of QB sequence:
    //   rahna = 500 * 10000              = 5_000_000
    //   rahna = 5_000_000 * 1.05         = 5_250_000  (no fractional → no round needed)
    //   rahna = 5_250_000 * 0.95         = 4_987_500  (exact)
    expect(newArenaCost(500, 3, 1)).toBe(4_987_500);
  });
});

describe("downPayment / canAffordProject", () => {
  it("downPayment = 20% of cost", () => {
    expect(downPayment(1_000_000)).toBe(200_000);
  });

  it("canAffordProject mirrors QB's `rahna * .2 > potti` (raw float compare)", () => {
    expect(canAffordProject(1_000_000, 200_000)).toBe(true);
    expect(canAffordProject(1_000_000, 199_999)).toBe(false);
  });
});

describe("constructionRounds / roundPayment", () => {
  it("renovate divisor 30/25/20 matches uhatapa - 2000 (ILES5.BAS:539)", () => {
    expect(constructionRounds("renovate", 1)).toBe(30);
    expect(constructionRounds("renovate", 2)).toBe(25);
    expect(constructionRounds("renovate", 3)).toBe(20);
  });

  it("build divisor 90/80/70 matches uhatapa - 1000 (ILEX5.BAS:5478)", () => {
    expect(constructionRounds("build", 1)).toBe(90);
    expect(constructionRounds("build", 2)).toBe(80);
    expect(constructionRounds("build", 3)).toBe(70);
  });

  it("computes per-round payment via banker's rounding", () => {
    expect(roundPayment(3000, "renovate", 2)).toBe(120); // 3000 / 25 = 120 (exact)
    // 75 / 30 = 2.5 → CINT picks 2 (even); Math.round would give 3.
    expect(roundPayment(75, "renovate", 1)).toBe(2);
  });
});

describe("tickConstruction (vetää lonkkaa, ILEX5.BAS:5485-5493)", () => {
  it("rank 1 (työllistetyt): slack on d≤2, progress on d≥2 → only d=1 stalls", () => {
    expect(tickConstruction(1, 1)).toEqual({ slacked: true, progressed: false });
    expect(tickConstruction(1, 2)).toEqual({ slacked: true, progressed: true });
    expect(tickConstruction(1, 3)).toEqual({ slacked: false, progressed: true });
    expect(tickConstruction(1, 100)).toEqual({ slacked: false, progressed: true });
  });

  it("rank 2 (vakituiset): slacks at d=1 but always progresses", () => {
    expect(tickConstruction(2, 1)).toEqual({ slacked: true, progressed: true });
    expect(tickConstruction(2, 2)).toEqual({ slacked: false, progressed: true });
    expect(tickConstruction(2, 100)).toEqual({ slacked: false, progressed: true });
  });

  it("rank 3 (Ranen): never slacks, never stalls", () => {
    for (const roll of [1, 2, 3, 50, 100]) {
      expect(tickConstruction(3, roll)).toEqual({ slacked: false, progressed: true });
    }
  });
});

describe("arenaFreePoints", () => {
  it("zero for every base team", () => {
    for (const team of teams) {
      expect(arenaFreePoints(team.arena)).toBe(0);
    }
  });

  it("positive when the envelope exceeds the allocation", () => {
    const arena = { ...teams[0]!.arena, valuePoints: teams[0]!.arena.valuePoints + 50 };
    expect(arenaFreePoints(arena)).toBe(50);
  });
});
