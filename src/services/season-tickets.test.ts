import { describe, it, expect } from "vitest";
import { sellSeasonTickets, TICKET_PRICE } from "@/services/season-tickets";
import { fixedRandom, scriptedRandom } from "@/__tests__/factories";

/**
 * Common baseline params for a mid-tier PHL team with neutral form.
 * Override individual fields per test case.
 */
const baseline = () => ({
  seatedCount: 50, // 5000 actual seats
  seasonTickets: 0,
  tier: 1 as const,
  formAverage: 8, // neutral — sin2 = 0
  arenaLevel: 3, // neutral — (taso - 3) = 0
  managerCharisma: 0, // neutral — ×1.00
  rosterCharismaAvg: 10, // neutral — (10 - 10) / 50 = 0
  random: fixedRandom(0.5)
});

describe("sellSeasonTickets", () => {
  describe("basic behavior", () => {
    it("sells tickets and returns revenue", () => {
      const result = sellSeasonTickets(baseline());
      expect(result.ticketsSold).toBeGreaterThan(0);
      expect(result.revenue).toBe(result.ticketsSold * TICKET_PRICE[1] * 22);
    });

    it("returns zero when arena is already full", () => {
      const result = sellSeasonTickets({
        ...baseline(),
        seatedCount: 10, // 1000 seats
        seasonTickets: 1000 // all taken
      });
      expect(result.ticketsSold).toBe(0);
      expect(result.revenue).toBe(0);
    });

    it("caps tickets at remaining seated capacity", () => {
      const result = sellSeasonTickets({
        ...baseline(),
        seatedCount: 1, // 100 seats
        seasonTickets: 90, // only 10 left
        formAverage: 1 // excellent form → wants to sell lots
      });
      expect(result.ticketsSold).toBeLessThanOrEqual(10);
    });
  });

  describe("league tier base values", () => {
    it("PHL teams sell more than Divisioona teams", () => {
      const random = fixedRandom(0.5);
      const phl = sellSeasonTickets({ ...baseline(), tier: 1, random });
      const div = sellSeasonTickets({ ...baseline(), tier: 2, random });
      expect(phl.ticketsSold).toBeGreaterThan(div.ticketsSold);
    });

    it("Divisioona teams sell more than Mutasarja teams", () => {
      const random = fixedRandom(0.5);
      const div = sellSeasonTickets({ ...baseline(), tier: 2, random });
      const mut = sellSeasonTickets({ ...baseline(), tier: 3, random });
      expect(div.ticketsSold).toBeGreaterThan(mut.ticketsSold);
    });

    it("revenue uses correct ticket price per tier", () => {
      for (const tier of [1, 2, 3] as const) {
        const result = sellSeasonTickets({
          ...baseline(),
          tier,
          random: fixedRandom(0.5)
        });
        expect(result.revenue).toBe(
          result.ticketsSold * TICKET_PRICE[tier] * 22
        );
      }
    });
  });

  describe("form scaling", () => {
    it("good form (low position) sells more tickets than poor form", () => {
      const random = fixedRandom(0.5);
      const good = sellSeasonTickets({
        ...baseline(),
        formAverage: 2, // top of the table
        random
      });
      const poor = sellSeasonTickets({
        ...baseline(),
        formAverage: 14, // bottom of the table
        random
      });
      expect(good.ticketsSold).toBeGreaterThan(poor.ticketsSold);
    });

    it("neutral form (sin2 = 0) produces the base value", () => {
      // With sin2 = 0: d = c^(1+0/100) = c^1 = c = 110 for PHL
      // Multiplied by 1 (all multipliers neutral), noise at midpoint
      const result = sellSeasonTickets(baseline());
      // Should be approximately 110 ± noise
      expect(result.ticketsSold).toBeGreaterThanOrEqual(100);
      expect(result.ticketsSold).toBeLessThanOrEqual(120);
    });
  });

  describe("arena level multiplier", () => {
    it("higher arena level sells more tickets", () => {
      const random = fixedRandom(0.5);
      const luxury = sellSeasonTickets({
        ...baseline(),
        arenaLevel: 6,
        formAverage: 4, // need sin2 > 0 for arena level to matter
        random
      });
      const basic = sellSeasonTickets({
        ...baseline(),
        arenaLevel: 1,
        formAverage: 4,
        random
      });
      expect(luxury.ticketsSold).toBeGreaterThan(basic.ticketsSold);
    });

    it("arena level has minimal effect when form is poor", () => {
      // When sin2 <= 0, sin3 = 1 + (taso - 3) * 0.005
      // For taso = 6: sin3 = 1.015; taso = 1: sin3 = 0.99
      const random = fixedRandom(0.5);
      const luxury = sellSeasonTickets({
        ...baseline(),
        arenaLevel: 6,
        formAverage: 12, // poor form
        random
      });
      const basic = sellSeasonTickets({
        ...baseline(),
        arenaLevel: 1,
        formAverage: 12,
        random
      });
      // The difference should be small
      const ratio = luxury.ticketsSold / basic.ticketsSold;
      expect(ratio).toBeGreaterThan(0.9);
      expect(ratio).toBeLessThan(1.2);
    });
  });

  describe("manager charisma", () => {
    it("positive charisma sells more than negative", () => {
      const random = fixedRandom(0.5);
      const charismatic = sellSeasonTickets({
        ...baseline(),
        managerCharisma: 3,
        random
      });
      const dull = sellSeasonTickets({
        ...baseline(),
        managerCharisma: -3,
        random
      });
      expect(charismatic.ticketsSold).toBeGreaterThan(dull.ticketsSold);
    });
  });

  describe("roster charisma average", () => {
    it("neutral roster charisma (10) has no effect", () => {
      const random = fixedRandom(0.5);
      const result = sellSeasonTickets({
        ...baseline(),
        rosterCharismaAvg: 10,
        random
      });
      const base = sellSeasonTickets(baseline());
      expect(result.ticketsSold).toBe(base.ticketsSold);
    });

    it("high roster charisma sells more than low", () => {
      const random = fixedRandom(0.5);
      const star = sellSeasonTickets({
        ...baseline(),
        rosterCharismaAvg: 14, // +8%
        random
      });
      const dud = sellSeasonTickets({
        ...baseline(),
        rosterCharismaAvg: 6, // -8%
        random
      });
      expect(star.ticketsSold).toBeGreaterThan(dud.ticketsSold);
    });
  });

  describe("boycott penalty", () => {
    it("boycott reduces tickets by 20%", () => {
      const random = fixedRandom(0.5);
      const normal = sellSeasonTickets({ ...baseline(), random });
      const boycotted = sellSeasonTickets({
        ...baseline(),
        boycott: 1,
        random
      });
      // Floor rounding means exact 0.8 ratio isn't guaranteed,
      // but boycotted should be noticeably less
      expect(boycotted.ticketsSold).toBeLessThan(normal.ticketsSold);
      expect(boycotted.ticketsSold).toBeGreaterThanOrEqual(
        Math.floor(normal.ticketsSold * 0.8) - 1
      );
    });

    it("boycott = 0 has no effect", () => {
      const random = fixedRandom(0.5);
      const normal = sellSeasonTickets({ ...baseline(), random });
      const noBoycott = sellSeasonTickets({
        ...baseline(),
        boycott: 0,
        random
      });
      expect(noBoycott.ticketsSold).toBe(normal.ticketsSold);
    });
  });

  describe("randomness", () => {
    it("uses two random calls: one real, one integer", () => {
      // Verify the function consumes exactly the right random calls
      const random = scriptedRandom({
        real: [0.5], // noise band
        integer: [1] // jitter (maps to 0 after -1)
      });
      // Should not throw — exactly 2 calls consumed
      const result = sellSeasonTickets({ ...baseline(), random });
      expect(result.ticketsSold).toBeGreaterThan(0);
    });

    it("low RND produces fewer tickets, high RND produces more", () => {
      const low = sellSeasonTickets({
        ...baseline(),
        random: scriptedRandom({ real: [0.0], integer: [0] }) // min noise, -1 jitter
      });
      const high = sellSeasonTickets({
        ...baseline(),
        random: scriptedRandom({ real: [1.0], integer: [2] }) // max noise, +1 jitter
      });
      expect(high.ticketsSold).toBeGreaterThan(low.ticketsSold);
    });
  });

  describe("accumulation over 10 preseason rounds", () => {
    it("calling 10 times accumulates tickets correctly", () => {
      let totalTickets = 0;
      let totalRevenue = 0;

      for (let round = 0; round < 10; round++) {
        const result = sellSeasonTickets({
          ...baseline(),
          seasonTickets: totalTickets,
          random: fixedRandom(0.5)
        });
        totalTickets += result.ticketsSold;
        totalRevenue += result.revenue;
      }

      expect(totalTickets).toBeGreaterThan(0);
      expect(totalRevenue).toBe(totalTickets * TICKET_PRICE[1] * 22);
      // With 5000 seats and ~110 per batch, ~1100 total
      expect(totalTickets).toBeLessThanOrEqual(5000);
    });

    it("eventually saturates at seated capacity", () => {
      let totalTickets = 0;

      // Small arena: 500 seats, excellent form → sells fast
      for (let round = 0; round < 10; round++) {
        const result = sellSeasonTickets({
          ...baseline(),
          seatedCount: 5, // 500 seats
          seasonTickets: totalTickets,
          formAverage: 1, // excellent form
          arenaLevel: 6,
          random: fixedRandom(0.5)
        });
        totalTickets += result.ticketsSold;
      }

      expect(totalTickets).toBeLessThanOrEqual(500);
    });
  });

  describe("edge cases", () => {
    it("handles negative remaining seats gracefully", () => {
      const result = sellSeasonTickets({
        ...baseline(),
        seatedCount: 5, // 500 seats
        seasonTickets: 600 // already oversold somehow
      });
      expect(result.ticketsSold).toBe(0);
      expect(result.revenue).toBe(0);
    });

    it("handles very poor form without going negative", () => {
      // formAverage = 16 (dead last) → sin2 = -8 → c^(1 + -8/100) = c^0.92
      const result = sellSeasonTickets({
        ...baseline(),
        tier: 3, // Mut base 50
        formAverage: 16,
        arenaLevel: 1,
        managerCharisma: -3,
        random: scriptedRandom({ real: [0.0], integer: [0] })
      });
      expect(result.ticketsSold).toBeGreaterThanOrEqual(0);
    });
  });
});
