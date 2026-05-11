import { describe, it, expect } from "vitest";
import { produce } from "immer";
import { tickArenaProject, type ArenaTickResult } from "@/services/arena-tick";
import {
  createHumanTeam,
  scriptedRandom,
  fixedRandom
} from "@/__tests__/factories";
import type { ManagerArenaProject } from "@/state/arena-project";
import type { Arena } from "@/data/mhm2000/teams";
import type { HumanTeam } from "@/state/game";
import type { Random } from "random-js";

const targetArena: Arena = {
  level: 3,
  standingCount: 20,
  seatedCount: 30,
  hasBoxes: true,
  valuePoints: 100
};

const makeRenovation = (
  overrides: Partial<Extract<ManagerArenaProject, { kind: "renovate" }>> = {}
): Extract<ManagerArenaProject, { kind: "renovate" }> => ({
  kind: "renovate",
  builder: 1,
  roundsRemaining: 10,
  roundPayment: 5000,
  target: targetArena,
  ...overrides
});

const makeBuildPermitPending = (
  overrides: Partial<Extract<ManagerArenaProject, { kind: "build" }>> = {}
): Extract<ManagerArenaProject, { kind: "build" }> => ({
  kind: "build",
  name: "Pasolini Areena",
  architect: 1,
  builder: 1,
  permitGranted: false,
  roundsRemaining: 10,
  roundPayment: 500_000,
  target: targetArena,
  ...overrides
});

const makeBuildInProgress = (
  overrides: Partial<Extract<ManagerArenaProject, { kind: "build" }>> = {}
): Extract<ManagerArenaProject, { kind: "build" }> => ({
  kind: "build",
  name: "Pasolini Areena",
  architect: 2,
  builder: 2,
  permitGranted: true,
  roundsRemaining: 10,
  roundPayment: 5000,
  target: targetArena,
  ...overrides
});

/** Run tickArenaProject inside produce and return both the new team and the tick result. */
const tick = (
  team: HumanTeam,
  random: Random
): { team: HumanTeam; result: ArenaTickResult } => {
  let result!: ArenaTickResult;
  const nextTeam = produce(team, (draft) => {
    result = tickArenaProject(draft, random);
  });
  return { team: nextTeam, result };
};

describe("tickArenaProject", () => {
  it("returns empty result when no project exists", () => {
    const team = createHumanTeam({ arenaProject: undefined });
    const { result } = tick(team, fixedRandom(50));
    expect(result.news).toHaveLength(0);
    expect(result.completed).toBe(false);
  });

  // ── Renovation ──

  describe("renovation in progress", () => {
    it("deducts payment and progresses on normal roll", () => {
      const team = createHumanTeam({
        arenaFund: 100_000,
        arenaProject: makeRenovation({ roundsRemaining: 10, roundPayment: 5000 })
      });

      // Roll 50 — builder 1 threshold is 2, so 50 >= 2 → progresses, 50 > 2 → no slack
      const { team: next, result } = tick(team, fixedRandom(50));
      expect(result.completed).toBe(false);
      expect(result.news).toHaveLength(0);
      expect(next.arenaFund).toBe(95_000);
      expect(next.arenaProject!.roundsRemaining).toBe(9);
    });

    it("shows slack message for builder rank 1 on roll 1", () => {
      const team = createHumanTeam({
        arenaFund: 100_000,
        arenaProject: makeRenovation({ builder: 1, roundsRemaining: 10 })
      });

      // Roll 1: threshold = 3-1 = 2. 1 <= 2 → slacked, 1 < 2 → NOT progressed
      const { team: next, result } = tick(team, fixedRandom(1));
      expect(result.news.length).toBeGreaterThan(0);
      expect(result.news[0]).toContain("kahvituntien");
      // Lost a day — roundsRemaining stays at 10
      expect(next.arenaProject!.roundsRemaining).toBe(10);
    });

    it("builder rank 3 never slacks", () => {
      const team = createHumanTeam({
        arenaFund: 100_000,
        arenaProject: makeRenovation({ builder: 3, roundsRemaining: 10 })
      });

      // Roll 1: threshold = 3-3 = 0. 1 > 0 → no slack, 1 >= 0 → progresses
      const { team: next, result } = tick(team, fixedRandom(1));
      expect(result.news).toHaveLength(0);
      expect(next.arenaProject!.roundsRemaining).toBe(9);
    });

    it("pauses when arenaFund is insufficient", () => {
      const team = createHumanTeam({
        arenaFund: 100,
        arenaProject: makeRenovation({ roundPayment: 5000, roundsRemaining: 5 })
      });

      const { team: next, result } = tick(team, fixedRandom(50));
      expect(result.news[0]).toContain("areenakassassa");
      // No payment deducted, no progress
      expect(next.arenaFund).toBe(100);
      expect(next.arenaProject!.roundsRemaining).toBe(5);
    });

    it("completes renovation when roundsRemaining reaches 0", () => {
      const team = createHumanTeam({
        arenaFund: 100_000,
        arenaProject: makeRenovation({ roundsRemaining: 1, roundPayment: 5000 })
      });

      // Roll 50 → progresses, roundsRemaining goes 1→0 → completion
      const { team: next, result } = tick(team, fixedRandom(50));
      expect(result.completed).toBe(true);
      expect(result.news[0]).toContain("remontti");
      expect(next.arenaProject).toBeUndefined();
      expect(next.arena.level).toBe(targetArena.level);
      expect(next.arena.valuePoints).toBe(targetArena.valuePoints);
    });
  });

  // ── Build — permit phase ──

  describe("build permit phase", () => {
    it("advances permit progress by architect rank each round", () => {
      const team = createHumanTeam({
        arenaProject: makeBuildPermitPending({
          architect: 2,
          roundsRemaining: 30
        })
      });

      // High submission roll (150) → won't submit
      const { team: next } = tick(team, fixedRandom(150));
      expect(next.arenaProject!.roundsRemaining).toBe(32); // 30 + 2
    });

    it("clamps progress to 100", () => {
      const team = createHumanTeam({
        arenaProject: makeBuildPermitPending({
          architect: 3,
          roundsRemaining: 99
        })
      });

      const { team: next } = tick(team, fixedRandom(150));
      expect(next.arenaProject!.roundsRemaining).toBe(100);
    });

    it("denies permit and resets progress to 10", () => {
      const team = createHumanTeam({
        arenaProject: makeBuildPermitPending({
          architect: 1,
          roundsRemaining: 80
        })
      });

      // submission roll: 0 (0 < 80+1-10=71, so submits)
      // denial roll: 0 (0 < 60-1*20=40, so denied)
      const rng = scriptedRandom({ integer: [0, 0] });
      const { team: next, result } = tick(team, rng);
      expect(result.news[0]).toContain("evätään");
      expect(next.arenaProject!.roundsRemaining).toBe(10);
    });

    it("grants permit and switches to construction", () => {
      const team = createHumanTeam({
        arenaProject: makeBuildPermitPending({
          architect: 3,
          builder: 2,
          roundsRemaining: 98,
          roundPayment: 400_000 // total cost stashed here during permit phase
        })
      });

      // After +3 architect, progress = 101, clamped to 100
      // submission roll: 0 (0 < 100-10=90, so submits)
      // denial roll: 50 (50 >= 60-3*20=0, so granted — architect 3 never denied)
      const rng = scriptedRandom({ integer: [0, 50] });
      const { team: next, result } = tick(team, rng);
      expect(result.news[0]).toContain("myönnetään");

      const proj = next.arenaProject!;
      expect(proj.kind).toBe("build");
      if (proj.kind === "build") {
        expect(proj.permitGranted).toBe(true);
        // Builder 2 → 80 rounds
        expect(proj.roundsRemaining).toBe(80);
        // roundPayment = qbCint(400_000 / 80) = 5000
        expect(proj.roundPayment).toBe(5000);
      }
    });
  });

  // ── Build — construction in progress ──

  describe("build construction in progress", () => {
    it("deducts payment and progresses", () => {
      const team = createHumanTeam({
        arenaFund: 50_000,
        arenaProject: makeBuildInProgress({ roundsRemaining: 10, roundPayment: 5000 })
      });

      const { team: next, result } = tick(team, fixedRandom(50));
      expect(result.completed).toBe(false);
      expect(next.arenaFund).toBe(45_000);
      expect(next.arenaProject!.roundsRemaining).toBe(9);
    });

    it("completes build and names the arena", () => {
      const team = createHumanTeam({
        arenaFund: 50_000,
        arenaProject: makeBuildInProgress({
          roundsRemaining: 1,
          roundPayment: 5000
        })
      });

      const { team: next, result } = tick(team, fixedRandom(50));
      expect(result.completed).toBe(true);
      expect(result.news[0]).toContain("Pasolini Areena");
      expect(next.arenaProject).toBeUndefined();
      expect(next.arena.name).toBe("Pasolini Areena");
      expect(next.arena.level).toBe(targetArena.level);
    });
  });
});
