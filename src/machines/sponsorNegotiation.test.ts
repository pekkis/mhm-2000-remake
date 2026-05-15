import { describe, it, expect } from "vitest";
import { createActor } from "xstate";
import { sponsorNegotiationMachine } from "./sponsorNegotiation";
import type { SponsorNegotiationInput } from "./sponsorNegotiation";
import {
  createHumanManager,
  createHumanTeam,
  scriptedRandom
} from "@/__tests__/factories";
import type { Competition, CompetitionId } from "@/types/competitions";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** Minimal competition record — only `teams` and `phase` matter. */
const stubCompetition = (
  id: CompetitionId,
  teams: number[] = [],
  phase = 0
): Competition => ({
  id,
  abbr: id,
  name: id,
  weight: 0,
  phase,
  teams,
  phases: [],
  meta: {}
});

/** Competitions where team 1 is in PHL and EHL-qualified. */
const phlEhlCompetitions = (): Record<CompetitionId, Competition> => ({
  phl: stubCompetition("phl", [0, 1, 2, 3]),
  division: stubCompetition("division"),
  mutasarja: stubCompetition("mutasarja"),
  ehl: stubCompetition("ehl", [1, 2]),
  tournaments: stubCompetition("tournaments"),
  cup: stubCompetition("cup"),
  practice: stubCompetition("practice")
});

/** Competitions where team 1 is in PHL, no EHL. */
const phlNoEhlCompetitions = (): Record<CompetitionId, Competition> => ({
  ...phlEhlCompetitions(),
  ehl: stubCompetition("ehl", [0, 2]) // team 1 not in EHL
});

/** Competitions where team 1 is in Division. */
const divisionCompetitions = (): Record<CompetitionId, Competition> => ({
  ...phlEhlCompetitions(),
  phl: stubCompetition("phl", [0, 2, 3]),
  division: stubCompetition("division", [1, 4, 5]),
  ehl: stubCompetition("ehl")
});

/**
 * Build a "high-roll" random that always succeeds attributeRoll
 * (integer returns 1, which is always < threshold) and returns
 * consistent values for reals and name-roll integers.
 */
const alwaysSucceedRandom = () =>
  scriptedRandom({
    // 3 name rolls (0..92), then 3×20 jitter reals use real queue,
    // then attributeRoll uses integer, bump rolls use integer+real
    integer: Array.from({ length: 200 }, () => 1),
    real: Array.from({ length: 200 }, () => 0.5)
  });

/**
 * Build a random that fails the first attributeRoll (integer = 100,
 * which is never < threshold).
 */
const buildInput = (
  overrides: Partial<SponsorNegotiationInput> = {}
): SponsorNegotiationInput => ({
  manager: createHumanManager(),
  team: createHumanTeam(),
  competitions: phlEhlCompetitions(),
  random: alwaysSucceedRandom(),
  ...overrides
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("sponsorNegotiationMachine", () => {
  describe("initialization", () => {
    it("starts in negotiating state with 3 candidates", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      expect(actor.getSnapshot().value).toBe("negotiating");
      expect(actor.getSnapshot().context.candidates).toHaveLength(3);
      expect(actor.getSnapshot().context.activeCandidateIndex).toBe(0);
    });

    it("initializes candidates with names and non-zero base payouts", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      for (const c of actor.getSnapshot().context.candidates) {
        expect(c.name).toBeTruthy();
        expect(c.walked).toBe(false);
        expect(c.haggleCount).toBe(0);
        // perMatchFee (slot 20) should be non-zero from base
        expect(c.payouts.perMatchFee).not.toBe(0);
      }
    });

    it("derives leagueTier = 1 for PHL team", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({ competitions: phlEhlCompetitions() })
      });
      actor.start();
      expect(actor.getSnapshot().context.leagueTier).toBe(1);
    });

    it("derives leagueTier = 2 for Division team", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({ competitions: divisionCompetitions() })
      });
      actor.start();
      expect(actor.getSnapshot().context.leagueTier).toBe(2);
    });

    it("includes EHL goal category when EHL-qualified", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({ competitions: phlEhlCompetitions() })
      });
      actor.start();

      const ehlCat = actor
        .getSnapshot()
        .context.categories.find((c) => c.id === "ehl");
      expect(ehlCat?.maxLevel).toBe(3);
    });

    it("excludes EHL goal category when not EHL-qualified", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({ competitions: phlNoEhlCompetitions() })
      });
      actor.start();

      const ehlCat = actor
        .getSnapshot()
        .context.categories.find((c) => c.id === "ehl");
      expect(ehlCat?.maxLevel).toBe(0);
    });
  });

  describe("SELECT_CANDIDATE", () => {
    it("switches active candidate index", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      actor.send({ type: "SELECT_CANDIDATE", index: 2 });
      expect(actor.getSnapshot().context.activeCandidateIndex).toBe(2);

      actor.send({ type: "SELECT_CANDIDATE", index: 1 });
      expect(actor.getSnapshot().context.activeCandidateIndex).toBe(1);
    });
  });

  describe("SET_GOAL", () => {
    it("changes goal level and rebuilds payouts", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      const payoutsBefore = {
        ...actor.getSnapshot().context.candidates[0].payouts
      };

      actor.send({ type: "SET_GOAL", category: "phl", level: 4 });

      const after = actor.getSnapshot().context.candidates[0];
      expect(after.goals.phl).toBe(4);
      // PHL level 4 should generate medal bonuses (slot 1)
      expect(after.payouts.phlChampion).not.toBe(payoutsBefore.phlChampion);
    });

    it("is blocked after first haggle on that candidate", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      actor.send({ type: "HAGGLE" });
      // Now try to set goal — should be rejected
      actor.send({ type: "SET_GOAL", category: "phl", level: 3 });
      // Goal should still be 1 (default)
      expect(actor.getSnapshot().context.candidates[0].goals.phl).toBe(1);
    });

    it("rejects levels above category maxLevel", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({ competitions: phlNoEhlCompetitions() })
      });
      actor.start();

      // EHL maxLevel = 0, so level 2 is out of range
      actor.send({ type: "SET_GOAL", category: "ehl", level: 2 });
      expect(actor.getSnapshot().context.candidates[0].goals.ehl).toBe(1);
    });

    it("does not affect other candidates", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      actor.send({ type: "SET_GOAL", category: "cup", level: 3 });

      expect(actor.getSnapshot().context.candidates[0].goals.cup).toBe(3);
      expect(actor.getSnapshot().context.candidates[1].goals.cup).toBe(1);
      expect(actor.getSnapshot().context.candidates[2].goals.cup).toBe(1);
    });
  });

  describe("HAGGLE", () => {
    it("increments haggleCount on success", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      actor.send({ type: "HAGGLE" });
      expect(actor.getSnapshot().context.candidates[0].haggleCount).toBe(1);
      expect(actor.getSnapshot().context.candidates[0].walked).toBe(false);
    });

    it("marks candidate as walked on failed roll", () => {
      // Need a random that fails the attributeRoll: roll >= threshold
      // attributeRoll: random.integer(1,100) < threshold.
      // With negotiation=0, base=97, threshold=97. Roll=100 → fail.
      // Name rolls use pick() (stubbed), jitter uses 60 reals.
      const ints = [
        // HAGGLE: attributeRoll integer = 100 → fail (100 < 97 is false)
        100
      ];
      const reals = Array.from({ length: 60 }, () => 0.5);

      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({
          random: scriptedRandom({ integer: ints, real: reals })
        })
      });
      actor.start();

      actor.send({ type: "HAGGLE" });

      const c0 = actor.getSnapshot().context.candidates[0];
      expect(c0.walked).toBe(true);
      expect(c0.payouts.perMatchFee).toBe(0);
    });

    it("is blocked when 2 candidates have walked", () => {
      // Roll both candidates 0 and 1 to walk, then try to haggle candidate 2
      // Name rolls use pick() (stubbed), only attributeRoll consumes integers.
      const ints = [
        100, // HAGGLE candidate 0 → fail
        100, // HAGGLE candidate 1 → fail
        1 // should never be consumed — HAGGLE blocked
      ];
      const reals = Array.from({ length: 60 }, () => 0.5);

      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({
          random: scriptedRandom({ integer: ints, real: reals })
        })
      });
      actor.start();

      // Walk candidate 0
      actor.send({ type: "HAGGLE" });
      expect(actor.getSnapshot().context.candidates[0].walked).toBe(true);

      // Walk candidate 1
      actor.send({ type: "SELECT_CANDIDATE", index: 1 });
      actor.send({ type: "HAGGLE" });
      expect(actor.getSnapshot().context.candidates[1].walked).toBe(true);

      // Try haggling candidate 2 — should be blocked
      actor.send({ type: "SELECT_CANDIDATE", index: 2 });
      actor.send({ type: "HAGGLE" });
      expect(actor.getSnapshot().context.candidates[2].haggleCount).toBe(0);
      expect(actor.getSnapshot().context.candidates[2].walked).toBe(false);
    });
  });

  describe("ACCEPT", () => {
    it("transitions to done and outputs the selected deal", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      const candidateName = actor.getSnapshot().context.candidates[0].name;
      const candidatePayouts = {
        ...actor.getSnapshot().context.candidates[0].payouts
      };

      actor.send({ type: "ACCEPT" });

      expect(actor.getSnapshot().value).toBe("done");
      expect(actor.getSnapshot().output?.deal.name).toBe(candidateName);
      expect(actor.getSnapshot().output?.deal.payouts).toEqual(
        candidatePayouts
      );
    });

    it("cannot accept a walked candidate", () => {
      const ints = [100]; // failed haggle (name rolls use pick stub)
      const reals = Array.from({ length: 60 }, () => 0.5);

      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({
          random: scriptedRandom({ integer: ints, real: reals })
        })
      });
      actor.start();

      actor.send({ type: "HAGGLE" }); // candidate 0 walks
      actor.send({ type: "ACCEPT" }); // should be rejected

      expect(actor.getSnapshot().value).toBe("negotiating");
    });
  });

  describe("all-three-walked safeguard", () => {
    it("is unreachable through normal events — third haggle is blocked", () => {
      // QB behavior: when 2 candidates have walked, NEUVOTTELE is greyed out.
      // So all-three-walked can never happen through gameplay. The `allWalked`
      // guard in the machine is purely defensive (persistence corruption, etc).
      // Name rolls use pick() (stubbed), only attributeRoll consumes integers.
      const ints = [
        100, // candidate 0 fails
        100 // candidate 1 fails
      ];
      const reals = Array.from({ length: 60 }, () => 0.5);

      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput({
          random: scriptedRandom({ integer: ints, real: reals })
        })
      });
      actor.start();

      actor.send({ type: "HAGGLE" }); // candidate 0 walks
      actor.send({ type: "SELECT_CANDIDATE", index: 1 });
      actor.send({ type: "HAGGLE" }); // candidate 1 walks

      // Third candidate can't be haggled — canHaggle is false
      actor.send({ type: "SELECT_CANDIDATE", index: 2 });
      actor.send({ type: "HAGGLE" }); // blocked
      expect(actor.getSnapshot().context.candidates[2].walked).toBe(false);

      // Only ACCEPT is available
      expect(actor.getSnapshot().value).toBe("negotiating");
    });
  });

  describe("goal-lock interaction with candidate switching", () => {
    it("allows goals on un-haggled candidate while another is locked", () => {
      const actor = createActor(sponsorNegotiationMachine, {
        input: buildInput()
      });
      actor.start();

      // Haggle candidate 0 — locks its goals
      actor.send({ type: "HAGGLE" });

      // Switch to candidate 1 — goals should still be settable
      actor.send({ type: "SELECT_CANDIDATE", index: 1 });
      actor.send({ type: "SET_GOAL", category: "phl", level: 3 });

      expect(actor.getSnapshot().context.candidates[1].goals.phl).toBe(3);
    });
  });
});
