import { describe, it, expect } from "vitest";
import calendar from "./calendar";
import { rawCalendar } from "@/data/mhm2000/calendar";

/**
 * MHM 2000 calendar tests.
 *
 * Source of truth: KIERO.M2K (99 records) + a hand-added meta round 0
 * that performs the start-of-season seeding before any KIERO row runs.
 * The meta round is currently a workaround for the round/phase model;
 * once phases can do the seeding themselves, it'll go away. Until
 * then, **every KIERO index N maps to calendar index N+1**.
 *
 * If a test here fails, decide carefully:
 *   - Is the decoded data wrong?  → fix mhm2000/calendar.ts
 *   - Is the test wrong?           → fix the test (only with QB evidence)
 */
describe("MHM 2000 calendar", () => {
  it("has 100 rounds (1 meta seed round + 99 KIERO rows), indexed 0..99", () => {
    expect(calendar).toHaveLength(100);
    calendar.forEach((entry, i) => {
      expect(entry.round).toBe(i);
    });
  });

  it("matches the raw KIERO.M2K record count + 1 meta round", () => {
    expect(calendar).toHaveLength(rawCalendar.length + 1);
  });

  describe("meta seed round", () => {
    it("round 0 seeds phase 0 of every season-long competition", () => {
      const seedIds = calendar[0].seed.map((s) => s.competition);
      expect(seedIds).toEqual(
        expect.arrayContaining([
          "phl",
          "division",
          "mutasarja",
          "ehl",
          "practice"
        ])
      );
    });

    it("round 0 plays no games", () => {
      expect(calendar[0].gamedays).toEqual([]);
    });
  });

  describe("preseason (rounds 1..10)", () => {
    it("rounds 1..6 are preseason filler (type 99) with no gamedays", () => {
      for (let i = 1; i <= 6; i++) {
        const entry = calendar[i];
        expect(entry.gamedays).toEqual([]);
        expect(entry.transferMarket).toBe(true);
      }
    });

    it("rounds 7..10 are training matches (type 4) with `practice` gameday", () => {
      for (let i = 7; i <= 10; i++) {
        const entry = calendar[i];
        expect(entry.gamedays).toEqual(["practice"]);
      }
    });

    it("all 10 preseason rounds (1..10) carry the season_tickets tag", () => {
      for (let i = 1; i <= 10; i++) {
        expect(calendar[i].tags).toContain("season_tickets");
      }
    });
  });

  describe("regular season", () => {
    it("round 11 is the first PHL/Divisioona/Mutasarja gameday", () => {
      expect(calendar[11].gamedays).toEqual(["phl", "division", "mutasarja"]);
    });

    it("EHL gamedays appear at known regular-season positions", () => {
      // KIERO indices 15, 19, 23, 30, 34, 39 → calendar 16, 20, 24, 31, 35, 40.
      const ehlRegularRounds = [16, 20, 24, 31, 35, 40];
      for (const round of ehlRegularRounds) {
        expect(calendar[round].gamedays).toEqual(["ehl"]);
      }
    });

    it("round 56 is the EHL final tournament (type 22)", () => {
      expect(calendar[56].gamedays).toEqual(["ehl"]);
      expect(calendar[56].title).toBe("EHL:n lopputurnaus");
    });

    it("round 47 is the Christmas invitation tournament window", () => {
      const entry = calendar[47];
      expect(entry.gamedays).toEqual(["tournaments"]);
      expect(entry.title).toBe("Kutsuturnaukset");
    });
  });

  describe("transfer market", () => {
    it("is open for rounds 0..57 (meta + preseason + first half)", () => {
      for (let i = 0; i <= 57; i++) {
        expect(calendar[i].transferMarket).toBe(true);
      }
    });

    it("is closed from round 58 onward", () => {
      for (let i = 58; i < calendar.length; i++) {
        expect(calendar[i].transferMarket).toBe(false);
      }
    });
  });

  describe("crisis meeting", () => {
    it("is true for every round (per MHM 2000 spec)", () => {
      for (const entry of calendar) {
        expect(entry.crisisMeeting).toBe(true);
      }
    });
  });

  describe("playoffs", () => {
    it("round 78 is the QF draw — no games", () => {
      expect(calendar[78].gamedays).toEqual([]);
      expect(calendar[78].title).toBe("Puolivälieräpläjäys");
    });

    it("rounds 79..83 are the five QF games (best-of-5)", () => {
      for (let i = 79; i <= 83; i++) {
        expect(calendar[i].gamedays).toEqual(["phl", "division", "mutasarja"]);
      }
    });

    it("round 84 is the SF draw, rounds 85..89 are the five SF games", () => {
      expect(calendar[84].gamedays).toEqual([]);
      expect(calendar[84].title).toBe("Välieräpläjäys");
      for (let i = 85; i <= 89; i++) {
        expect(calendar[i].gamedays).toEqual(["phl", "division", "mutasarja"]);
      }
    });

    it("round 90 is the Final draw, rounds 91..95 are the five Final games", () => {
      expect(calendar[90].gamedays).toEqual([]);
      expect(calendar[90].title).toBe("Finaalipläjäys");
      for (let i = 91; i <= 95; i++) {
        expect(calendar[i].gamedays).toEqual(["phl", "division", "mutasarja"]);
      }
    });
  });

  describe("end of season", () => {
    it("rounds 96 and 97 are the two-leg PA Cup final", () => {
      expect(calendar[96].gamedays).toEqual(["cup"]);
      expect(calendar[97].gamedays).toEqual(["cup"]);
    });

    it("round 98 is the season-end gala (type 47)", () => {
      const entry = calendar[98];
      expect(entry.title).toBe("PHL:n juhlagaala");
      expect(entry.gamedays).toEqual([]);
      expect(entry.phases).toContain("gala");
    });

    it("round 99 is the season rollover (type 48)", () => {
      const entry = calendar[99];
      expect(entry.title).toBe("Uusi kausi");
      expect(entry.gamedays).toEqual([]);
      expect(entry.phases).toContain("action");
      expect(entry.tags).toContain("season-rollover");
    });
  });

  describe("createRandomEvent / pranks", () => {
    it("are true on every gameday round", () => {
      for (const entry of calendar) {
        if (entry.gamedays.length > 0) {
          expect(entry.createRandomEvent).toBe(true);
          expect(entry.pranks).toBe(true);
        }
      }
    });

    it("are false on draws / breaks / gala / rollover (no gamedays)", () => {
      const noEventTypes = [41, 43, 45, 47, 48, 96, 97, 99];
      // KIERO row N → calendar index N+1 (meta round 0 inserted).
      rawCalendar.forEach((raw, i) => {
        if (noEventTypes.includes(raw.type)) {
          expect(calendar[i + 1].createRandomEvent).toBe(false);
          expect(calendar[i + 1].pranks).toBe(false);
        }
      });
    });
  });

  describe("tags", () => {
    it("mark the playoffs", () => {
      for (let i = 78; i <= 95; i++) {
        expect(calendar[i].tags).toContain("playoffs");
      }
    });
  });
});
