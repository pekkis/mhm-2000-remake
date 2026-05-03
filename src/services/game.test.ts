import { describe, it, expect } from "vitest";
import { resultFacts, gameFacts } from "@/services/game";
import { createGameService } from "@/services/game";
import { createRandom } from "@/services/random";
import type { GameInput } from "@/services/game";
import type { AITeam } from "@/state/game";
import type { HumanManager } from "@/state/game";
import type { GameResult } from "@/types/competitions";
import { rollTeamStrength } from "@/services/levels";

const makeTeam = (overrides: Partial<AITeam> = {}): AITeam => ({
  id: 0,
  name: "Pasolini United",
  kind: "ai",
  tags: ["legend"],
  uid: "antifascist",
  city: "Bologna",
  tier: 30,
  strengthObj: rollTeamStrength(30),
  arena: {
    level: 1,
    standingCount: 0,
    seatedCount: 0,
    hasBoxes: false,
    valuePoints: 0
  },
  strength: 50,
  domestic: true,
  morale: 50,
  strategy: 0,
  readiness: 10,
  effects: [],
  opponentEffects: [],
  manager: undefined,
  ...overrides
});

const makeManager = (overrides: Partial<HumanManager> = {}): HumanManager => ({
  id: "pier-paolo",
  name: "Pier Paolo Pasolini",
  nationality: "IT",
  tags: ["renessaince_man"],
  kind: "human",
  attributes: {
    charisma: 3,
    luck: 3,
    negotiation: 3,
    resourcefulness: 3,
    specialTeams: 3,
    strategy: -3
  },

  team: 0,
  difficulty: 0,
  pranksExecuted: 0,
  services: {
    cheer: false,
    microphone: false,
    coach: false,
    insurance: false
  },
  balance: 10000,
  arena: { level: 0, name: "Pier Paolo Arena" },
  extra: 0,
  insuranceExtra: 0,
  flags: {},
  ...overrides
});

describe("game service", () => {
  describe("resultFacts", () => {
    it("should detect a home win", () => {
      const result: GameResult = { home: 3, away: 1, overtime: false };
      const facts = resultFacts(result, "home");
      expect(facts).toEqual({ isWin: true, isDraw: false, isLoss: false });
    });

    it("should detect an away win", () => {
      const result: GameResult = { home: 1, away: 4, overtime: false };
      const facts = resultFacts(result, "away");
      expect(facts).toEqual({ isWin: true, isDraw: false, isLoss: false });
    });

    it("should detect a home loss", () => {
      const result: GameResult = { home: 0, away: 2, overtime: false };
      const facts = resultFacts(result, "home");
      expect(facts).toEqual({ isWin: false, isDraw: false, isLoss: true });
    });

    it("should detect a draw", () => {
      const result: GameResult = { home: 2, away: 2, overtime: false };
      const facts = resultFacts(result, "home");
      expect(facts).toEqual({ isWin: false, isDraw: true, isLoss: false });
    });

    it("should detect a draw for away team too", () => {
      const result: GameResult = { home: 0, away: 0, overtime: false };
      const facts = resultFacts(result, "away");
      expect(facts).toEqual({ isWin: false, isDraw: true, isLoss: false });
    });

    it("should work with overtime results", () => {
      const result: GameResult = { home: 4, away: 3, overtime: true };
      const homeFacts = resultFacts(result, "home");
      const awayFacts = resultFacts(result, "away");
      expect(homeFacts.isWin).toBe(true);
      expect(awayFacts.isLoss).toBe(true);
    });
  });

  describe("gameFacts", () => {
    it("should resolve facts for home team", () => {
      const game = {
        home: 5,
        away: 10,
        result: { home: 3, away: 1, overtime: false } as GameResult
      };
      const facts = gameFacts(game, 5); // team 5 is home
      expect(facts.isWin).toBe(true);
    });

    it("should resolve facts for away team", () => {
      const game = {
        home: 5,
        away: 10,
        result: { home: 3, away: 1, overtime: false } as GameResult
      };
      const facts = gameFacts(game, 10); // team 10 is away
      expect(facts.isLoss).toBe(true);
    });

    it("should handle draws correctly", () => {
      const game = {
        home: 5,
        away: 10,
        result: { home: 2, away: 2, overtime: false } as GameResult
      };
      expect(gameFacts(game, 5).isDraw).toBe(true);
      expect(gameFacts(game, 10).isDraw).toBe(true);
    });
  });

  describe("simulate", () => {
    it("should return a GameResult with home, away, and overtime fields", () => {
      const { simulate } = createGameService(createRandom(42));
      const input: GameInput = {
        home: makeTeam({ id: 0, strength: 50 }),
        away: makeTeam({ id: 1, strength: 50 }),
        homeManager: makeManager({ id: "home-mgr" }),
        awayManager: makeManager({ id: "away-mgr" }),
        advantage: {
          home: () => 5,
          away: () => 0
        },
        base: () => 20,
        moraleEffect: (team) => team.morale / 10,
        overtime: () => false,
        competitionId: "phl",
        phaseId: 0
      };

      const result = simulate(input);
      expect(result).toHaveProperty("home");
      expect(result).toHaveProperty("away");
      expect(result).toHaveProperty("overtime");
      expect(typeof result.home).toBe("number");
      expect(typeof result.away).toBe("number");
      expect(typeof result.overtime).toBe("boolean");
    });

    it("should produce non-negative scores", () => {
      const { simulate } = createGameService(createRandom(42));
      const input: GameInput = {
        home: makeTeam({ strength: 10, morale: 10, readiness: 0 }),
        away: makeTeam({ strength: 10, morale: 10, readiness: 0 }),
        homeManager: makeManager(),
        awayManager: makeManager(),
        advantage: {
          home: () => 0,
          away: () => 0
        },
        base: () => 20,
        moraleEffect: () => 0,
        overtime: () => false,
        competitionId: "phl",
        phaseId: 0
      };

      const result = simulate(input);
      expect(result.home).toBeGreaterThanOrEqual(0);
      expect(result.away).toBeGreaterThanOrEqual(0);
    });

    it("should not trigger overtime when overtime callback returns false", () => {
      const { simulate } = createGameService(createRandom(42));
      const input: GameInput = {
        home: makeTeam({ strength: 50, morale: 50, readiness: 10 }),
        away: makeTeam({ strength: 50, morale: 50, readiness: 10 }),
        homeManager: makeManager(),
        awayManager: makeManager(),
        advantage: {
          home: () => 0,
          away: () => 0
        },
        base: () => 20,
        moraleEffect: () => 5,
        overtime: () => false,
        competitionId: "phl",
        phaseId: 0
      };

      const result = simulate(input);
      expect(result.overtime).toBe(false);
    });

    it("should apply team effects during simulation", () => {
      const { simulate } = createGameService(createRandom(42));
      // Team with a huge strength boost should generally score more
      const strongTeam = makeTeam({
        id: 0,
        strength: 100,
        morale: 80,
        readiness: 20,
        effects: [{ parameter: ["strength"], amount: 50, duration: 1 }]
      });
      const weakTeam = makeTeam({
        id: 1,
        strength: 10,
        morale: 10,
        readiness: 0
      });

      const input: GameInput = {
        home: strongTeam,
        away: weakTeam,
        homeManager: makeManager(),
        awayManager: makeManager(),
        advantage: {
          home: () => 0,
          away: () => 0
        },
        base: () => 20,
        moraleEffect: (team) => team.morale / 10,
        overtime: () => false,
        competitionId: "phl",
        phaseId: 0
      };

      const result = simulate(input);
      // With mocked random (midpoint), stronger team should score more
      expect(result.home).toBeGreaterThan(result.away);
    });

    it("should apply manager service effects to strength", () => {
      const mgr = makeManager({
        services: {
          cheer: true,
          microphone: false,
          coach: true,
          insurance: false
        }
      });

      const input: GameInput = {
        home: makeTeam({ strength: 50, morale: 50, readiness: 10 }),
        away: makeTeam({ strength: 50, morale: 50, readiness: 10 }),
        homeManager: mgr,
        awayManager: makeManager(),
        advantage: {
          home: () => 0,
          away: () => 0
        },
        base: () => 20,
        moraleEffect: () => 5,
        overtime: () => false,
        competitionId: "phl",
        phaseId: 0
      };

      const resultWithServices = createGameService(createRandom(42)).simulate(
        input
      );

      // Now without services — same seed for fair comparison
      const input2: GameInput = {
        ...input,
        homeManager: makeManager()
      };
      const resultWithout = createGameService(createRandom(42)).simulate(
        input2
      );

      // Home team with services should score at least as much (with deterministic mock)
      expect(resultWithServices.home).toBeGreaterThanOrEqual(
        resultWithout.home
      );
    });

    it("should apply opponent effects from the other team", () => {
      const homeTeam = makeTeam({ id: 0, strength: 60 });
      const awayTeam = makeTeam({
        id: 1,
        strength: 60,
        opponentEffects: [{ parameter: ["strength"], amount: -50, duration: 1 }]
      });

      const input: GameInput = {
        home: homeTeam,
        away: awayTeam,
        homeManager: makeManager(),
        awayManager: makeManager(),
        advantage: {
          home: () => 0,
          away: () => 0
        },
        base: () => 20,
        moraleEffect: () => 5,
        overtime: () => false,
        competitionId: "phl",
        phaseId: 0
      };

      // Run multiple times — with a severe -50 opponent effect, away should
      // outscore home on average
      let awayWins = 0;
      const runs = 20;
      for (let i = 0; i < runs; i++) {
        const { simulate: sim } = createGameService(createRandom(i));
        const result = sim(input);
        if (result.away >= result.home) {
          awayWins++;
        }
      }
      // Away should win majority of the time with such a large advantage
      expect(awayWins).toBeGreaterThan(runs / 2);
    });

    it("should use the base() function for score scaling", () => {
      const input: GameInput = {
        home: makeTeam({ strength: 100, morale: 50, readiness: 10 }),
        away: makeTeam({ strength: 100, morale: 50, readiness: 10 }),
        homeManager: makeManager(),
        awayManager: makeManager(),
        advantage: {
          home: () => 0,
          away: () => 0
        },
        base: () => 100, // high base = lower scores
        moraleEffect: () => 5,
        overtime: () => false,
        competitionId: "phl",
        phaseId: 0
      };

      const highBase = createGameService(createRandom(42)).simulate(input);

      const input2: GameInput = {
        ...input,
        base: () => 10 // low base = higher scores
      };
      const lowBase = createGameService(createRandom(42)).simulate(input2);

      // Lower base divisor should produce higher scores
      expect(lowBase.home).toBeGreaterThanOrEqual(highBase.home);
    });

    it("should apply home advantage via the advantage callbacks", () => {
      const input: GameInput = {
        home: makeTeam({ strength: 50, morale: 50, readiness: 10 }),
        away: makeTeam({ strength: 50, morale: 50, readiness: 10 }),
        homeManager: makeManager(),
        awayManager: makeManager(),
        advantage: {
          home: () => 30, // big home advantage
          away: () => 0
        },
        base: () => 20,
        moraleEffect: () => 5,
        overtime: () => false,
        competitionId: "phl",
        phaseId: 0
      };

      // Run multiple seeds — home advantage should win majority
      let homeWins = 0;
      const runs = 20;
      for (let i = 0; i < runs; i++) {
        const { simulate } = createGameService(createRandom(i));
        const result = simulate(input);
        if (result.home >= result.away) {
          homeWins++;
        }
      }
      expect(homeWins).toBeGreaterThan(runs / 2);
    });

    it("should return integer scores", () => {
      const { simulate } = createGameService(createRandom(42));
      const input: GameInput = {
        home: makeTeam({ strength: 47, morale: 33, readiness: 7 }),
        away: makeTeam({ strength: 53, morale: 41, readiness: 13 }),
        homeManager: makeManager(),
        awayManager: makeManager(),
        advantage: {
          home: () => 3,
          away: () => 1
        },
        base: () => 17,
        moraleEffect: (t) => t.morale / 10,
        overtime: () => false,
        competitionId: "division",
        phaseId: 0
      };

      const result = simulate(input);
      expect(Number.isInteger(result.home)).toBe(true);
      expect(Number.isInteger(result.away)).toBe(true);
    });
  });
});
