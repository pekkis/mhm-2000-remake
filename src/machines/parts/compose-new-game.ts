/**
 * Pure helper: take the wizard output (manager drafts + pecking order)
 * and a fresh default `GameContext`, return a `GameContext` with the
 * humans installed, custom-team overrides applied, and `human.order`
 * pre-sorted per the chosen pecking order.
 *
 * Kept out of `appMachine` to keep the machine wiring readable.
 */

import { produce } from "immer";

import { createDefaultGameContext, type GameContext } from "@/state";
import type { HumanManager } from "@/state/game";
import type {
  ManagerDraft,
  NewGameOutput,
  PeckingOrder
} from "@/machines/new-game";
import { createUniqueId } from "@/services/id";
import difficultyLevels from "@/data/difficulty-levels";
import random from "@/services/random";

const buildHumanManager = (draft: ManagerDraft): HumanManager => {
  // Convert MHM 2000 difficulty id (1..5) to the legacy 0-based index
  // that the runtime still uses.
  const legacyDifficulty = draft.difficulty - 1;
  return {
    id: createUniqueId(),
    kind: "human",
    name: draft.name,
    nationality: draft.nationality,
    tags: [],
    attributes: draft.attributes,
    difficulty: legacyDifficulty,
    pranksExecuted: 0,
    services: {
      coach: false,
      insurance: false,
      microphone: false,
      cheer: false
    },
    balance: difficultyLevels[legacyDifficulty].startBalance,
    arena: {
      name: draft.customTeam?.arena ?? "MHM 2000 Areena",
      level: 1
    },
    extra: 0,
    insuranceExtra: 0,
    flags: {},
    team: draft.team
  };
};

const fisherYatesShuffle = <T>(items: readonly T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = random.integer(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Apply the chosen pecking order to a list of `(managerId, team)` pairs.
 *
 * QB `nokka`:
 *   1 = weakest first (worst previousRankings[0] highest number first)
 *   2 = strongest first (best previousRankings[0] lowest number first)
 *   3 = random
 *
 * Re-applied every season at the rollover init block; at game-creation
 * time it's just a one-shot sort.
 */
export const applyPeckingOrder = (
  pairs: { id: string; rank: number | undefined }[],
  order: PeckingOrder
): string[] => {
  switch (order) {
    case "best-first":
      // Lower rank number = better previous season. Unknown rank goes last.
      return pairs
        .toSorted((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
        .map((p) => p.id);
    case "worst-first":
      return pairs
        .toSorted((a, b) => (b.rank ?? -Infinity) - (a.rank ?? -Infinity))
        .map((p) => p.id);
    case "random":
      return fisherYatesShuffle(pairs).map((p) => p.id);
  }
};

/**
 * Compose a full `GameContext` from a wizard `NewGameOutput`. Returns a
 * brand-new context every call — safe to feed straight into
 * `createActor(gameMachine, { input: ctx })`.
 */
export const composeNewGameContext = (output: NewGameOutput): GameContext => {
  const base = createDefaultGameContext();

  return produce(base, (draft) => {
    const installed: { id: string; rank: number | undefined }[] = [];

    for (const managerDraft of output.drafts) {
      const manager = buildHumanManager(managerDraft);
      draft.managers[manager.id] = manager;

      // Wire the team -> manager pointer. If a custom-team override was
      // supplied, rewrite the team's name / city / arena name in place
      // (QB `omajoukkue`: pick a team to displace, then rename).
      const team = draft.teams[managerDraft.team];
      if (team) {
        team.manager = manager.id;
        if (managerDraft.customTeam) {
          team.name = managerDraft.customTeam.name;
          team.city = managerDraft.customTeam.city;
          if (team.arena) {
            team.arena = {
              ...team.arena,
              name: managerDraft.customTeam.arena
            };
          }
        }
      }

      installed.push({
        id: manager.id,
        rank: team?.previousRankings?.[0]
      });
    }

    draft.human.order = applyPeckingOrder(installed, output.peckingOrder);
    draft.human.active = draft.human.order[0];
  });
};
