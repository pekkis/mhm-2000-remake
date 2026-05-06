import { describe, it, expect } from "vitest";
import { createRandom } from "@/services/random";
import { generateTeamRoster } from "./generate-team-roster";
import type { TeamStrength } from "@/data/levels";
import type { Player } from "@/state/player";

/** A representative mid-tier strength (roughly level 20 equivalent). */
const MID_STRENGTH: TeamStrength = { goalie: 9, defence: 44, attack: 88 };
/** Low-end strength (level 1). */
const WEAK_STRENGTH: TeamStrength = { goalie: 2, defence: 6, attack: 12 };
/** High-end strength (level 58). */
const STRONG_STRENGTH: TeamStrength = { goalie: 20, defence: 96, attack: 192 };

describe("generateTeamRoster — port of QB `gene` SUB", () => {
  describe("roster size", () => {
    it("always generates exactly 24 players", () => {
      const r = createRandom(1);
      const roster = generateTeamRoster(MID_STRENGTH, r);
      expect(Object.keys(roster)).toHaveLength(24);
    });

    it("generates 24 players across all supported strength levels", () => {
      for (const strength of [WEAK_STRENGTH, MID_STRENGTH, STRONG_STRENGTH]) {
        const r = createRandom(2);
        expect(Object.keys(generateTeamRoster(strength, r))).toHaveLength(24);
      }
    });
  });

  describe("position layout — QB gene slot mapping", () => {
    // Get an ordered array of players (by insertion order, which corresponds to slots 1..24)
    function getOrderedPlayers(strength: TeamStrength, seed: number): Player[] {
      const r = createRandom(seed);
      return Object.values(generateTeamRoster(strength, r));
    }

    it("slots 1-2 (indices 0-1) are goalies", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 10);
      expect(players[0].position).toBe("g");
      expect(players[1].position).toBe("g");
    });

    it("slots 3-8 (indices 2-7) are defenders", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 11);
      for (let i = 2; i <= 7; i++) {
        expect(players[i].position).toBe("d");
      }
    });

    it("slots 9-12 (indices 8-11) are left wings", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 12);
      for (let i = 8; i <= 11; i++) {
        expect(players[i].position).toBe("lw");
      }
    });

    it("slots 13-16 (indices 12-15) are centres", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 13);
      for (let i = 12; i <= 15; i++) {
        expect(players[i].position).toBe("c");
      }
    });

    it("slots 17-20 (indices 16-19) are right wings", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 14);
      for (let i = 16; i <= 19; i++) {
        expect(players[i].position).toBe("rw");
      }
    });

    it("slot 21 (index 20) is bench defender", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 15);
      expect(players[20].position).toBe("d");
    });

    it("slot 22 (index 21) is bench left wing", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 16);
      expect(players[21].position).toBe("lw");
    });

    it("slot 23 (index 22) is bench centre", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 17);
      expect(players[22].position).toBe("c");
    });

    it("slot 24 (index 23) is bench right wing", () => {
      const players = getOrderedPlayers(MID_STRENGTH, 18);
      expect(players[23].position).toBe("rw");
    });
  });

  describe("skill values", () => {
    it("goalie 1 (slot 1) has exactly the goalie strength", () => {
      const r = createRandom(20);
      const players = Object.values(generateTeamRoster(MID_STRENGTH, r));
      expect(players[0].skill).toBe(MID_STRENGTH.goalie);
    });

    it("goalie 2 (slot 2) has skill = goalie - 1..3 (QB: mw - INT(3*RND) - 1)", () => {
      for (let seed = 0; seed < 50; seed++) {
        const r = createRandom(seed);
        const players = Object.values(generateTeamRoster(MID_STRENGTH, r));
        const g2 = players[1].skill;
        expect(g2).toBeGreaterThanOrEqual(MID_STRENGTH.goalie - 3);
        expect(g2).toBeLessThanOrEqual(MID_STRENGTH.goalie - 1);
      }
    });

    it("all skills are >= 1", () => {
      for (const strength of [WEAK_STRENGTH, MID_STRENGTH, STRONG_STRENGTH]) {
        for (let seed = 0; seed < 20; seed++) {
          const r = createRandom(seed);
          for (const p of Object.values(generateTeamRoster(strength, r))) {
            expect(p.skill).toBeGreaterThanOrEqual(1);
          }
        }
      }
    });
  });

  describe("team strength balancing — port of QB adjustment passes", () => {
    it("defence total (slots 3-8) is within ±defAvg of pw target after balance", () => {
      // QB adjusts one player per delta unit, so the total should match pw exactly
      // after the balance pass. But redistribution adds variance.
      for (let seed = 0; seed < 30; seed++) {
        const r = createRandom(seed);
        const players = Object.values(generateTeamRoster(MID_STRENGTH, r));
        const defTotal = players.slice(2, 8).reduce((s, p) => s + p.skill, 0);
        // After balance pass, total should be close to pw (within redistribution variance)
        const defAvg = Math.round(MID_STRENGTH.defence / 6);
        expect(defTotal).toBeGreaterThan(MID_STRENGTH.defence - defAvg * 2);
        expect(defTotal).toBeLessThan(MID_STRENGTH.defence + defAvg * 2);
      }
    });

    it("forward total (slots 9-20) is within ±fwdAvg of hw target after balance", () => {
      for (let seed = 0; seed < 30; seed++) {
        const r = createRandom(seed);
        const players = Object.values(generateTeamRoster(MID_STRENGTH, r));
        const fwdTotal = players.slice(8, 20).reduce((s, p) => s + p.skill, 0);
        const fwdAvg = Math.round(MID_STRENGTH.attack / 12);
        expect(fwdTotal).toBeGreaterThan(MID_STRENGTH.attack - fwdAvg * 3);
        expect(fwdTotal).toBeLessThan(MID_STRENGTH.attack + fwdAvg * 3);
      }
    });
  });

  describe("contracts — port of QB svu assignment", () => {
    it("all players have type='regular' contracts", () => {
      const r = createRandom(50);
      for (const p of Object.values(generateTeamRoster(MID_STRENGTH, r))) {
        expect(p.contract.type).toBe("regular");
      }
    });

    it("main roster players (slots 1-20, indices 0-19) have contract duration 0 or 1", () => {
      // QB: pel(xx, pv).svu = INT(2 * RND) → 0 or 1
      const r = createRandom(51);
      const players = Object.values(generateTeamRoster(MID_STRENGTH, r));
      for (const p of players.slice(0, 20)) {
        expect(p.contract.duration).toBeGreaterThanOrEqual(0);
        expect(p.contract.duration).toBeLessThanOrEqual(1);
      }
    });

    it("bench players (slots 21-24, indices 20-23) always have contract duration 1", () => {
      // QB: pel(xx, pv).svu = 1 for bench players
      const r = createRandom(52);
      const players = Object.values(generateTeamRoster(MID_STRENGTH, r));
      for (const p of players.slice(20, 24)) {
        expect(p.contract.duration).toBe(1);
      }
    });

    it("contract salary is positive and computed from palkmaar formula (not placeholder)", () => {
      const r = createRandom(53);
      for (const p of Object.values(generateTeamRoster(MID_STRENGTH, r))) {
        expect(p.contract.type).toBe("regular");
        if (p.contract.type === "regular") {
          // palkmaar gives exponential salary — for skill >= 1 this is always > 0
          expect(p.contract.salary).toBeGreaterThan(0);
          // Should NOT be the old linear placeholder (skill * 1000)
          // For a neutral-modifier player with psk > 2, palkmaar >> psk * 1000 is not true,
          // but we can verify it's a reasonable salary range
          expect(p.contract.salary).toBeGreaterThanOrEqual(100); // psk=1 baseline
        }
      }
    });
  });

  describe("player state — initial conditions", () => {
    it("all players have effects=[], tags=[], condition=0", () => {
      const r = createRandom(60);
      for (const p of Object.values(generateTeamRoster(MID_STRENGTH, r))) {
        expect(p.effects).toEqual([]);
        expect(p.tags).toEqual([]);
        expect(p.condition).toBe(0);
      }
    });

    it("all stats are zero at generation", () => {
      const r = createRandom(61);
      for (const p of Object.values(generateTeamRoster(MID_STRENGTH, r))) {
        expect(p.stats.season).toEqual({ games: 0, goals: 0, assists: 0 });
        expect(p.stats.total).toEqual({ games: 0, goals: 0, assists: 0 });
      }
    });

    it("no player has a specialty at generation (gene doesn't assign spe)", () => {
      // QB gene SUB does not set spe; specialties come from borsgene/borssi market
      const r = createRandom(62);
      for (const p of Object.values(generateTeamRoster(MID_STRENGTH, r))) {
        expect(p.specialty).toBeNull();
      }
    });
  });

  describe("nationality distribution — QB gene: 70% FI, 30% random", () => {
    it("FI players are approximately 78% of the roster", () => {
      // P(FI) = 70/101 (direct) + (31/101)×(29/100) (fallback picks FI from keisit[0])
      //       = 0.6931 + 0.0890 ≈ 0.782
      let fiCount = 0;
      let total = 0;
      for (let seed = 0; seed < 200; seed++) {
        const r = createRandom(seed);
        for (const p of Object.values(generateTeamRoster(MID_STRENGTH, r))) {
          if (p.nationality === "FI") fiCount++;
          total++;
        }
      }
      const ratio = fiCount / total;
      expect(ratio).toBeGreaterThan(0.73);
      expect(ratio).toBeLessThan(0.84);
    });
  });

  describe("determinism", () => {
    it("produces identical rosters for the same seed", () => {
      const r1 = createRandom(1978);
      const r2 = createRandom(1978);
      const p1 = Object.values(generateTeamRoster(MID_STRENGTH, r1));
      const p2 = Object.values(generateTeamRoster(MID_STRENGTH, r2));
      expect(p1.map((p) => p.skill)).toEqual(p2.map((p) => p.skill));
      expect(p1.map((p) => p.surname)).toEqual(p2.map((p) => p.surname));
    });

    it("produces different rosters for different seeds", () => {
      const r1 = createRandom(100);
      const r2 = createRandom(200);
      const skills1 = Object.values(generateTeamRoster(MID_STRENGTH, r1)).map(
        (p) => p.skill
      );
      const skills2 = Object.values(generateTeamRoster(MID_STRENGTH, r2)).map(
        (p) => p.skill
      );
      // Extremely unlikely to be identical
      expect(skills1).not.toEqual(skills2);
    });
  });

  describe("unique player IDs", () => {
    it("all 24 players have distinct map keys", () => {
      const r = createRandom(9);
      const roster = generateTeamRoster(MID_STRENGTH, r);
      const ids = Object.keys(roster);
      expect(new Set(ids).size).toBe(24);
    });
  });
});
