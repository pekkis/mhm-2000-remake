import { describe, it, expect } from "vitest";
import { createActor } from "xstate";
import { gameMachine } from "@/machines/game";
import { createDefaultGameContext } from "@/state";
import type { GameContext, Manager } from "@/state";

const buildContextWithManager = (): GameContext => {
  const ctx = createDefaultGameContext();
  const manager: Manager = {
    id: "pasolini",
    name: "Pier Paolo Pasolini",
    team: 12,
    difficulty: 1,
    pranksExecuted: 0,
    services: {
      coach: false,
      insurance: false,
      microphone: false,
      cheer: false
    },
    balance: 1_000_000,
    arena: { name: "Stadio Olimpico", level: 0 },
    extra: 0,
    insuranceExtra: 0,
    flags: {}
  };
  return {
    ...ctx,
    manager: { active: manager.id, managers: { [manager.id]: manager } },
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

describe("gameMachine", () => {
  describe("startup", () => {
    it("starts directly in_game with the supplied context", () => {
      const actor = createTestActor();
      const snap = actor.getSnapshot();
      expect(snap.matches("in_game")).toBe(true);
      expect(snap.context.manager.active).toBe("pasolini");
    });
  });

  describe("in_game phase walk", () => {
    it("settles in start_of_season.select_strategy on round 0 (setup auto-advances)", () => {
      const actor = createTestActor();
      // Round 0 calendar: ["start_of_season", "seed"].
      // Machine cascades through earlier phase checks, enters start_of_season,
      // setup auto-advances, parks at select_strategy.
      expect(
        actor.getSnapshot().matches({
          in_game: { executing_phases: { start_of_season: "select_strategy" } }
        })
      ).toBe(true);
    });

    it("ADVANCE past championship_betting auto-runs seed and lands in round 1's action", () => {
      const actor = createTestActor();
      const activeId = actor.getSnapshot().context.manager.active!;
      actor.send({
        type: "SELECT_STRATEGY",
        payload: { manager: activeId, strategy: 2 }
      });
      expect(
        actor.getSnapshot().matches({
          in_game: {
            executing_phases: { start_of_season: "championship_betting" }
          }
        })
      ).toBe(true);

      // championship_betting → done → seed (auto-compute) → gala_check
      // → end_of_season_check → round_end → next round → action.
      actor.send({ type: "ADVANCE" });

      const snap = actor.getSnapshot();
      expect(snap.context.turn.round).toBe(1);
      expect(snap.matches({ in_game: { executing_phases: "action" } })).toBe(
        true
      );
    });

    it("seed phase populates competitions[*].phases", () => {
      const actor = createTestActor();
      const activeId = actor.getSnapshot().context.manager.active!;
      actor.send({
        type: "SELECT_STRATEGY",
        payload: { manager: activeId, strategy: 2 }
      });
      // championship_betting → ADVANCE walks through seed.
      actor.send({ type: "ADVANCE" });

      const { competitions } = actor.getSnapshot().context;
      // Round 0 seeds phl, division, ehl per calendar (tournaments seed
      // happens mid-season).
      expect(competitions.phl.phases.length).toBeGreaterThan(0);
      expect(competitions.division.phases.length).toBeGreaterThan(0);
      expect(competitions.ehl.phases.length).toBeGreaterThan(0);
    });
  });

  describe("ORDER_PRANK", () => {
    it("debits the manager, queues the prank, and bumps pranksExecuted", () => {
      const actor = createTestActor();
      const activeId = actor.getSnapshot().context.manager.active!;

      // Pasolini coaches team 12 → division. fixedMatch on division: 150000.
      const before = actor.getSnapshot().context;
      actor.send({
        type: "ORDER_PRANK",
        payload: { manager: activeId, type: "fixedMatch", victim: 7 }
      });

      const after = actor.getSnapshot().context;
      const m = after.manager.managers[activeId];
      expect(m.pranksExecuted).toBe(1);
      expect(m.balance).toBe(
        before.manager.managers[activeId].balance - 150000
      );
      expect(after.prank.pranks).toEqual([
        { manager: activeId, type: "fixedMatch", victim: 7 }
      ]);
    });

    it("free pranks (protest) leave balance untouched", () => {
      const actor = createTestActor();
      const activeId = actor.getSnapshot().context.manager.active!;
      const beforeBalance =
        actor.getSnapshot().context.manager.managers[activeId].balance;

      actor.send({
        type: "ORDER_PRANK",
        payload: { manager: activeId, type: "protest", victim: 3 }
      });

      const m = actor.getSnapshot().context.manager.managers[activeId];
      expect(m.balance).toBe(beforeBalance);
      expect(m.pranksExecuted).toBe(1);
    });
  });
});
