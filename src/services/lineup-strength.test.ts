/**
 * Tests for lineup-based strength calculation (voimamaar) and
 * PP/PK special-team strength (yw/aw).
 *
 * All expected values are hand-computed by walking the QB `zzra`
 * pipeline (ILEX5.BAS:8544-8570) step-by-step, then summing per
 * the voimamaar loop logic (ILEX5.BAS:8429-8540).
 *
 * QB pipeline per slot:
 *   temp% = psk + plus + erik(3)
 *   IF gnome=1: temp% += yvo               [PP context]
 *   IF gnome=2: temp% += avo               [PK context]
 *   position penalty (SELECT CASE xxx)
 *   IF spe=8: temp% = CINT(.7 * temp%)     [greedySurfer]
 *   condition penalty (SELECT CASE kun)
 *   IF temp% < 0: temp% = 0                [we floor at 1 — gameplay deviation]
 */
import {
  calculateLineupStrength,
  calculatePenaltyKillStrength,
  calculatePowerPlayStrength
} from "@/services/lineup";
import type { Lineup } from "@/state/lineup";
import {
  createPlayer as player,
  rosterMap,
  emptyLineup
} from "@/__tests__/factories";
import { describe, expect, it } from "vitest";

// ---------------------------------------------------------------------------
// calculateLineupStrength
// ---------------------------------------------------------------------------

describe("calculateLineupStrength", () => {
  it("empty lineup → all zeros (but goalie floors at 0, not 1)", () => {
    const result = calculateLineupStrength(emptyLineup, {});
    expect(result).toEqual({ goalie: 0, defence: 0, attack: 0 });
  });

  it("goalie-only lineup", () => {
    const g = player({ id: "g1", position: "g", skill: 12 });
    const lineup: Lineup = {
      ...emptyLineup,
      g: "g1"
    };
    // QB: temp% = 12 + 0 = 12, pos=g → no penalty, spe≠8, kun=0 → 12
    const result = calculateLineupStrength(lineup, rosterMap(g));
    expect(result.goalie).toBe(12);
    expect(result.defence).toBe(0);
    expect(result.attack).toBe(0);
  });

  it("single complete D pair contributes to defence", () => {
    const ld = player({ id: "ld1", position: "d", skill: 14 });
    const rd = player({ id: "rd1", position: "d", skill: 11 });
    const lineup: Lineup = {
      ...emptyLineup,
      defensivePairings: [
        { ld: "ld1", rd: "rd1" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };
    // ld: 14, D in D slot → no penalty → 14
    // rd: 11, D in D slot → no penalty → 11
    const result = calculateLineupStrength(lineup, rosterMap(ld, rd));
    expect(result.defence).toBe(25);
  });

  it("incomplete D pair (one missing) contributes 0", () => {
    const ld = player({ id: "ld1", position: "d", skill: 14 });
    const lineup: Lineup = {
      ...emptyLineup,
      defensivePairings: [
        { ld: "ld1", rd: null },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };
    const result = calculateLineupStrength(lineup, rosterMap(ld));
    expect(result.defence).toBe(0);
  });

  it("single complete forward line contributes to attack", () => {
    const lw = player({ id: "lw1", position: "lw", skill: 15 });
    const c = player({ id: "c1", position: "c", skill: 13 });
    const rw = player({ id: "rw1", position: "rw", skill: 11 });
    const lineup: Lineup = {
      ...emptyLineup,
      forwardLines: [
        { lw: "lw1", c: "c1", rw: "rw1" },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ]
    };
    // All at correct positions → no penalties → 15 + 13 + 11 = 39
    const result = calculateLineupStrength(lineup, rosterMap(lw, c, rw));
    expect(result.attack).toBe(39);
  });

  it("incomplete forward line (one missing) contributes 0", () => {
    const lw = player({ id: "lw1", position: "lw", skill: 15 });
    const c = player({ id: "c1", position: "c", skill: 13 });
    const lineup: Lineup = {
      ...emptyLineup,
      forwardLines: [
        { lw: "lw1", c: "c1", rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ]
    };
    const result = calculateLineupStrength(lineup, rosterMap(lw, c));
    expect(result.attack).toBe(0);
  });

  it("line 4 contributes to attack (all 3 forward slots, no D pair)", () => {
    const lw4 = player({ id: "lw4", position: "lw", skill: 8 });
    const c4 = player({ id: "c4", position: "c", skill: 7 });
    const rw4 = player({ id: "rw4", position: "rw", skill: 6 });
    const lineup: Lineup = {
      ...emptyLineup,
      forwardLines: [
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: "lw4", c: "c4", rw: "rw4" }
      ]
    };
    // 8 + 7 + 6 = 21
    const result = calculateLineupStrength(lineup, rosterMap(lw4, c4, rw4));
    expect(result.attack).toBe(21);
  });

  it("position penalty: forward in D slot → ×0.7 (FIX)", () => {
    // Put a center (ppp=4) in LD slot (xxx=2)
    const c = player({ id: "c1", position: "c", skill: 15 });
    const d = player({ id: "d1", position: "d", skill: 10 });
    const lineup: Lineup = {
      ...emptyLineup,
      defensivePairings: [
        { ld: "c1", rd: "d1" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };
    // c1: FIX(0.7 * 15) = FIX(10.5) = 10
    // d1: D in D → 10
    const result = calculateLineupStrength(lineup, rosterMap(c, d));
    expect(result.defence).toBe(20);
  });

  it("position penalty: D in forward slot → ×0.7 (FIX)", () => {
    // Put a defenseman in LW slot
    const d = player({ id: "d1", position: "d", skill: 15 });
    const c = player({ id: "c1", position: "c", skill: 10 });
    const rw = player({ id: "rw1", position: "rw", skill: 10 });
    const lineup: Lineup = {
      ...emptyLineup,
      forwardLines: [
        { lw: "d1", c: "c1", rw: "rw1" },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ]
    };
    // d1 in LW: FIX(0.7 * 15) = 10
    // c1: 10, rw1: 10
    const result = calculateLineupStrength(lineup, rosterMap(d, c, rw));
    expect(result.attack).toBe(30);
  });

  it("position penalty: wrong forward type → −1", () => {
    // Put an RW in LW slot
    const rw = player({ id: "rw1", position: "rw", skill: 12 });
    const c = player({ id: "c1", position: "c", skill: 10 });
    const lw = player({ id: "lw1", position: "lw", skill: 10 });
    const lineup: Lineup = {
      ...emptyLineup,
      forwardLines: [
        { lw: "rw1", c: "c1", rw: "lw1" },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ]
    };
    // rw1 in LW: 12 - 1 = 11
    // c1: 10
    // lw1 in RW: 10 - 1 = 9
    const result = calculateLineupStrength(lineup, rosterMap(rw, c, lw));
    expect(result.attack).toBe(30);
  });

  it("specialty penalty: greedySurfer (spe=8) → CINT(0.7×temp)", () => {
    const surfer = player({
      id: "s1",
      position: "d",
      skill: 15,
      specialty: "greedySurfer"
    });
    const d2 = player({ id: "d2", position: "d", skill: 10 });
    const lineup: Lineup = {
      ...emptyLineup,
      defensivePairings: [
        { ld: "s1", rd: "d2" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };
    // s1: base 15, pos=D in D → 15, spe=greedySurfer → round(0.7*15) = round(10.5) = 11
    // d2: 10
    const result = calculateLineupStrength(lineup, rosterMap(surfer, d2));
    expect(result.defence).toBe(21);
  });

  it("condition penalty: −1 → ×0.9, −2 → ×0.7", () => {
    const hurt = player({ id: "d1", position: "d", skill: 10, condition: -1 });
    const worse = player({
      id: "d2",
      position: "d",
      skill: 10,
      condition: -2
    });
    const lineup: Lineup = {
      ...emptyLineup,
      defensivePairings: [
        { ld: "d1", rd: "d2" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };
    // d1: 10, pos ok → 10, spe ok → 10, kun=-1 → FIX(0.9*10) = 9
    // d2: 10, pos ok → 10, spe ok → 10, kun=-2 → FIX(0.7*10) = 7
    const result = calculateLineupStrength(lineup, rosterMap(hurt, worse));
    expect(result.defence).toBe(16);
  });

  it("skill effects (plus) are included in base value", () => {
    const boosted = player({
      id: "d1",
      position: "d",
      skill: 10,
      effects: [{ type: "skill", amount: 3, duration: 5 }]
    });
    const normal = player({ id: "d2", position: "d", skill: 10 });
    const lineup: Lineup = {
      ...emptyLineup,
      defensivePairings: [
        { ld: "d1", rd: "d2" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };
    // d1: psk(10) + plus(3) = 13
    // d2: psk(10) + plus(0) = 10
    const result = calculateLineupStrength(lineup, rosterMap(boosted, normal));
    expect(result.defence).toBe(23);
  });

  it("full 3-line + 3-pair + goalie lineup computes all three stats", () => {
    const g = player({ id: "g", position: "g", skill: 14 });
    const ld1 = player({ id: "ld1", position: "d", skill: 12 });
    const rd1 = player({ id: "rd1", position: "d", skill: 11 });
    const ld2 = player({ id: "ld2", position: "d", skill: 10 });
    const rd2 = player({ id: "rd2", position: "d", skill: 9 });
    const ld3 = player({ id: "ld3", position: "d", skill: 8 });
    const rd3 = player({ id: "rd3", position: "d", skill: 7 });
    const lw1 = player({ id: "lw1", position: "lw", skill: 15 });
    const c1 = player({ id: "c1", position: "c", skill: 14 });
    const rw1 = player({ id: "rw1", position: "rw", skill: 13 });
    const lw2 = player({ id: "lw2", position: "lw", skill: 12 });
    const c2 = player({ id: "c2", position: "c", skill: 11 });
    const rw2 = player({ id: "rw2", position: "rw", skill: 10 });
    const lw3 = player({ id: "lw3", position: "lw", skill: 9 });
    const c3 = player({ id: "c3", position: "c", skill: 8 });
    const rw3 = player({ id: "rw3", position: "rw", skill: 7 });

    const lineup: Lineup = {
      ...emptyLineup,
      g: "g",
      defensivePairings: [
        { ld: "ld1", rd: "rd1" },
        { ld: "ld2", rd: "rd2" },
        { ld: "ld3", rd: "rd3" }
      ],
      forwardLines: [
        { lw: "lw1", c: "c1", rw: "rw1" },
        { lw: "lw2", c: "c2", rw: "rw2" },
        { lw: "lw3", c: "c3", rw: "rw3" },
        { lw: null, c: null, rw: null }
      ]
    };

    const roster = rosterMap(
      g,
      ld1,
      rd1,
      ld2,
      rd2,
      ld3,
      rd3,
      lw1,
      c1,
      rw1,
      lw2,
      c2,
      rw2,
      lw3,
      c3,
      rw3
    );
    const result = calculateLineupStrength(lineup, roster);

    expect(result.goalie).toBe(14);
    // D: 12+11+10+9+8+7 = 57
    expect(result.defence).toBe(57);
    // A: (15+14+13) + (12+11+10) + (9+8+7) = 42+33+24 = 99
    expect(result.attack).toBe(99);
  });

  it("combined penalties stack correctly: D in LW slot + greedySurfer + condition -1", () => {
    // QB zzra order: position → specialty → condition → floor
    const misfit = player({
      id: "d1",
      position: "d",
      skill: 20,
      specialty: "greedySurfer",
      condition: -1
    });
    const c = player({ id: "c1", position: "c", skill: 10 });
    const rw = player({ id: "rw1", position: "rw", skill: 10 });
    const lineup: Lineup = {
      ...emptyLineup,
      forwardLines: [
        { lw: "d1", c: "c1", rw: "rw1" },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ]
    };

    // Step 1: D in LW (xxx=3): FIX(0.7 * 20) = 14
    // Step 2: greedySurfer: round(0.7 * 14) = round(9.8) = 10
    // Step 3: condition -1: FIX(0.9 * 10) = 9
    // c1: 10, rw1: 10
    const result = calculateLineupStrength(lineup, rosterMap(misfit, c, rw));
    expect(result.attack).toBe(29);
  });
});

// ---------------------------------------------------------------------------
// calculatePowerPlayStrength
// ---------------------------------------------------------------------------

describe("calculatePowerPlayStrength", () => {
  it("empty PP unit + empty line 1 → 0", () => {
    expect(calculatePowerPlayStrength(emptyLineup, {})).toBe(0);
  });

  it("fully staffed PP unit: sums all 5 slots with yvo bonuses", () => {
    const ppLd = player({
      id: "ppLd",
      position: "d",
      skill: 12,
      powerplayMod: 2
    });
    const ppRd = player({
      id: "ppRd",
      position: "d",
      skill: 10,
      powerplayMod: 1
    });
    const ppLw = player({
      id: "ppLw",
      position: "lw",
      skill: 14,
      powerplayMod: 3
    });
    const ppC = player({
      id: "ppC",
      position: "c",
      skill: 13,
      powerplayMod: -1
    });
    const ppRw = player({
      id: "ppRw",
      position: "rw",
      skill: 11,
      powerplayMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      powerplayTeam: {
        ld: "ppLd",
        rd: "ppRd",
        lw: "ppLw",
        c: "ppC",
        rw: "ppRw"
      }
    };

    const roster = rosterMap(ppLd, ppRd, ppLw, ppC, ppRw);

    // ppLd: base = 12 + 2(yvo) = 14, D in D → 14
    // ppRd: base = 10 + 1 = 11, D in D → 11
    // ppLw: base = 14 + 3 = 17, LW in LW → 17
    // ppC:  base = 13 + (-1) = 12, C in C → 12
    // ppRw: base = 11 + 0 = 11, RW in RW → 11
    // Total: 14 + 11 + 17 + 12 + 11 = 65
    expect(calculatePowerPlayStrength(lineup, roster)).toBe(65);
  });

  it("PP with position penalties: forward in D slot", () => {
    const ppLd = player({
      id: "ppLd",
      position: "c",
      skill: 15,
      powerplayMod: 1
    });
    const ppRd = player({
      id: "ppRd",
      position: "d",
      skill: 10,
      powerplayMod: 0
    });
    const ppLw = player({
      id: "ppLw",
      position: "lw",
      skill: 10,
      powerplayMod: 0
    });
    const ppC = player({
      id: "ppC",
      position: "c",
      skill: 10,
      powerplayMod: 0
    });
    const ppRw = player({
      id: "ppRw",
      position: "rw",
      skill: 10,
      powerplayMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      powerplayTeam: {
        ld: "ppLd",
        rd: "ppRd",
        lw: "ppLw",
        c: "ppC",
        rw: "ppRw"
      }
    };

    const roster = rosterMap(ppLd, ppRd, ppLw, ppC, ppRw);

    // ppLd: base = 15 + 1 = 16, C(forward) in D slot → FIX(0.7 * 16) = FIX(11.2) = 11
    // ppRd: 10, ppLw: 10, ppC: 10, ppRw: 10
    // Total: 11 + 10 + 10 + 10 + 10 = 51
    expect(calculatePowerPlayStrength(lineup, roster)).toBe(51);
  });

  it("PP with greedySurfer and condition penalties", () => {
    const ppLd = player({
      id: "ppLd",
      position: "d",
      skill: 14,
      powerplayMod: 0,
      specialty: "greedySurfer",
      condition: -2
    });
    const ppRd = player({
      id: "ppRd",
      position: "d",
      skill: 10,
      powerplayMod: 0
    });
    const ppLw = player({
      id: "ppLw",
      position: "lw",
      skill: 10,
      powerplayMod: 0
    });
    const ppC = player({
      id: "ppC",
      position: "c",
      skill: 10,
      powerplayMod: 0
    });
    const ppRw = player({
      id: "ppRw",
      position: "rw",
      skill: 10,
      powerplayMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      powerplayTeam: {
        ld: "ppLd",
        rd: "ppRd",
        lw: "ppLw",
        c: "ppC",
        rw: "ppRw"
      }
    };

    const roster = rosterMap(ppLd, ppRd, ppLw, ppC, ppRw);

    // ppLd: base = 14+0 = 14, D in D → 14,
    //   greedySurfer → round(0.7*14) = round(9.8) = 10,
    //   condition -2 → FIX(0.7*10) = 7
    // Others: 10 each
    // Total: 7 + 10 + 10 + 10 + 10 = 47
    expect(calculatePowerPlayStrength(lineup, roster)).toBe(47);
  });

  it("incomplete PP falls back to line 1 + D pair 1", () => {
    // PP has only 4 of 5 slots filled → incomplete, falls back to line 1
    const ld = player({
      id: "ld1",
      position: "d",
      skill: 12,
      powerplayMod: 1
    });
    const rd = player({
      id: "rd1",
      position: "d",
      skill: 11,
      powerplayMod: 0
    });
    const lw = player({
      id: "lw1",
      position: "lw",
      skill: 15,
      powerplayMod: 2
    });
    const c = player({
      id: "c1",
      position: "c",
      skill: 13,
      powerplayMod: -1
    });
    const rw = player({
      id: "rw1",
      position: "rw",
      skill: 11,
      powerplayMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      // PP missing RW → incomplete
      powerplayTeam: {
        ld: "ld1",
        rd: "rd1",
        lw: "lw1",
        c: "c1",
        rw: null
      },
      // Line 1 + D pair 1 are the fallback
      forwardLines: [
        { lw: "lw1", c: "c1", rw: "rw1" },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ],
      defensivePairings: [
        { ld: "ld1", rd: "rd1" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };

    const roster = rosterMap(ld, rd, lw, c, rw);

    // Fallback uses line 1 players with yvo bonuses:
    // ld1: 12 + 1 = 13, D in D → 13
    // rd1: 11 + 0 = 11, D in D → 11
    // lw1: 15 + 2 = 17, LW in LW → 17
    // c1:  13 + (-1) = 12, C in C → 12
    // rw1: 11 + 0 = 11, RW in RW → 11
    // Total: 13 + 11 + 17 + 12 + 11 = 64
    expect(calculatePowerPlayStrength(lineup, roster)).toBe(64);
  });

  it("incomplete PP + incomplete line 1 → 0", () => {
    const ld = player({ id: "ld1", position: "d", skill: 12 });
    const rd = player({ id: "rd1", position: "d", skill: 11 });
    const lw = player({ id: "lw1", position: "lw", skill: 15 });

    const lineup: Lineup = {
      ...emptyLineup,
      // PP incomplete
      powerplayTeam: {
        ld: "ld1",
        rd: "rd1",
        lw: "lw1",
        c: null,
        rw: null
      },
      // Line 1 also incomplete (missing C and RW)
      forwardLines: [
        { lw: "lw1", c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ],
      defensivePairings: [
        { ld: "ld1", rd: "rd1" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };

    expect(calculatePowerPlayStrength(lineup, rosterMap(ld, rd, lw))).toBe(0);
  });

  it("negative yvo reduces base value", () => {
    const ppLd = player({
      id: "ppLd",
      position: "d",
      skill: 8,
      powerplayMod: -3
    });
    const ppRd = player({
      id: "ppRd",
      position: "d",
      skill: 10,
      powerplayMod: 0
    });
    const ppLw = player({
      id: "ppLw",
      position: "lw",
      skill: 10,
      powerplayMod: 0
    });
    const ppC = player({
      id: "ppC",
      position: "c",
      skill: 10,
      powerplayMod: 0
    });
    const ppRw = player({
      id: "ppRw",
      position: "rw",
      skill: 10,
      powerplayMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      powerplayTeam: {
        ld: "ppLd",
        rd: "ppRd",
        lw: "ppLw",
        c: "ppC",
        rw: "ppRw"
      }
    };

    // ppLd: base = 8 + (-3) = 5, D in D → 5
    // Others: 10 each → 40
    // Total: 5 + 40 = 45
    expect(
      calculatePowerPlayStrength(lineup, rosterMap(ppLd, ppRd, ppLw, ppC, ppRw))
    ).toBe(45);
  });

  it("yvo that drives base to 0 floors at MIN_EFFECTIVE_STRENGTH (1)", () => {
    const ppLd = player({
      id: "ppLd",
      position: "d",
      skill: 2,
      powerplayMod: -3
    });
    const ppRd = player({
      id: "ppRd",
      position: "d",
      skill: 10,
      powerplayMod: 0
    });
    const ppLw = player({
      id: "ppLw",
      position: "lw",
      skill: 10,
      powerplayMod: 0
    });
    const ppC = player({
      id: "ppC",
      position: "c",
      skill: 10,
      powerplayMod: 0
    });
    const ppRw = player({
      id: "ppRw",
      position: "rw",
      skill: 10,
      powerplayMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      powerplayTeam: {
        ld: "ppLd",
        rd: "ppRd",
        lw: "ppLw",
        c: "ppC",
        rw: "ppRw"
      }
    };

    // ppLd: base = 2 + (-3) = -1 → floor at 1
    // Others: 10 each → 40
    // Total: 1 + 40 = 41
    expect(
      calculatePowerPlayStrength(lineup, rosterMap(ppLd, ppRd, ppLw, ppC, ppRw))
    ).toBe(41);
  });
});

// ---------------------------------------------------------------------------
// calculatePenaltyKillStrength
// ---------------------------------------------------------------------------

describe("calculatePenaltyKillStrength", () => {
  it("empty PK unit + empty line 1 → 0", () => {
    expect(calculatePenaltyKillStrength(emptyLineup, {})).toBe(0);
  });

  it("fully staffed PK unit: sums 4 slots with avo bonuses", () => {
    const pkLd = player({
      id: "pkLd",
      position: "d",
      skill: 12,
      penaltyKillMod: 2
    });
    const pkRd = player({
      id: "pkRd",
      position: "d",
      skill: 10,
      penaltyKillMod: 1
    });
    const pkF1 = player({
      id: "pkF1",
      position: "lw",
      skill: 14,
      penaltyKillMod: 3
    });
    const pkF2 = player({
      id: "pkF2",
      position: "c",
      skill: 13,
      penaltyKillMod: -1
    });

    const lineup: Lineup = {
      ...emptyLineup,
      penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
    };

    const roster = rosterMap(pkLd, pkRd, pkF1, pkF2);

    // pkLd: 12 + 2 = 14, D in D → 14
    // pkRd: 10 + 1 = 11, D in D → 11
    // pkF1: 14 + 3 = 17, LW in pkf → 17 (any forward is full strength)
    // pkF2: 13 + (-1) = 12, C in pkf → 12
    // Total: 14 + 11 + 17 + 12 = 54
    expect(calculatePenaltyKillStrength(lineup, roster)).toBe(54);
  });

  it("PK with D in forward slot: xxx=6, D→×0.7", () => {
    const pkLd = player({
      id: "pkLd",
      position: "d",
      skill: 10,
      penaltyKillMod: 0
    });
    const pkRd = player({
      id: "pkRd",
      position: "d",
      skill: 10,
      penaltyKillMod: 0
    });
    const pkF1 = player({
      id: "pkF1",
      position: "d",
      skill: 15,
      penaltyKillMod: 1
    });
    const pkF2 = player({
      id: "pkF2",
      position: "c",
      skill: 10,
      penaltyKillMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
    };

    const roster = rosterMap(pkLd, pkRd, pkF1, pkF2);

    // pkF1: D in pkf slot → base = 15+1 = 16, FIX(0.7 * 16) = FIX(11.2) = 11
    // Others: 10, 10, 10
    // Total: 10 + 10 + 11 + 10 = 41
    expect(calculatePenaltyKillStrength(lineup, roster)).toBe(41);
  });

  it("incomplete PK falls back to line 1 (D pair 1 + LW + C)", () => {
    // PK has only 3 of 4 slots → incomplete
    const ld = player({
      id: "ld1",
      position: "d",
      skill: 12,
      penaltyKillMod: 1
    });
    const rd = player({
      id: "rd1",
      position: "d",
      skill: 11,
      penaltyKillMod: 0
    });
    const lw = player({
      id: "lw1",
      position: "lw",
      skill: 14,
      penaltyKillMod: 2
    });
    const c = player({
      id: "c1",
      position: "c",
      skill: 13,
      penaltyKillMod: -1
    });

    const lineup: Lineup = {
      ...emptyLineup,
      // PK missing f2 → incomplete
      penaltyKillTeam: { ld: "ld1", rd: "rd1", f1: "lw1", f2: null },
      forwardLines: [
        { lw: "lw1", c: "c1", rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ],
      defensivePairings: [
        { ld: "ld1", rd: "rd1" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };

    const roster = rosterMap(ld, rd, lw, c);

    // Fallback uses D pair 1 + line 1's LW(→f1) + C(→f2), with avo bonuses:
    // ld1: 12 + 1 = 13, D in D → 13
    // rd1: 11 + 0 = 11, D in D → 11
    // lw1: 14 + 2 = 16, LW in pkf → 16 (any forward full strength in pkf)
    // c1:  13 + (-1) = 12, C in pkf → 12
    // Total: 13 + 11 + 16 + 12 = 52
    expect(calculatePenaltyKillStrength(lineup, roster)).toBe(52);
  });

  it("incomplete PK + incomplete line 1 → 0", () => {
    const ld = player({ id: "ld1", position: "d", skill: 12 });
    const lw = player({ id: "lw1", position: "lw", skill: 14 });

    const lineup: Lineup = {
      ...emptyLineup,
      penaltyKillTeam: { ld: "ld1", rd: null, f1: "lw1", f2: null },
      forwardLines: [
        { lw: "lw1", c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null },
        { lw: null, c: null, rw: null }
      ],
      defensivePairings: [
        { ld: "ld1", rd: null },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };

    expect(calculatePenaltyKillStrength(lineup, rosterMap(ld, lw))).toBe(0);
  });

  it("PK with stacked penalties: greedySurfer + condition + position", () => {
    const pkLd = player({
      id: "pkLd",
      position: "c",
      skill: 20,
      penaltyKillMod: 0,
      specialty: "greedySurfer",
      condition: -1
    });
    const pkRd = player({
      id: "pkRd",
      position: "d",
      skill: 10,
      penaltyKillMod: 0
    });
    const pkF1 = player({
      id: "pkF1",
      position: "lw",
      skill: 10,
      penaltyKillMod: 0
    });
    const pkF2 = player({
      id: "pkF2",
      position: "rw",
      skill: 10,
      penaltyKillMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
    };

    const roster = rosterMap(pkLd, pkRd, pkF1, pkF2);

    // pkLd: C in D slot → base 20, FIX(0.7*20) = 14
    //   greedySurfer → round(0.7*14) = round(9.8) = 10
    //   condition -1 → FIX(0.9*10) = 9
    // pkRd: 10, pkF1: 10, pkF2: 10
    // Total: 9 + 10 + 10 + 10 = 39
    expect(calculatePenaltyKillStrength(lineup, roster)).toBe(39);
  });

  it("negative avo reduces base value", () => {
    const pkLd = player({
      id: "pkLd",
      position: "d",
      skill: 8,
      penaltyKillMod: -3
    });
    const pkRd = player({
      id: "pkRd",
      position: "d",
      skill: 10,
      penaltyKillMod: 0
    });
    const pkF1 = player({
      id: "pkF1",
      position: "lw",
      skill: 10,
      penaltyKillMod: 0
    });
    const pkF2 = player({
      id: "pkF2",
      position: "c",
      skill: 10,
      penaltyKillMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
    };

    // pkLd: base = 8 + (-3) = 5, D in D → 5
    // Others: 10, 10, 10 → 30
    // Total: 5 + 30 = 35
    expect(
      calculatePenaltyKillStrength(lineup, rosterMap(pkLd, pkRd, pkF1, pkF2))
    ).toBe(35);
  });
});

// ---------------------------------------------------------------------------
// Integration: verifying the full QB voimamaar pipeline hand-traced
// ---------------------------------------------------------------------------

describe("integration: full voimamaar parity with QB hand-trace", () => {
  /**
   * Simulate a realistic team with:
   * - Mixed-quality players
   * - Some out-of-position assignments
   * - Specialty penalties
   * - Condition penalties
   * - PP/PK with yvo/avo bonuses
   *
   * Each expected value is hand-computed by stepping through zzra
   * for every slot.
   */

  const g = player({ id: "g", position: "g", skill: 14, condition: -1 });
  // D pair 1
  const ld1 = player({
    id: "ld1",
    position: "d",
    skill: 13,
    powerplayMod: 2,
    penaltyKillMod: 1
  });
  const rd1 = player({
    id: "rd1",
    position: "d",
    skill: 11,
    powerplayMod: 0,
    penaltyKillMod: 2
  });
  // D pair 2
  const ld2 = player({ id: "ld2", position: "d", skill: 10 });
  const rd2 = player({
    id: "rd2",
    position: "d",
    skill: 9,
    specialty: "greedySurfer"
  });
  // D pair 3
  const ld3 = player({ id: "ld3", position: "d", skill: 8 });
  const rd3 = player({ id: "rd3", position: "d", skill: 7 });
  // Forward line 1
  const lw1 = player({
    id: "lw1",
    position: "lw",
    skill: 16,
    powerplayMod: 3,
    penaltyKillMod: -2
  });
  const c1 = player({
    id: "c1",
    position: "c",
    skill: 14,
    powerplayMod: 1,
    penaltyKillMod: 1
  });
  const rw1 = player({
    id: "rw1",
    position: "rw",
    skill: 12,
    powerplayMod: -1
  });
  // Forward line 2
  const lw2 = player({ id: "lw2", position: "lw", skill: 11 });
  const c2 = player({ id: "c2", position: "c", skill: 10, condition: -2 });
  const rw2 = player({ id: "rw2", position: "rw", skill: 9 });
  // Forward line 3 — with an out-of-position player (D playing LW)
  const dAsLw = player({ id: "dAsLw", position: "d", skill: 12 });
  const c3 = player({ id: "c3", position: "c", skill: 8 });
  const rw3 = player({ id: "rw3", position: "rw", skill: 7 });
  // Forward line 4
  const lw4 = player({ id: "lw4", position: "lw", skill: 7 });
  const c4 = player({ id: "c4", position: "c", skill: 6 });
  const rw4 = player({ id: "rw4", position: "rw", skill: 5 });
  // PK-specific player
  const pkF = player({
    id: "pkF",
    position: "rw",
    skill: 11,
    penaltyKillMod: 3
  });

  const roster = rosterMap(
    g,
    ld1,
    rd1,
    ld2,
    rd2,
    ld3,
    rd3,
    lw1,
    c1,
    rw1,
    lw2,
    c2,
    rw2,
    dAsLw,
    c3,
    rw3,
    lw4,
    c4,
    rw4,
    pkF
  );

  const lineup: Lineup = {
    g: "g",
    forwardLines: [
      { lw: "lw1", c: "c1", rw: "rw1" },
      { lw: "lw2", c: "c2", rw: "rw2" },
      { lw: "dAsLw", c: "c3", rw: "rw3" },
      { lw: "lw4", c: "c4", rw: "rw4" }
    ],
    defensivePairings: [
      { ld: "ld1", rd: "rd1" },
      { ld: "ld2", rd: "rd2" },
      { ld: "ld3", rd: "rd3" }
    ],
    powerplayTeam: {
      ld: "ld1",
      rd: "rd1",
      lw: "lw1",
      c: "c1",
      rw: "rw1"
    },
    penaltyKillTeam: {
      ld: "ld1",
      rd: "rd1",
      f1: "pkF",
      f2: "c1"
    }
  };

  it("goalie strength: condition -1 applied", () => {
    // g: base=14, pos=g→14, spe=none→14, kun=-1→FIX(0.9*14)=FIX(12.6)=12
    const result = calculateLineupStrength(lineup, roster);
    expect(result.goalie).toBe(12);
  });

  it("defence: 3 pairs with position and specialty penalties", () => {
    // Pair 1: ld1(13, D in D)=13, rd1(11, D in D)=11 → 24
    // Pair 2: ld2(10, D in D)=10, rd2(9, D in D, greedySurfer)
    //   rd2: pos=D→9, spe=surfer→round(0.7*9)=round(6.3)=6, kun=0→6
    //   Pair 2 total: 10 + 6 = 16
    // Pair 3: ld3(8)=8, rd3(7)=7 → 15
    // Total: 24 + 16 + 15 = 55
    const result = calculateLineupStrength(lineup, roster);
    expect(result.defence).toBe(55);
  });

  it("attack: 4 lines with OOP and condition penalties", () => {
    // Line 1: lw1(16)=16, c1(14)=14, rw1(12)=12 → 42
    // Line 2: lw2(11)=11, c2(10, kun=-2)→FIX(0.7*10)=7, rw2(9)=9 → 27
    // Line 3: dAsLw(12, D in LW)→FIX(0.7*12)=FIX(8.4)=8, c3(8)=8, rw3(7)=7 → 23
    // Line 4: lw4(7)=7, c4(6)=6, rw4(5)=5 → 18
    // Total: 42 + 27 + 23 + 18 = 110
    const result = calculateLineupStrength(lineup, roster);
    expect(result.attack).toBe(110);
  });

  it("PP strength: uses dedicated PP unit with yvo bonuses", () => {
    // PP uses ld1, rd1, lw1, c1, rw1 — all complete
    // ld1: 13 + 2(yvo) = 15, D in D → 15
    // rd1: 11 + 0 = 11, D in D → 11
    // lw1: 16 + 3 = 19, LW in LW → 19
    // c1:  14 + 1 = 15, C in C → 15
    // rw1: 12 + (-1) = 11, RW in RW → 11
    // Total: 15 + 11 + 19 + 15 + 11 = 71
    expect(calculatePowerPlayStrength(lineup, roster)).toBe(71);
  });

  it("PK strength: uses dedicated PK unit with avo bonuses", () => {
    // PK uses ld1, rd1, pkF, c1 — all complete
    // ld1: 13 + 1(avo) = 14, D in D → 14
    // rd1: 11 + 2(avo) = 13, D in D → 13
    // pkF: 11 + 3(avo) = 14, RW in pkf → 14 (any forward full in pkf)
    // c1:  14 + 1(avo) = 15, C in pkf → 15
    // Total: 14 + 13 + 14 + 15 = 56
    expect(calculatePenaltyKillStrength(lineup, roster)).toBe(56);
  });
});

// ---------------------------------------------------------------------------
// Edge cases: floor at MIN_EFFECTIVE_STRENGTH (gameplay deviation)
// ---------------------------------------------------------------------------

describe("floor at MIN_EFFECTIVE_STRENGTH", () => {
  it("very low base + harsh condition floors at 1 per slot, not 0", () => {
    const weak = player({
      id: "d1",
      position: "d",
      skill: 2,
      condition: -4
    });
    const weak2 = player({
      id: "d2",
      position: "d",
      skill: 2,
      condition: -4
    });
    const lineup: Lineup = {
      ...emptyLineup,
      defensivePairings: [
        { ld: "d1", rd: "d2" },
        { ld: null, rd: null },
        { ld: null, rd: null }
      ]
    };
    // Each: 2, pos ok → 2, spe ok → 2, kun<-3 → FIX(0.3*2) = 0 → floor → 1
    const result = calculateLineupStrength(lineup, rosterMap(weak, weak2));
    expect(result.defence).toBe(2); // 1+1, not 0+0
  });

  it("same floor applies to PP slots", () => {
    const ppLd = player({
      id: "ppLd",
      position: "d",
      skill: 1,
      powerplayMod: -3,
      condition: -3
    });
    const ppRd = player({
      id: "ppRd",
      position: "d",
      skill: 10,
      powerplayMod: 0
    });
    const ppLw = player({
      id: "ppLw",
      position: "lw",
      skill: 10,
      powerplayMod: 0
    });
    const ppC = player({
      id: "ppC",
      position: "c",
      skill: 10,
      powerplayMod: 0
    });
    const ppRw = player({
      id: "ppRw",
      position: "rw",
      skill: 10,
      powerplayMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      powerplayTeam: {
        ld: "ppLd",
        rd: "ppRd",
        lw: "ppLw",
        c: "ppC",
        rw: "ppRw"
      }
    };

    // ppLd: base = 1 + (-3) = -2 → floor → 1 (floor happens before condition could make it worse,
    //   actually: position penalty on -2 → -2 (D in D, no change), specialty → -2, condition → FIX(0.5*-2) = -1 → floor 1)
    //   Wait, let me re-trace: applyPositionPenalty("d","d",-2) = -2,
    //   applySpecialtyPenalty("none",-2) = -2,
    //   applyConditionPenalty(-3,-2) = FIX(0.5*-2) = FIX(-1.0) = -1,
    //   floorStrength(-1) = 1. ✓
    // Others: 10 each
    // Total: 1 + 10 + 10 + 10 + 10 = 41
    expect(
      calculatePowerPlayStrength(lineup, rosterMap(ppLd, ppRd, ppLw, ppC, ppRw))
    ).toBe(41);
  });
});

// ---------------------------------------------------------------------------
// Doping (erik(3)) — team-level bonus added to every player's base value
// ---------------------------------------------------------------------------

describe("doping (erik(3)) bonus", () => {
  describe("calculateLineupStrength with doping", () => {
    it("doping=0 matches no-arg call (backward compat)", () => {
      const g = player({ id: "g1", position: "g", skill: 12 });
      const lineup: Lineup = { ...emptyLineup, g: "g1" };
      const roster = rosterMap(g);
      expect(calculateLineupStrength(lineup, roster, 0)).toEqual(
        calculateLineupStrength(lineup, roster)
      );
    });

    it("doping adds to goalie base value", () => {
      const g = player({ id: "g1", position: "g", skill: 12 });
      const lineup: Lineup = { ...emptyLineup, g: "g1" };
      // base = 12 + 0(plus) + 2(doping) = 14
      expect(calculateLineupStrength(lineup, rosterMap(g), 2).goalie).toBe(14);
    });

    it("doping adds to each defender in a pair", () => {
      const ld = player({ id: "ld1", position: "d", skill: 10 });
      const rd = player({ id: "rd1", position: "d", skill: 8 });
      const lineup: Lineup = {
        ...emptyLineup,
        defensivePairings: [
          { ld: "ld1", rd: "rd1" },
          { ld: null, rd: null },
          { ld: null, rd: null }
        ]
      };
      // ld: 10+1 = 11, rd: 8+1 = 9 → 20
      expect(
        calculateLineupStrength(lineup, rosterMap(ld, rd), 1).defence
      ).toBe(20);
    });

    it("doping adds to each forward in a line", () => {
      const lw = player({ id: "lw1", position: "lw", skill: 10 });
      const c = player({ id: "c1", position: "c", skill: 10 });
      const rw = player({ id: "rw1", position: "rw", skill: 10 });
      const lineup: Lineup = {
        ...emptyLineup,
        forwardLines: [
          { lw: "lw1", c: "c1", rw: "rw1" },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null }
        ]
      };
      // Each: 10 + 2 = 12, total 36 (vs 30 without doping)
      expect(
        calculateLineupStrength(lineup, rosterMap(lw, c, rw), 2).attack
      ).toBe(36);
    });

    it("doping interacts with position penalty: D in LW, doping=2", () => {
      const d = player({ id: "d1", position: "d", skill: 10 });
      const c = player({ id: "c1", position: "c", skill: 10 });
      const rw = player({ id: "rw1", position: "rw", skill: 10 });
      const lineup: Lineup = {
        ...emptyLineup,
        forwardLines: [
          { lw: "d1", c: "c1", rw: "rw1" },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null }
        ]
      };
      // d in LW: base = 10+2 = 12, FIX(0.7*12) = FIX(8.4) = 8
      // c: 10+2 = 12, rw: 10+2 = 12
      // Total: 8 + 12 + 12 = 32
      expect(
        calculateLineupStrength(lineup, rosterMap(d, c, rw), 2).attack
      ).toBe(32);
    });

    it("doping interacts with greedySurfer + condition penalty", () => {
      const surfer = player({
        id: "d1",
        position: "d",
        skill: 10,
        specialty: "greedySurfer",
        condition: -1
      });
      const d2 = player({ id: "d2", position: "d", skill: 10 });
      const lineup: Lineup = {
        ...emptyLineup,
        defensivePairings: [
          { ld: "d1", rd: "d2" },
          { ld: null, rd: null },
          { ld: null, rd: null }
        ]
      };
      // d1: base = 10+1 = 11, pos D in D → 11,
      //   greedySurfer → round(0.7*11) = round(7.7) = 8,
      //   condition -1 → FIX(0.9*8) = 7
      // d2: base = 10+1 = 11
      // Total: 7 + 11 = 18
      expect(
        calculateLineupStrength(lineup, rosterMap(surfer, d2), 1).defence
      ).toBe(18);
    });
  });

  describe("calculatePowerPlayStrength with doping", () => {
    it("doping=0 matches no-arg call", () => {
      const ppLd = player({
        id: "ppLd",
        position: "d",
        skill: 12,
        powerplayMod: 1
      });
      const ppRd = player({
        id: "ppRd",
        position: "d",
        skill: 10,
        powerplayMod: 0
      });
      const ppLw = player({
        id: "ppLw",
        position: "lw",
        skill: 14,
        powerplayMod: 2
      });
      const ppC = player({
        id: "ppC",
        position: "c",
        skill: 13,
        powerplayMod: 0
      });
      const ppRw = player({
        id: "ppRw",
        position: "rw",
        skill: 11,
        powerplayMod: 0
      });
      const lineup: Lineup = {
        ...emptyLineup,
        powerplayTeam: {
          ld: "ppLd",
          rd: "ppRd",
          lw: "ppLw",
          c: "ppC",
          rw: "ppRw"
        }
      };
      const roster = rosterMap(ppLd, ppRd, ppLw, ppC, ppRw);
      expect(calculatePowerPlayStrength(lineup, roster, 0)).toBe(
        calculatePowerPlayStrength(lineup, roster)
      );
    });

    it("doping adds to each PP slot's base (before yvo)", () => {
      const ppLd = player({
        id: "ppLd",
        position: "d",
        skill: 10,
        powerplayMod: 2
      });
      const ppRd = player({
        id: "ppRd",
        position: "d",
        skill: 10,
        powerplayMod: 0
      });
      const ppLw = player({
        id: "ppLw",
        position: "lw",
        skill: 10,
        powerplayMod: 0
      });
      const ppC = player({
        id: "ppC",
        position: "c",
        skill: 10,
        powerplayMod: 0
      });
      const ppRw = player({
        id: "ppRw",
        position: "rw",
        skill: 10,
        powerplayMod: 0
      });
      const lineup: Lineup = {
        ...emptyLineup,
        powerplayTeam: {
          ld: "ppLd",
          rd: "ppRd",
          lw: "ppLw",
          c: "ppC",
          rw: "ppRw"
        }
      };
      // ppLd: base = 10+1(doping) + 2(yvo) = 13
      // others: base = 10+1 + 0 = 11 each
      // Total: 13 + 11 + 11 + 11 + 11 = 57
      expect(
        calculatePowerPlayStrength(
          lineup,
          rosterMap(ppLd, ppRd, ppLw, ppC, ppRw),
          1
        )
      ).toBe(57);
    });

    it("doping in PP fallback path (incomplete PP, uses line 1)", () => {
      const ld = player({
        id: "ld1",
        position: "d",
        skill: 10,
        powerplayMod: 0
      });
      const rd = player({
        id: "rd1",
        position: "d",
        skill: 10,
        powerplayMod: 0
      });
      const lw = player({
        id: "lw1",
        position: "lw",
        skill: 10,
        powerplayMod: 0
      });
      const c = player({ id: "c1", position: "c", skill: 10, powerplayMod: 0 });
      const rw = player({
        id: "rw1",
        position: "rw",
        skill: 10,
        powerplayMod: 0
      });
      const lineup: Lineup = {
        ...emptyLineup,
        powerplayTeam: { ld: "ld1", rd: "rd1", lw: "lw1", c: "c1", rw: null },
        forwardLines: [
          { lw: "lw1", c: "c1", rw: "rw1" },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null }
        ],
        defensivePairings: [
          { ld: "ld1", rd: "rd1" },
          { ld: null, rd: null },
          { ld: null, rd: null }
        ]
      };
      // Fallback to line 1. Each: 10 + 2(doping) + 0(yvo) = 12. 5 slots → 60
      expect(
        calculatePowerPlayStrength(lineup, rosterMap(ld, rd, lw, c, rw), 2)
      ).toBe(60);
    });
  });

  describe("calculatePenaltyKillStrength with doping", () => {
    it("doping=0 matches no-arg call", () => {
      const pkLd = player({
        id: "pkLd",
        position: "d",
        skill: 12,
        penaltyKillMod: 1
      });
      const pkRd = player({
        id: "pkRd",
        position: "d",
        skill: 10,
        penaltyKillMod: 0
      });
      const pkF1 = player({
        id: "pkF1",
        position: "lw",
        skill: 14,
        penaltyKillMod: 2
      });
      const pkF2 = player({
        id: "pkF2",
        position: "c",
        skill: 13,
        penaltyKillMod: 0
      });
      const lineup: Lineup = {
        ...emptyLineup,
        penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
      };
      const roster = rosterMap(pkLd, pkRd, pkF1, pkF2);
      expect(calculatePenaltyKillStrength(lineup, roster, 0)).toBe(
        calculatePenaltyKillStrength(lineup, roster)
      );
    });

    it("doping adds to each PK slot's base (before avo)", () => {
      const pkLd = player({
        id: "pkLd",
        position: "d",
        skill: 10,
        penaltyKillMod: 1
      });
      const pkRd = player({
        id: "pkRd",
        position: "d",
        skill: 10,
        penaltyKillMod: 0
      });
      const pkF1 = player({
        id: "pkF1",
        position: "lw",
        skill: 10,
        penaltyKillMod: 0
      });
      const pkF2 = player({
        id: "pkF2",
        position: "c",
        skill: 10,
        penaltyKillMod: 0
      });
      const lineup: Lineup = {
        ...emptyLineup,
        penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
      };
      // pkLd: 10+2(doping)+1(avo) = 13, pkRd: 10+2+0 = 12,
      // pkF1: 10+2+0 = 12, pkF2: 10+2+0 = 12
      // Total: 13 + 12 + 12 + 12 = 49
      expect(
        calculatePenaltyKillStrength(
          lineup,
          rosterMap(pkLd, pkRd, pkF1, pkF2),
          2
        )
      ).toBe(49);
    });

    it("doping in PK fallback path (incomplete PK, uses line 1)", () => {
      const ld = player({
        id: "ld1",
        position: "d",
        skill: 10,
        penaltyKillMod: 0
      });
      const rd = player({
        id: "rd1",
        position: "d",
        skill: 10,
        penaltyKillMod: 0
      });
      const lw = player({
        id: "lw1",
        position: "lw",
        skill: 10,
        penaltyKillMod: 0
      });
      const c = player({
        id: "c1",
        position: "c",
        skill: 10,
        penaltyKillMod: 0
      });
      const lineup: Lineup = {
        ...emptyLineup,
        penaltyKillTeam: { ld: "ld1", rd: "rd1", f1: "lw1", f2: null },
        forwardLines: [
          { lw: "lw1", c: "c1", rw: null },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null }
        ],
        defensivePairings: [
          { ld: "ld1", rd: "rd1" },
          { ld: null, rd: null },
          { ld: null, rd: null }
        ]
      };
      // Fallback. Each: 10 + 1(doping) + 0(avo) = 11. 4 slots → 44
      expect(
        calculatePenaltyKillStrength(lineup, rosterMap(ld, rd, lw, c), 1)
      ).toBe(44);
    });

    it("doping stacks with position penalty: D in pkf + doping=2", () => {
      const pkLd = player({
        id: "pkLd",
        position: "d",
        skill: 10,
        penaltyKillMod: 0
      });
      const pkRd = player({
        id: "pkRd",
        position: "d",
        skill: 10,
        penaltyKillMod: 0
      });
      const pkF1 = player({
        id: "pkF1",
        position: "d",
        skill: 15,
        penaltyKillMod: 0
      });
      const pkF2 = player({
        id: "pkF2",
        position: "c",
        skill: 10,
        penaltyKillMod: 0
      });
      const lineup: Lineup = {
        ...emptyLineup,
        penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
      };
      // pkF1: D in pkf, base = 15+2 = 17, FIX(0.7*17) = FIX(11.9) = 11
      // pkLd: 10+2 = 12, pkRd: 10+2 = 12, pkF2: 10+2 = 12
      // Total: 12 + 12 + 11 + 12 = 47
      expect(
        calculatePenaltyKillStrength(
          lineup,
          rosterMap(pkLd, pkRd, pkF1, pkF2),
          2
        )
      ).toBe(47);
    });
  });

  describe("integration: doping across full lineup", () => {
    it("doping=1 increases all stats uniformly for a simple lineup", () => {
      const g = player({ id: "g1", position: "g", skill: 10 });
      const ld = player({ id: "ld1", position: "d", skill: 10 });
      const rd = player({ id: "rd1", position: "d", skill: 10 });
      const lw = player({ id: "lw1", position: "lw", skill: 10 });
      const c = player({ id: "c1", position: "c", skill: 10 });
      const rw = player({ id: "rw1", position: "rw", skill: 10 });
      const lineup: Lineup = {
        ...emptyLineup,
        g: "g1",
        defensivePairings: [
          { ld: "ld1", rd: "rd1" },
          { ld: null, rd: null },
          { ld: null, rd: null }
        ],
        forwardLines: [
          { lw: "lw1", c: "c1", rw: "rw1" },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null },
          { lw: null, c: null, rw: null }
        ]
      };
      const roster = rosterMap(g, ld, rd, lw, c, rw);

      const noDoping = calculateLineupStrength(lineup, roster, 0);
      const withDoping = calculateLineupStrength(lineup, roster, 1);

      // Goalie: 10 → 11 (+1)
      expect(withDoping.goalie).toBe(noDoping.goalie + 1);
      // Defence: 2 players, each +1 → +2
      expect(withDoping.defence).toBe(noDoping.defence + 2);
      // Attack: 3 players, each +1 → +3
      expect(withDoping.attack).toBe(noDoping.attack + 3);
    });
  });
});
