import { describe, it, expect } from "vitest";
import { createRandom } from "@/services/random";
import { generateMarketPlayers } from "./generate-market-players";

const VALID_SPECIALTIES = [
  "greedySurfer",
  "enforcer",
  "foulMouth",
  "evangelist",
] as const;

describe("generateMarketPlayers — port of QB `borsgene` SUB", () => {
  describe("output count", () => {
    it("returns exactly the requested count", () => {
      const r = createRandom(1);
      const players = generateMarketPlayers(440, r);
      expect(Object.keys(players)).toHaveLength(440);
    });

    it("works for small counts", () => {
      const r = createRandom(2);
      expect(Object.keys(generateMarketPlayers(1, r))).toHaveLength(1);
      expect(Object.keys(generateMarketPlayers(10, r))).toHaveLength(10);
    });

    it("returns an empty record for count=0", () => {
      const r = createRandom(3);
      expect(Object.keys(generateMarketPlayers(0, r))).toHaveLength(0);
    });
  });

  describe("player structure — no contract, no planned departure", () => {
    it("MarketPlayer has no contract field", () => {
      const r = createRandom(10);
      const players = Object.values(generateMarketPlayers(10, r));
      for (const p of players) {
        expect(p).not.toHaveProperty("contract");
        expect(p).not.toHaveProperty("plannedDeparture");
      }
    });

    it("all players have effects=[] and tags=[]", () => {
      const r = createRandom(11);
      for (const p of Object.values(generateMarketPlayers(20, r))) {
        expect(p.effects).toEqual([]);
        expect(p.tags).toEqual([]);
      }
    });

    it("all players have condition=0", () => {
      const r = createRandom(12);
      for (const p of Object.values(generateMarketPlayers(20, r))) {
        expect(p.condition).toBe(0);
      }
    });

    it("all stats are zero at generation", () => {
      const r = createRandom(13);
      for (const p of Object.values(generateMarketPlayers(20, r))) {
        expect(p.stats.season).toEqual({ games: 0, goals: 0, assists: 0 });
        expect(p.stats.total).toEqual({ games: 0, goals: 0, assists: 0 });
      }
    });
  });

  describe("skill (psk) — QB borsgene formula: bucket*2 + INT(3*RND) - 1", () => {
    it("all skills are in range 1..19 (max bucket=9 → 9*2+2-1=19)", () => {
      const r = createRandom(20);
      for (const p of Object.values(generateMarketPlayers(440, r))) {
        expect(p.skill).toBeGreaterThanOrEqual(1);
        expect(p.skill).toBeLessThanOrEqual(19);
      }
    });

    it("skill 1 can occur (bucket=1, roll=0 → 1*2+0-1=1)", () => {
      // With 440 players and FI being ~30% of the pool (highest weight in bucket 1),
      // we should see skill=1 at least sometimes across multiple seeds.
      let foundOne = false;
      for (let seed = 0; seed < 20; seed++) {
        const r = createRandom(seed);
        for (const p of Object.values(generateMarketPlayers(440, r))) {
          if (p.skill === 1) { foundOne = true; break; }
        }
        if (foundOne) break;
      }
      expect(foundOne).toBe(true);
    });

    it("skill 19 can occur (bucket=9, roll=2 → 9*2+2-1=19)", () => {
      let foundNineteen = false;
      for (let seed = 0; seed < 20; seed++) {
        const r = createRandom(seed);
        for (const p of Object.values(generateMarketPlayers(440, r))) {
          if (p.skill === 19) { foundNineteen = true; break; }
        }
        if (foundNineteen) break;
      }
      expect(foundNineteen).toBe(true);
    });

    it("most players have skill in the mid-range (4..12)", () => {
      const r = createRandom(30);
      const players = Object.values(generateMarketPlayers(440, r));
      const midRange = players.filter((p) => p.skill >= 4 && p.skill <= 12).length;
      expect(midRange / players.length).toBeGreaterThan(0.5);
    });
  });

  describe("askingSalary", () => {
    it("askingSalary is strictly positive for every player", () => {
      const r = createRandom(40);
      for (const p of Object.values(generateMarketPlayers(50, r))) {
        expect(p.askingSalary).toBeGreaterThan(0);
      }
    });

    it("askingSalary increases with skill (higher skill → higher asking salary)", () => {
      // Generate many players and verify the correlation holds on average
      const r = createRandom(41);
      const players = Object.values(generateMarketPlayers(440, r));
      const lowSkill = players.filter((p) => p.skill <= 5);
      const highSkill = players.filter((p) => p.skill >= 15);
      if (lowSkill.length > 0 && highSkill.length > 0) {
        const avgLow = lowSkill.reduce((s, p) => s + p.askingSalary, 0) / lowSkill.length;
        const avgHigh = highSkill.reduce((s, p) => s + p.askingSalary, 0) / highSkill.length;
        expect(avgHigh).toBeGreaterThan(avgLow);
      }
    });

    it("psk=1 player has askingSalary ~100", () => {
      // At skill=1, neutral mods: 1^1.205 * 100 = 100
      let found = false;
      for (let seed = 0; seed < 30; seed++) {
        const r = createRandom(seed);
        for (const p of Object.values(generateMarketPlayers(440, r))) {
          if (p.skill === 1) {
            expect(p.askingSalary).toBeCloseTo(100, -2);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    });
  });

  describe("specialty — QB borsgene gate: only when psk > 6", () => {
    it("players with skill <= 6 always have specialty=null", () => {
      const r = createRandom(50);
      for (const p of Object.values(generateMarketPlayers(440, r))) {
        if (p.skill <= 6) {
          expect(p.specialty).toBeNull();
        }
      }
    });

    it("players with skill > 6 may have specialty=null (82% chance) or a valid specialty", () => {
      const r = createRandom(51);
      const withHighSkill = Object.values(generateMarketPlayers(440, r)).filter(
        (p) => p.skill > 6
      );
      expect(withHighSkill.length).toBeGreaterThan(0);
      for (const p of withHighSkill) {
        if (p.specialty !== null) {
          expect(VALID_SPECIALTIES).toContain(p.specialty);
        }
      }
    });

    it("greedySurfer is the most likely specialty (QB: < 11 → spe=8, so 10% when psk>6)", () => {
      const r = createRandom(52);
      const players = Object.values(generateMarketPlayers(2000, r)).filter(
        (p) => p.skill > 6 && p.specialty !== null
      );
      const counts: Record<string, number> = {
        greedySurfer: 0,
        enforcer: 0,
        foulMouth: 0,
        evangelist: 0
      };
      for (const p of players) {
        if (p.specialty) counts[p.specialty] = (counts[p.specialty] ?? 0) + 1;
      }
      // greedySurfer: roll 1..10 (10 values)
      // enforcer:     roll 11..15 (5 values)
      // foulMouth:    roll 16..18 (3 values)
      // evangelist:   roll 19..21 AND age>=30 (conditional)
      expect(counts.greedySurfer).toBeGreaterThan(counts.enforcer);
      expect(counts.enforcer).toBeGreaterThan(counts.foulMouth);
    });

    it("evangelist only applies to players aged >= 30 (QB: temp% < 22 AND age >= 30)", () => {
      const r = createRandom(53);
      const evangelists = Object.values(generateMarketPlayers(2000, r)).filter(
        (p) => p.specialty === "evangelist"
      );
      for (const p of evangelists) {
        expect(p.age).toBeGreaterThanOrEqual(30);
      }
    });
  });

  describe("nationality distribution", () => {
    it("Finnish players (FI) are the most common nationality", () => {
      const r = createRandom(60);
      const players = Object.values(generateMarketPlayers(440, r));
      const fiCount = players.filter((p) => p.nationality === "FI").length;
      const nonFiMax = Math.max(
        ...["SE", "DE", "RU", "CZ", "CA", "US"].map(
          (iso) => players.filter((p) => p.nationality === iso).length
        )
      );
      expect(fiCount).toBeGreaterThan(nonFiMax);
    });

    it("all players have a valid nationality (one of the 17 QB nations)", () => {
      const validIsos = new Set([
        "FI", "SE", "DE", "IT", "RU", "CZ", "EE", "LV",
        "CA", "US", "CH", "SK", "JP", "NO", "FR", "AT", "PL"
      ]);
      const r = createRandom(61);
      for (const p of Object.values(generateMarketPlayers(440, r))) {
        expect(validIsos.has(p.nationality)).toBe(true);
      }
    });
  });

  describe("player ids are unique", () => {
    it("all player map keys are distinct", () => {
      const r = createRandom(70);
      const players = generateMarketPlayers(440, r);
      const ids = Object.keys(players);
      expect(new Set(ids).size).toBe(440);
    });
  });

  describe("determinism", () => {
    it("produces identical output for the same seed", () => {
      const r1 = createRandom(99);
      const r2 = createRandom(99);
      const p1 = Object.values(generateMarketPlayers(20, r1));
      const p2 = Object.values(generateMarketPlayers(20, r2));
      expect(p1.map((p) => p.skill)).toEqual(p2.map((p) => p.skill));
      expect(p1.map((p) => p.age)).toEqual(p2.map((p) => p.age));
      expect(p1.map((p) => p.specialty)).toEqual(p2.map((p) => p.specialty));
    });
  });
});
