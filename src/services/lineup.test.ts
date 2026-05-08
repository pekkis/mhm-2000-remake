import {
  applyConditionPenalty,
  applyPositionPenalty,
  applySpecialtyPenalty,
  autoLineup,
  effectiveStrength,
  floorAtZero,
  isAvailable,
  performanceModifier
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

// ---------------------------------------------------------------------------
// performanceModifier
// ---------------------------------------------------------------------------

describe("performanceModifier", () => {
  it("zero when no effects", () => {
    expect(performanceModifier(createPlayer())).toBe(0);
  });

  it("sums skill effects", () => {
    expect(
      performanceModifier(
        createPlayer({
          effects: [
            { type: "skill", amount: 2, duration: 5 },
            { type: "skill", amount: -1, duration: 3 }
          ]
        })
      )
    ).toBe(1);
  });

  it("ignores non-skill effects", () => {
    expect(
      performanceModifier(
        createPlayer({
          effects: [
            { type: "injury", duration: 3 },
            { type: "skill", amount: 2, duration: 5 }
          ]
        })
      )
    ).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// isAvailable
// ---------------------------------------------------------------------------

describe("isAvailable", () => {
  it("healthy player with non-negative condition", () => {
    expect(isAvailable(createPlayer({ condition: 0 }))).toBe(true);
    expect(isAvailable(createPlayer({ condition: 5 }))).toBe(true);
  });

  it("negative condition → unavailable", () => {
    expect(isAvailable(createPlayer({ condition: -1 }))).toBe(false);
  });

  it("injured → unavailable", () => {
    expect(
      isAvailable(createPlayer({ effects: [{ type: "injury", duration: 3 }] }))
    ).toBe(false);
  });

  it("suspended → unavailable", () => {
    expect(
      isAvailable(
        createPlayer({ effects: [{ type: "suspension", duration: 2 }] })
      )
    ).toBe(false);
  });

  it("on strike → unavailable", () => {
    expect(
      isAvailable(createPlayer({ effects: [{ type: "strike" }] }))
    ).toBe(false);
  });

  it("national team absence → unavailable", () => {
    expect(
      isAvailable(
        createPlayer({ effects: [{ type: "nationals", duration: 1 }] })
      )
    ).toBe(false);
  });

  it("skill modifier does not block availability", () => {
    expect(
      isAvailable(
        createPlayer({ effects: [{ type: "skill", amount: -2, duration: 3 }] })
      )
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// autoLineup
// ---------------------------------------------------------------------------

/**
 * Build a minimal 25-player roster: 2G + 6D + 4LW + 4C + 4RW + extras.
 * Skill descends with index so sorting is predictable.
 */
const buildRoster = (): HiredPlayer[] => {
  let id = 0;
  const p = (
    position: HiredPlayer["position"],
    skill: number,
    extra: Partial<HiredPlayer> = {}
  ): HiredPlayer =>
    createPlayer({
      id: `p${++id}`,
      position,
      skill,
      ...extra
    });

  return [
    // Goalies (2)
    p("g", 15),
    p("g", 12),
    // Defensemen (7) — enough for 3 pairs + 1 spare
    p("d", 14),
    p("d", 13),
    p("d", 12),
    p("d", 11),
    p("d", 10),
    p("d", 9),
    p("d", 8),
    // Left wings (5)
    p("lw", 16),
    p("lw", 14),
    p("lw", 12),
    p("lw", 10),
    p("lw", 8),
    // Centers (5)
    p("c", 15),
    p("c", 13),
    p("c", 11),
    p("c", 9),
    p("c", 7),
    // Right wings (4)
    p("rw", 14),
    p("rw", 12),
    p("rw", 10),
    p("rw", 8)
  ];
};

describe("autoLineup", () => {
  it("assigns best goalie", () => {
    const roster = buildRoster();
    const lineup = autoLineup(roster);
    // p1 is best goalie (skill 15)
    expect(lineup.g).toBe("p1");
  });

  it("fills 3 defensive pairings sorted by skill", () => {
    const roster = buildRoster();
    const lineup = autoLineup(roster);
    // D: p3(14) p4(13) p5(12) p6(11) p7(10) p8(9) — 6 needed
    expect(lineup.defensivePairings).toEqual([
      { ld: "p3", rd: "p4" },
      { ld: "p5", rd: "p6" },
      { ld: "p7", rd: "p8" }
    ]);
  });

  it("fills forward lines 1-3 with LW/C/RW", () => {
    const roster = buildRoster();
    const lineup = autoLineup(roster);
    expect(lineup.forwardLines[0]).toEqual({
      lw: "p10",
      c: "p15",
      rw: "p20"
    });
    expect(lineup.forwardLines[1]).toEqual({
      lw: "p11",
      c: "p16",
      rw: "p21"
    });
    expect(lineup.forwardLines[2]).toEqual({
      lw: "p12",
      c: "p17",
      rw: "p22"
    });
  });

  it("line 4 has LW + C but no RW", () => {
    const roster = buildRoster();
    const lineup = autoLineup(roster);
    expect(lineup.forwardLines[3]).toEqual({
      lw: "p13",
      c: "p18"
    });
  });

  it("PP team uses powerplayMod-based sort", () => {
    const roster = buildRoster();
    // Give a lower-skill player a huge PP mod so they jump to PP #1
    roster[4] = createPlayer({
      id: "p5",
      position: "d",
      skill: 12,
      powerplayMod: 3
    }); // effective PP = 15
    roster[2] = createPlayer({
      id: "p3",
      position: "d",
      skill: 14,
      powerplayMod: -2
    }); // effective PP = 12

    const lineup = autoLineup(roster);
    // PP D sort: p5(15) > p4(13) > p3(12) > p6(11)
    expect(lineup.powerplayTeam.ld).toBe("p5");
    expect(lineup.powerplayTeam.rd).toBe("p4");
  });

  it("PK team uses penaltyKillMod-based sort", () => {
    const roster = buildRoster();
    roster[5] = createPlayer({
      id: "p6",
      position: "d",
      skill: 11,
      penaltyKillMod: 3
    }); // effective PK = 14

    const lineup = autoLineup(roster);
    // PK D sort: p6(14) > p3(14) → tiebreak by age (both 25 → stable)
    // p6 at index 5 vs p3 at index 2. Both skill=14+pkmod. p6 has pkmod=3 → 14, p3 has pkmod=0 → 14.
    // Tiebreak: same age, stable sort preserves array order → p3 first
    expect(lineup.penaltyKillTeam.ld).toBe("p3");
    expect(lineup.penaltyKillTeam.rd).toBe("p6");
  });

  it("PK forwards: best PK LW as f1, best PK C as f2", () => {
    const roster = buildRoster();
    const lineup = autoLineup(roster);
    // Best PK LW = p10 (skill 16), best PK C = p15 (skill 15)
    expect(lineup.penaltyKillTeam.f1).toBe("p10");
    expect(lineup.penaltyKillTeam.f2).toBe("p15");
  });

  it("enforcer sorts to top in regular pool", () => {
    const roster = buildRoster();
    // Make a low-skill defenseman an enforcer
    roster[6] = createPlayer({
      id: "p7",
      position: "d",
      skill: 10,
      specialty: "enforcer"
    });

    const lineup = autoLineup(roster);
    // Enforcer gets sort value 99, so p7 is now first D
    expect(lineup.defensivePairings[0].ld).toBe("p7");
    // But PP pool has no enforcer boost → p7 stays in normal position
    expect(lineup.powerplayTeam.ld).not.toBe("p7");
  });

  it("tiebreak: younger player wins", () => {
    const roster = buildRoster();
    // Two goalies with same skill, different ages
    roster[0] = createPlayer({ id: "p1", position: "g", skill: 15, age: 30 });
    roster[1] = createPlayer({ id: "p2", position: "g", skill: 15, age: 22 });

    const lineup = autoLineup(roster);
    expect(lineup.g).toBe("p2");
  });

  it("gameday mode: skips injured players", () => {
    const roster = buildRoster();
    // Injure the best goalie
    roster[0] = createPlayer({
      id: "p1",
      position: "g",
      skill: 15,
      effects: [{ type: "injury", duration: 5 }]
    });

    const lineup = autoLineup(roster, "gameday");
    expect(lineup.g).toBe("p2"); // fallback to 2nd goalie
  });

  it("gameday mode: skips players with negative condition", () => {
    const roster = buildRoster();
    roster[0] = createPlayer({
      id: "p1",
      position: "g",
      skill: 15,
      condition: -1
    });

    const lineup = autoLineup(roster, "gameday");
    expect(lineup.g).toBe("p2");
  });

  it("potential mode: includes injured and overtired players", () => {
    const roster = buildRoster();
    roster[0] = createPlayer({
      id: "p1",
      position: "g",
      skill: 15,
      effects: [{ type: "injury", duration: 5 }],
      condition: -3
    });

    const lineup = autoLineup(roster, "potential");
    expect(lineup.g).toBe("p1"); // still the best
  });

  it("handles sparse roster (not enough players)", () => {
    const roster = [
      createPlayer({ id: "g1", position: "g", skill: 10 }),
      createPlayer({ id: "d1", position: "d", skill: 10 }),
      createPlayer({ id: "c1", position: "c", skill: 10 })
    ];

    const lineup = autoLineup(roster);
    expect(lineup.g).toBe("g1");
    expect(lineup.defensivePairings[0].ld).toBe("d1");
    expect(lineup.defensivePairings[0].rd).toBeUndefined();
    expect(lineup.forwardLines[0].c).toBe("c1");
    expect(lineup.forwardLines[0].lw).toBeUndefined();
    expect(lineup.forwardLines[0].rw).toBeUndefined();
  });

  it("skill modifier affects sort order", () => {
    const roster = buildRoster();
    // Give the 2nd goalie a big skill boost
    roster[1] = createPlayer({
      id: "p2",
      position: "g",
      skill: 12,
      effects: [{ type: "skill", amount: 5, duration: 10 }]
    }); // effective = 17

    const lineup = autoLineup(roster);
    expect(lineup.g).toBe("p2"); // 12+5=17 > 15
  });

  it("players can appear in both regular and special teams", () => {
    const roster = buildRoster();
    const lineup = autoLineup(roster);
    // Best D should be on pair 1 AND PP
    expect(lineup.defensivePairings[0].ld).toBe("p3");
    expect(lineup.powerplayTeam.ld).toBe("p3");
  });
});
