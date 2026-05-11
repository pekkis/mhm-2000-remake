import { describe, it, expect } from "vitest";
import { createActor } from "xstate";
import { gameMachine } from "@/machines/game";
import { createDefaultGameContext } from "@/state";
import type { GameContext } from "@/state";
import type { HumanManager } from "@/state/game";
import { humanManagerById } from "@/machines/selectors";
import { emptyAchievements } from "@/services/empties";
import calendar from "@/data/calendar";

const buildContextWithManager = (): GameContext => {
  const ctx = createDefaultGameContext();
  const manager: HumanManager = {
    id: "pasolini",
    kind: "human",
    tags: ["poet", "director", "genious"],
    nationality: "IT",
    attributes: {
      charisma: 3,
      luck: 3,
      negotiation: 3,
      resourcefulness: 3,
      specialTeams: 3,
      strategy: 3
    },
    stats: {
      games: {},
      achievements: emptyAchievements()
    },
    name: "Pier Paolo Pasolini",
    team: 12,
    difficulty: 1,
    pranksExecuted: 0,
    balance: 1_000_000,
    flags: {},
    sponsor: undefined,
    completedActions: []
  };
  return {
    ...ctx,
    managers: {
      ...ctx.managers,
      pasolini: manager
    },
    human: { active: manager.id, order: [manager.id] },
    teams: ctx.teams.map((t) =>
      t.id === 12 ? { ...t, manager: manager.id } : t
    )
  };
};

const createTestActor = () => {
  const actor = createActor(gameMachine, { input: buildContextWithManager() });
  actor.start();
  return actor;
};

/** Advance the actor until the current round has `pranks: true`. */
const advanceToPranksRound = (actor: ReturnType<typeof createTestActor>) => {
  for (let i = 0; i < 50; i++) {
    const round = actor.getSnapshot().context.turn.round;
    if (calendar[round]?.pranks) {
      return;
    }
    actor.send({ type: "ADVANCE" });
  }
  throw new Error("Could not reach a pranks round within 50 advances");
};

describe("gameMachine", () => {
  describe("startup", () => {
    it("starts directly in_game with the supplied context", () => {
      const actor = createTestActor();
      const snap = actor.getSnapshot();
      expect(snap.matches("in_game")).toBe(true);
      expect(snap.context.human.active).toBe("pasolini");
    });
  });

  describe("in_game phase walk", () => {
    it("auto-runs start_of_season setup + seed on round 0 and lands in round 1 action", () => {
      const actor = createTestActor();
      // Round 0 calendar: ["start_of_season", "seed"] — both are now
      // non-interactive, so the machine cascades all the way through
      // round_end and into round 1's action phase.
      const snap = actor.getSnapshot();
      expect(snap.context.turn.round).toBe(1);
      expect(snap.matches({ in_game: { executing_phases: "action" } })).toBe(
        true
      );
    });

    it("season actions work from action phase browsing state", () => {
      const actor = createTestActor();
      const activeId = actor.getSnapshot().context.human.active!;

      // Confirm budget
      actor.send({
        type: "CONFIRM_BUDGET",
        payload: {
          manager: activeId,
          budget: {
            coaching: 3,
            goalieCoaching: 3,
            juniors: 3,
            health: 3,
            benefits: 3
          }
        }
      });

      // Select strategy
      actor.send({
        type: "SELECT_STRATEGY",
        payload: { manager: activeId, strategy: 2 }
      });

      // Skip championship bet
      actor.send({
        type: "SKIP_CHAMPION_BET",
        payload: { manager: activeId }
      });

      const snap = actor.getSnapshot();
      const m = snap.context.managers[activeId];
      expect(m.kind === "human" && m.completedActions).toEqual([
        "budget",
        "strategy",
        "championshipBet"
      ]);
      // Still in action phase — user hasn't ADVANCEd
      expect(snap.matches({ in_game: { executing_phases: "action" } })).toBe(
        true
      );
    });

    it("seed phase populates competitions[*].phases", () => {
      const actor = createTestActor();
      // Round 0 auto-runs start_of_season + seed, so competitions are
      // already seeded by the time we reach round 1's action phase.
      const { competitions } = actor.getSnapshot().context;
      expect(competitions.phl.phases.length).toBeGreaterThan(0);
      expect(competitions.division.phases.length).toBeGreaterThan(0);
      expect(competitions.ehl.phases.length).toBeGreaterThan(0);
    });
  });

  // TODO: prank tests skipped — pranks system is being redone
  describe.skip("ORDER_PRANK", () => {
    it("debits the manager, queues the prank, and bumps pranksExecuted", () => {
      const actor = createTestActor();
      advanceToPranksRound(actor);
      const activeId = actor.getSnapshot().context.human.active!;

      // Pasolini coaches team 12 → division. fixedMatch on division: 150000.
      const before = actor.getSnapshot().context;
      actor.send({
        type: "ORDER_PRANK",
        payload: { manager: activeId, type: "fixedMatch", victim: 7 }
      });

      const after = actor.getSnapshot().context;
      const m = humanManagerById(activeId)(after);
      expect(m.pranksExecuted).toBe(1);
      expect(m.balance).toBe(
        humanManagerById(activeId)(before).balance - 150000
      );
      expect(after.prank.pranks).toEqual([
        { manager: activeId, type: "fixedMatch", victim: 7 }
      ]);
    });

    it("free pranks (protest) leave balance untouched", () => {
      const actor = createTestActor();
      advanceToPranksRound(actor);
      const activeId = actor.getSnapshot().context.human.active!;
      const beforeBalance = humanManagerById(activeId)(
        actor.getSnapshot().context
      ).balance;

      actor.send({
        type: "ORDER_PRANK",
        payload: { manager: activeId, type: "protest", victim: 3 }
      });

      const m = humanManagerById(activeId)(actor.getSnapshot().context);
      expect(m.balance).toBe(beforeBalance);
      expect(m.pranksExecuted).toBe(1);
    });
  });
});
