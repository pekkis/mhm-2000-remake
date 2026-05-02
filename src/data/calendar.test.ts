import { describe, it, expect } from "vitest";
import calendar from "./calendar";
import { rawCalendar } from "@/data/mhm2000/calendar";

/**
 * MHM 2000 calendar tests.
 *
 * Source of truth: KIERO.M2K (99 records, three CSV columns), decoded
 * verbatim into `src/data/mhm2000/calendar.ts` and transformed into
 * runtime `CalendarEntry`s by `parse-calendar.ts`. These tests assert
 * the structural shape we expect from that pipeline and a handful of
 * known landmarks (rounds we've cross-referenced against the QB SUBs).
 *
 * If a test here fails, decide carefully:
 *   - Is the parser wrong?      → fix parse-calendar.ts
 *   - Is the decoded data wrong? → fix mhm2000/calendar.ts
 *   - Is the test wrong?         → fix the test (only with QB evidence)
 */
describe("MHM 2000 calendar", () => {
  it("has 99 rounds, indexed 0..98", () => {
    expect(calendar).toHaveLength(99);
    calendar.forEach((entry, i) => {
      expect(entry.round).toBe(i);
    });
  });

  it("matches the raw KIERO.M2K record count one-for-one", () => {
    expect(calendar).toHaveLength(rawCalendar.length);
  });

  describe("preseason (rounds 0..9)", () => {
    it("rounds 0..5 are preseason filler (type 99) with no gamedays", () => {
      for (let i = 0; i <= 5; i++) {
        const entry = calendar[i];
        expect(entry.gamedays).toEqual([]);
        expect(entry.transferMarket).toBe(true);
      }
    });

    it("rounds 6..9 are training matches (type 4) with `practice` gameday", () => {
      for (let i = 6; i <= 9; i++) {
        const entry = calendar[i];
        expect(entry.gamedays).toEqual(["practice"]);
      }
    });
  });

  describe("regular season", () => {
    it("round 10 is the first PHL/Divisioona/Mutasarja gameday", () => {
      expect(calendar[10].gamedays).toEqual(["phl", "division", "mutasarja"]);
    });

    it("EHL gamedays appear at known regular-season positions", () => {
      // From the decoded KIERO.M2K (qbIndex offset by +9), kiero=2 sits
      // at indices 15, 19, 23, 30, 34, 39 (and 55 = type 22 final tournament).
      const ehlRegularRounds = [15, 19, 23, 30, 34, 39];
      for (const round of ehlRegularRounds) {
        expect(calendar[round].gamedays).toEqual(["ehl"]);
      }
    });

    it("round 55 is the EHL final tournament (type 22)", () => {
      expect(calendar[55].gamedays).toEqual(["ehl"]);
      expect(calendar[55].title).toBe("EHL:n lopputurnaus");
    });

    it("round 46 is the Christmas invitation tournament window", () => {
      const entry = calendar[46];
      expect(entry.gamedays).toEqual(["tournaments"]);
      expect(entry.title).toBe("Kutsuturnaukset");
    });
  });

  describe("transfer market", () => {
    it("is open for rounds 0..56 (preseason + first half)", () => {
      for (let i = 0; i <= 56; i++) {
        expect(calendar[i].transferMarket).toBe(true);
      }
    });

    it("is closed from round 57 onward", () => {
      for (let i = 57; i < calendar.length; i++) {
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
    it("round 77 is the QF draw — no games", () => {
      expect(calendar[77].gamedays).toEqual([]);
      expect(calendar[77].title).toBe("Puolivälieräpläjäys");
    });

    it("rounds 78..82 are the five QF games (best-of-5)", () => {
      for (let i = 78; i <= 82; i++) {
        expect(calendar[i].gamedays).toEqual([
          "phl",
          "division",
          "mutasarja"
        ]);
      }
    });

    it("round 83 is the SF draw, rounds 84..88 are the five SF games", () => {
      expect(calendar[83].gamedays).toEqual([]);
      expect(calendar[83].title).toBe("Välieräpläjäys");
      for (let i = 84; i <= 88; i++) {
        expect(calendar[i].gamedays).toEqual([
          "phl",
          "division",
          "mutasarja"
        ]);
      }
    });

    it("round 89 is the Final draw, rounds 90..94 are the five Final games", () => {
      expect(calendar[89].gamedays).toEqual([]);
      expect(calendar[89].title).toBe("Finaalipläjäys");
      for (let i = 90; i <= 94; i++) {
        expect(calendar[i].gamedays).toEqual([
          "phl",
          "division",
          "mutasarja"
        ]);
      }
    });
  });

  describe("end of season", () => {
    it("rounds 95 and 96 are the two-leg Pekkalan Cup final", () => {
      expect(calendar[95].gamedays).toEqual(["cup"]);
      expect(calendar[96].gamedays).toEqual(["cup"]);
    });

    it("round 97 is the season-end gala (type 47)", () => {
      const entry = calendar[97];
      expect(entry.title).toBe("PHL:n juhlagaala");
      expect(entry.gamedays).toEqual([]);
      expect(entry.phases).toContain("gala");
    });

    it("round 98 is the season rollover (type 48)", () => {
      const entry = calendar[98];
      expect(entry.title).toBe("Uusi kausi");
      expect(entry.gamedays).toEqual([]);
      expect(entry.phases).toContain("end_of_season");
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
      rawCalendar.forEach((raw, i) => {
        if (noEventTypes.includes(raw.type)) {
          expect(calendar[i].createRandomEvent).toBe(false);
          expect(calendar[i].pranks).toBe(false);
        }
      });
    });
  });

  describe("tags", () => {
    it("flag the three unidentified preRound=3 rounds (indices 20..22)", () => {
      for (const i of [20, 21, 22]) {
        expect(calendar[i].tags).toContain("unknown:preRound=3");
      }
    });

    it("mark the playoffs", () => {
      for (let i = 77; i <= 94; i++) {
        expect(calendar[i].tags).toContain("playoffs");
      }
    });
  });
});
