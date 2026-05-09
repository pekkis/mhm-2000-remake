/**
 * Tests for calculateStrength, calculateYw, calculateAw — the team-level
 * strength interface that dispatches between AI (approximation formula)
 * and human (lineup-based pipeline).
 *
 * Expected values hand-computed from QB formulas:
 *   AI yw = (attack / 3.3 + defence / 2.5) × (1 + specialTeams × 0.04)
 *   AI aw = (attack / 4.4 + defence / 2.5) × (1 + specialTeams × 0.04)
 *   Human yw = calculatePowerPlayStrength(lineup, players) × multiplier
 *   Human aw = calculatePenaltyKillStrength(lineup, players) × multiplier
 */
import { calculateAw, calculateStrength, calculateYw } from "@/services/team";
import type { AITeam, HumanManager, HumanTeam } from "@/state/game";
import type { Lineup } from "@/state/lineup";
import {
  createAITeam,
  createHumanManager,
  createPlayer as mkPlayer,
  emptyLineup,
  rosterMap
} from "@/__tests__/factories";
import { describe, expect, it } from "vitest";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shorthand: create a human manager with only `specialTeams` varied. */
const mkManager = (specialTeams: number): HumanManager =>
  createHumanManager({
    attributes: {
      strategy: 5,
      specialTeams,
      negotiation: 5,
      resourcefulness: 5,
      charisma: 5,
      luck: 5
    }
  });

// ---------------------------------------------------------------------------
// calculateStrength
// ---------------------------------------------------------------------------

describe("calculateStrength", () => {
  it("AI team: returns strengthObj directly", () => {
    const team = createAITeam({
      strengthObj: { goalie: 12, defence: 45, attack: 60 }
    });
    expect(calculateStrength(team)).toEqual({
      goalie: 12,
      defence: 45,
      attack: 60
    });
  });

  it("human team: computes from lineup", () => {
    const g = mkPlayer({ id: "g1", position: "g", skill: 14 });
    const ld = mkPlayer({ id: "ld1", position: "d", skill: 12 });
    const rd = mkPlayer({ id: "rd1", position: "d", skill: 11 });
    const lw = mkPlayer({ id: "lw1", position: "lw", skill: 15 });
    const c = mkPlayer({ id: "c1", position: "c", skill: 13 });
    const rw = mkPlayer({ id: "rw1", position: "rw", skill: 11 });

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

    const team: HumanTeam = {
      ...createAITeam(),
      kind: "human",
      strengthObj: { goalie: 0, defence: 0, attack: 0 },
      players: rosterMap(g, ld, rd, lw, c, rw),
      lineup
    };

    const result = calculateStrength(team);
    expect(result.goalie).toBe(14);
    expect(result.defence).toBe(23); // 12 + 11
    expect(result.attack).toBe(39); // 15 + 13 + 11
  });
});

// ---------------------------------------------------------------------------
// calculateYw (power play)
// ---------------------------------------------------------------------------

describe("calculateYw", () => {
  describe("AI teams (approximation formula)", () => {
    it("specialTeams=0: yw = attack/3.3 + defence/2.5", () => {
      const team = createAITeam({
        strengthObj: { goalie: 10, defence: 50, attack: 66 }
      });
      const mgr = mkManager(0);
      // (66/3.3 + 50/2.5) * (1 + 0*0.04)
      // = (20 + 20) * 1 = 40
      expect(calculateYw(team, mgr)).toBe(40);
    });

    it("specialTeams=5: multiplier is 1.2", () => {
      const team = createAITeam({
        strengthObj: { goalie: 10, defence: 50, attack: 66 }
      });
      const mgr = mkManager(5);
      // (66/3.3 + 50/2.5) * (1 + 5*0.04) = 40 * 1.2 = 48
      expect(calculateYw(team, mgr)).toBe(48);
    });

    it("specialTeams=10: multiplier is 1.4", () => {
      const team = createAITeam({
        strengthObj: { goalie: 10, defence: 25, attack: 33 }
      });
      const mgr = mkManager(10);
      // (33/3.3 + 25/2.5) * (1 + 10*0.04) = (10+10) * 1.4 = 28
      expect(calculateYw(team, mgr)).toBe(28);
    });
  });

  describe("human teams (lineup-based)", () => {
    it("fully staffed PP: sums slots × specialTeams multiplier", () => {
      const ppLd = mkPlayer({
        id: "ppLd",
        position: "d",
        skill: 12,
        powerplayMod: 2
      });
      const ppRd = mkPlayer({
        id: "ppRd",
        position: "d",
        skill: 10,
        powerplayMod: 0
      });
      const ppLw = mkPlayer({
        id: "ppLw",
        position: "lw",
        skill: 14,
        powerplayMod: 1
      });
      const ppC = mkPlayer({
        id: "ppC",
        position: "c",
        skill: 13,
        powerplayMod: 0
      });
      const ppRw = mkPlayer({
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

      const team: HumanTeam = {
        ...createAITeam(),
        kind: "human",
        strengthObj: { goalie: 0, defence: 0, attack: 0 },
        players: rosterMap(ppLd, ppRd, ppLw, ppC, ppRw),
        lineup
      };

      const mgr = mkManager(5); // mult = 1.2

      // PP raw:
      // ppLd: 12+2=14, ppRd: 10, ppLw: 14+1=15, ppC: 13, ppRw: 11
      // = 14+10+15+13+11 = 63
      // × 1.2 = 75.6
      expect(calculateYw(team, mgr)).toBeCloseTo(75.6);
    });

    it("specialTeams=0: no multiplier boost", () => {
      const ppLd = mkPlayer({
        id: "ppLd",
        position: "d",
        skill: 10,
        powerplayMod: 0
      });
      const ppRd = mkPlayer({
        id: "ppRd",
        position: "d",
        skill: 10,
        powerplayMod: 0
      });
      const ppLw = mkPlayer({
        id: "ppLw",
        position: "lw",
        skill: 10,
        powerplayMod: 0
      });
      const ppC = mkPlayer({
        id: "ppC",
        position: "c",
        skill: 10,
        powerplayMod: 0
      });
      const ppRw = mkPlayer({
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

      const team: HumanTeam = {
        ...createAITeam(),
        kind: "human",
        strengthObj: { goalie: 0, defence: 0, attack: 0 },
        players: rosterMap(ppLd, ppRd, ppLw, ppC, ppRw),
        lineup
      };

      const mgr = mkManager(0); // mult = 1.0
      // 5 × 10 = 50 × 1.0 = 50
      expect(calculateYw(team, mgr)).toBe(50);
    });

    it("empty PP + empty lineup → 0 regardless of specialTeams", () => {
      const team: HumanTeam = {
        ...createAITeam(),
        kind: "human",
        strengthObj: { goalie: 0, defence: 0, attack: 0 },
        players: {},
        lineup: emptyLineup
      };
      const mgr = mkManager(10);
      expect(calculateYw(team, mgr)).toBe(0);
    });
  });
});

// ---------------------------------------------------------------------------
// calculateAw (penalty kill)
// ---------------------------------------------------------------------------

describe("calculateAw", () => {
  describe("AI teams (approximation formula)", () => {
    it("specialTeams=0: aw = attack/4.4 + defence/2.5", () => {
      const team: AITeam = {
        ...createAITeam(),
        kind: "ai",
        strengthObj: { goalie: 10, defence: 50, attack: 44 }
      };
      const mgr = mkManager(0);
      // (44/4.4 + 50/2.5) * 1.0 = (10 + 20) * 1 = 30
      expect(calculateAw(team, mgr)).toBe(30);
    });

    it("specialTeams=5: multiplier is 1.2", () => {
      const team: AITeam = {
        ...createAITeam(),
        kind: "ai",
        strengthObj: { goalie: 10, defence: 50, attack: 44 }
      };
      const mgr = mkManager(5);
      // 30 * 1.2 = 36
      expect(calculateAw(team, mgr)).toBe(36);
    });
  });

  describe("human teams (lineup-based)", () => {
    it("fully staffed PK: sums slots × specialTeams multiplier", () => {
      const pkLd = mkPlayer({
        id: "pkLd",
        position: "d",
        skill: 12,
        penaltyKillMod: 1
      });
      const pkRd = mkPlayer({
        id: "pkRd",
        position: "d",
        skill: 10,
        penaltyKillMod: 2
      });
      const pkF1 = mkPlayer({
        id: "pkF1",
        position: "lw",
        skill: 14,
        penaltyKillMod: -1
      });
      const pkF2 = mkPlayer({
        id: "pkF2",
        position: "c",
        skill: 13,
        penaltyKillMod: 0
      });

      const lineup: Lineup = {
        ...emptyLineup,
        penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
      };

      const team: HumanTeam = {
        ...createAITeam(),
        kind: "human",
        strengthObj: { goalie: 0, defence: 0, attack: 0 },
        players: rosterMap(pkLd, pkRd, pkF1, pkF2),
        lineup
      };

      const mgr = mkManager(5); // mult = 1.2

      // PK raw:
      // pkLd: 12+1=13, pkRd: 10+2=12, pkF1: 14+(-1)=13, pkF2: 13+0=13
      // = 13+12+13+13 = 51
      // × 1.2 = 61.2
      expect(calculateAw(team, mgr)).toBeCloseTo(61.2);
    });

    it("specialTeams=0: no multiplier boost", () => {
      const pkLd = mkPlayer({
        id: "pkLd",
        position: "d",
        skill: 10,
        penaltyKillMod: 0
      });
      const pkRd = mkPlayer({
        id: "pkRd",
        position: "d",
        skill: 10,
        penaltyKillMod: 0
      });
      const pkF1 = mkPlayer({
        id: "pkF1",
        position: "lw",
        skill: 10,
        penaltyKillMod: 0
      });
      const pkF2 = mkPlayer({
        id: "pkF2",
        position: "c",
        skill: 10,
        penaltyKillMod: 0
      });

      const lineup: Lineup = {
        ...emptyLineup,
        penaltyKillTeam: { ld: "pkLd", rd: "pkRd", f1: "pkF1", f2: "pkF2" }
      };

      const team: HumanTeam = {
        ...createAITeam(),
        kind: "human",
        strengthObj: { goalie: 0, defence: 0, attack: 0 },
        players: rosterMap(pkLd, pkRd, pkF1, pkF2),
        lineup
      };

      const mgr = mkManager(0);
      // 4 × 10 = 40 × 1.0 = 40
      expect(calculateAw(team, mgr)).toBe(40);
    });

    it("empty PK + empty lineup → 0", () => {
      const team: HumanTeam = {
        ...createAITeam(),
        kind: "human",
        strengthObj: { goalie: 0, defence: 0, attack: 0 },
        players: {},
        lineup: emptyLineup
      };
      const mgr = mkManager(10);
      expect(calculateAw(team, mgr)).toBe(0);
    });
  });

  describe("AI vs human divergence", () => {
    it("AI aw uses approximation; human aw uses actual PK slots", () => {
      // Set up an AI team and a human team with identical base stats
      // but different PK slot compositions, showing they compute differently.
      const aiTeam: AITeam = {
        ...createAITeam(),
        kind: "ai",
        strengthObj: { goalie: 10, defence: 50, attack: 44 }
      };

      // Human team with mediocre PK players
      const pkLd = mkPlayer({
        id: "pkLd",
        position: "d",
        skill: 8,
        penaltyKillMod: -2
      });
      const pkRd = mkPlayer({
        id: "pkRd",
        position: "d",
        skill: 8,
        penaltyKillMod: -2
      });
      const pkF1 = mkPlayer({
        id: "pkF1",
        position: "lw",
        skill: 8,
        penaltyKillMod: -2
      });
      const pkF2 = mkPlayer({
        id: "pkF2",
        position: "c",
        skill: 8,
        penaltyKillMod: -2
      });

      const humanTeam: HumanTeam = {
        ...createAITeam(),
        kind: "human",
        strengthObj: { goalie: 10, defence: 50, attack: 44 },
        players: rosterMap(pkLd, pkRd, pkF1, pkF2),
        lineup: {
          ...emptyLineup,
          penaltyKillTeam: {
            ld: "pkLd",
            rd: "pkRd",
            f1: "pkF1",
            f2: "pkF2"
          }
        }
      };

      const mgr = mkManager(0);

      const aiAw = calculateAw(aiTeam, mgr);
      const humanAw = calculateAw(humanTeam, mgr);

      // AI: (44/4.4 + 50/2.5) * 1 = 30
      expect(aiAw).toBe(30);
      // Human: 4 × (8 + (-2)) = 4 × 6 = 24
      expect(humanAw).toBe(24);
      // They differ — human is worse due to poor PK mods
      expect(humanAw).toBeLessThan(aiAw);
    });
  });
});

// ---------------------------------------------------------------------------
// Cross-check: yw vs aw for same lineup (yw > aw for same players)
// ---------------------------------------------------------------------------

describe("yw vs aw cross-check", () => {
  it("PP has 5 players, PK has 4 — PP raw sum should typically be higher", () => {
    // Same-quality players in both units
    const d1 = mkPlayer({
      id: "d1",
      position: "d",
      skill: 10,
      powerplayMod: 0,
      penaltyKillMod: 0
    });
    const d2 = mkPlayer({
      id: "d2",
      position: "d",
      skill: 10,
      powerplayMod: 0,
      penaltyKillMod: 0
    });
    const lw = mkPlayer({
      id: "lw",
      position: "lw",
      skill: 10,
      powerplayMod: 0,
      penaltyKillMod: 0
    });
    const c = mkPlayer({
      id: "c",
      position: "c",
      skill: 10,
      powerplayMod: 0,
      penaltyKillMod: 0
    });
    const rw = mkPlayer({
      id: "rw",
      position: "rw",
      skill: 10,
      powerplayMod: 0,
      penaltyKillMod: 0
    });

    const lineup: Lineup = {
      ...emptyLineup,
      powerplayTeam: {
        ld: "d1",
        rd: "d2",
        lw: "lw",
        c: "c",
        rw: "rw"
      },
      penaltyKillTeam: {
        ld: "d1",
        rd: "d2",
        f1: "lw",
        f2: "c"
      }
    };

    const team: HumanTeam = {
      ...createAITeam(),
      kind: "human",
      strengthObj: { goalie: 0, defence: 0, attack: 0 },
      players: rosterMap(d1, d2, lw, c, rw),
      lineup
    };

    const mgr = mkManager(0);
    // PP: 5 × 10 = 50, PK: 4 × 10 = 40
    expect(calculateYw(team, mgr)).toBe(50);
    expect(calculateAw(team, mgr)).toBe(40);
    expect(calculateYw(team, mgr)).toBeGreaterThan(calculateAw(team, mgr));
  });
});
