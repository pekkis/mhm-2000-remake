import { describe, it, expect } from "vitest";
import calendar from "./calendar";

describe("calendar", () => {
  it("should have 75 rounds (0-74)", () => {
    expect(calendar).toHaveLength(75);
  });

  it("should have correct round indices", () => {
    calendar.forEach((entry, index) => {
      expect(entry.round).toBe(index);
    });
  });

  describe("round 0: start of season", () => {
    it("should include start_of_season and seed phases", () => {
      const entry = calendar[0];
      expect(entry.phases).toContain("start_of_season");
      expect(entry.phases).toContain("seed");
    });

    it("should NOT include action or gameday phases", () => {
      const entry = calendar[0];
      expect(entry.phases).not.toContain("action");
      expect(entry.phases).not.toContain("gameday");
    });

    it("should seed phl, division, and ehl competitions", () => {
      const entry = calendar[0];
      const competitionIds = entry.seed.map((s) => s.competition);
      expect(competitionIds).toContain("phl");
      expect(competitionIds).toContain("division");
      expect(competitionIds).toContain("ehl");
    });
  });

  describe("default PHL/Division rounds (1-4)", () => {
    it("should include all default phases", () => {
      const defaultPhases = [
        "action",
        "prank",
        "gameday",
        "calculations",
        "event_creation",
        "event",
        "news",
        "seed"
      ];

      for (let i = 1; i <= 4; i++) {
        const entry = calendar[i];
        for (const phase of defaultPhases) {
          expect(entry.phases).toContain(phase);
        }
        expect(entry.gamedays).toContain("phl");
        expect(entry.gamedays).toContain("division");
      }
    });
  });

  describe("EHL rounds (5, 10, 15, 20, 25, 31)", () => {
    const ehlRounds = [5, 10, 15, 20, 25, 31];
    const ehlPhases = ["action", "gameday", "event", "news"];

    it("should have EHL-specific phases", () => {
      for (const round of ehlRounds) {
        const entry = calendar[round];
        expect(entry.phases).toEqual(ehlPhases);
        expect(entry.gamedays).toContain("ehl");
      }
    });
  });

  describe("round 13: invitations", () => {
    it("should include invitations_create phase", () => {
      expect(calendar[13].phases).toContain("invitations_create");
    });
  });

  describe("round 28: Christmas break (tournament)", () => {
    it("should have tournaments as gameday", () => {
      expect(calendar[28].gamedays).toContain("tournaments");
    });

    it("should have title 'Joulutauko'", () => {
      expect(calendar[28].title).toBe("Joulutauko");
    });
  });

  describe("final round (74): world championships", () => {
    it("should include action and end_of_season phases", () => {
      const entry = calendar[74];
      expect(entry.phases).toContain("action");
      expect(entry.phases).toContain("end_of_season");
    });

    it("should have title 'Maailmanmestaruuskisat'", () => {
      const entry = calendar[74];
      expect(entry.title).toBe("Maailmanmestaruuskisat");
    });
  });

  describe("deadline flags", () => {
    it("should have transferMarket=true for rounds 0-30", () => {
      for (let i = 0; i <= 30; i++) {
        expect(calendar[i].transferMarket).toBe(true);
      }
    });

    it("should have transferMarket=false for rounds 31+", () => {
      for (let i = 31; i < calendar.length; i++) {
        expect(calendar[i].transferMarket).toBe(false);
      }
    });

    it("should have crisisMeeting=true for rounds 0-52", () => {
      for (let i = 0; i <= 52; i++) {
        expect(calendar[i].crisisMeeting).toBe(true);
      }
    });

    it("should have crisisMeeting=false for rounds 53+", () => {
      for (let i = 53; i < calendar.length; i++) {
        expect(calendar[i].crisisMeeting).toBe(false);
      }
    });

    it("should have createRandomEvent=true for rounds 0-53", () => {
      for (let i = 0; i <= 53; i++) {
        expect(calendar[i].createRandomEvent).toBe(true);
      }
    });

    it("should have pranks=true for rounds 0-53", () => {
      for (let i = 0; i <= 53; i++) {
        expect(calendar[i].pranks).toBe(true);
      }
    });
  });

  describe("playoff structure", () => {
    it("round 54 should seed PHL and division phase 1 (quarterfinals)", () => {
      const entry = calendar[54];
      expect(entry.title).toBe("Playoff-pläjäys");
      const phlSeed = entry.seed.find((s) => s.competition === "phl");
      const divSeed = entry.seed.find((s) => s.competition === "division");
      expect(phlSeed?.phase).toBe(1);
      expect(divSeed?.phase).toBe(1);
    });

    it("round 60 should seed semifinals (phase 2)", () => {
      const entry = calendar[60];
      expect(entry.title).toBe("Semifinaali-pläjäys");
      const phlSeed = entry.seed.find((s) => s.competition === "phl");
      expect(phlSeed?.phase).toBe(2);
    });

    it("round 66 should seed finals (phase 3) and include gala", () => {
      const entry = calendar[66];
      expect(entry.title).toBe("Finaali-pläjäys");
      expect(entry.phases).toContain("gala");
      const phlSeed = entry.seed.find((s) => s.competition === "phl");
      expect(phlSeed?.phase).toBe(3);
    });
  });

  describe("every round has at least one phase", () => {
    it("should never have an empty phases array", () => {
      calendar.forEach((entry, index) => {
        expect(
          entry.phases.length,
          `Round ${index} has no phases`
        ).toBeGreaterThan(0);
      });
    });
  });
});
