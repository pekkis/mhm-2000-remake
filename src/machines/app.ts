import { setup, assign, fromPromise, createActor, sendTo } from "xstate";
import type { Actor, Snapshot } from "xstate";

import {
  createDefaultGameContext,
  type GameContext,
  type Manager
} from "@/state";
import { loadSnapshot, saveSnapshot } from "@/services/persistence";
import { gameMachine } from "@/machines/game";
import type { ManagerSubmission } from "@/machines/game";
import { teamsMainCompetition } from "@/machines/selectors";
import difficultyLevels from "@/data/difficulty-levels";
import { produce } from "immer";
import { createUniqueId } from "@/services/id";

/**
 * Top-level application lifecycle machine.
 *
 * Owns the menu ↔ game shell. Holds a *pending* `GameContext` only
 * during `starting` — i.e. while the new-game wizard is refining the
 * context that will be handed to a spawned `gameMachine` on entry to
 * `playing`. The `loading` path holds a persisted `snapshot` instead and
 * spawns the game from it. Once spawned, the game owns its state fully;
 * app drops the reference on `QUIT`.
 *
 * The same flow scales to a richer wizard (MHM 2000): each step refines
 * `pending`, the final step spawns the game with the finished context.
 */

/**
 * Currently only slot 1 is wired up. The save/load UI will pick a slot
 * later (MHM 2000 had 6); for now everything funnels through this constant.
 */
const CURRENT_SLOT = 1;

export type AppContext = {
  pending: GameContext | undefined;
  snapshot: Snapshot<unknown> | undefined;
  gameRef: Actor<typeof gameMachine> | undefined;
};

export type AppMachineEvents =
  | { type: "START_GAME" }
  | { type: "LOAD_GAME" }
  | { type: "ADD_MANAGER"; payload: ManagerSubmission }
  | { type: "SAVE_GAME" }
  | { type: "QUIT" };

/**
 * Pure refinement: take the current pending `GameContext` and the wizard's
 * manager submission, return a `GameContext` with the manager installed and
 * the chosen team flagged. 1-1 port of the legacy `buildManager` +
 * `assignManager` action that used to live in `gameMachine`.
 */
const withManager = (
  ctx: GameContext,
  submission: ManagerSubmission
): GameContext => {
  const difficulty = submission.difficulty;
  const main = teamsMainCompetition(submission.team)(ctx);

  const manager: Manager = {
    id: createUniqueId(),
    kind: "human",
    name: submission.name,
    team: submission.team,
    nationality: "FI",
    attributes: {
      charisma: 0,
      luck: 0,
      negotiation: 0,
      resourcefulness: 0,
      specialTeams: 0,
      strategy: 0
    },
    difficulty,
    pranksExecuted: 0,
    services: {
      coach: false,
      insurance: false,
      microphone: false,
      cheer: false
    },
    balance: difficultyLevels[difficulty].startBalance,
    arena: { name: submission.arena, level: main === "phl" ? 3 : 0 },
    extra: 0,
    insuranceExtra: 0,
    flags: {}
  };

  return produce(ctx, (draft) => {
    draft.managers[manager.id] = manager;
    draft.manager.managers.push(manager.id);
    draft.manager.active = manager.id;

    draft.teams[submission.team].manager = manager.id;
  });

  /*
  return {
    ...ctx,
    manager: {
      active: manager.id,
      managers: { ...ctx.manager.managers, []: manager }
    },
    teams: ctx.teams.map((t) =>
      t.id === submission.team ? { ...t, manager: manager.id } : t
    )
  };
  */
};

export const appMachine = setup({
  types: {
    context: {} as AppContext,
    events: {} as AppMachineEvents
  },
  actors: {
    load_from_storage: fromPromise<Snapshot<unknown>>(async () => {
      const loaded = loadSnapshot(CURRENT_SLOT);
      if (!loaded) {
        throw new Error("no saved game");
      }
      return loaded as Snapshot<unknown>;
    })
  },
  actions: {
    persistSnapshot: (_, params: { snapshot: Snapshot<unknown> }) => {
      saveSnapshot(CURRENT_SLOT, params.snapshot);
    }
  }
}).createMachine({
  id: "app",
  initial: "menu",
  context: { pending: undefined, snapshot: undefined, gameRef: undefined },
  on: {
    SAVE_GAME: {
      guard: ({ context }) => context.gameRef !== undefined,
      // Two steps:
      //   1. Imperative IO via a `params`-driven action object — keeps the
      //      `assign()`/`createActor()` factories that fire later (e.g. when
      //      the SAVED handshake spawns a notification child) from being
      //      mistaken for "called inside a custom action" by XState's
      //      dev-mode `executingCustomAction` flag.
      //   2. `sendTo` — built-in primitive — to nudge the game so it can
      //      surface its own "Peli tallennettiin." notification.
      actions: [
        {
          type: "persistSnapshot",
          params: ({ context }) => ({
            snapshot: context.gameRef!.getPersistedSnapshot()
          })
        },
        sendTo(({ context }) => context.gameRef!, { type: "SAVED" })
      ]
    }
  },
  states: {
    menu: {
      on: {
        START_GAME: {
          target: "starting",
          actions: assign({ pending: () => createDefaultGameContext() })
        },
        LOAD_GAME: { target: "loading" }
      }
    },
    starting: {
      on: {
        ADD_MANAGER: {
          target: "playing",
          actions: assign({
            pending: ({ context, event }) =>
              withManager(context.pending!, event.payload)
          })
        },
        QUIT: {
          target: "menu",
          actions: assign({ pending: undefined })
        }
      }
    },
    loading: {
      invoke: {
        src: "load_from_storage",
        onDone: {
          target: "playing",
          actions: assign({ snapshot: ({ event }) => event.output })
        },
        onError: { target: "menu" }
      }
    },
    playing: {
      // Hydrate from `snapshot` if we came via load, otherwise from `pending`
      // (new-game wizard). We use `createActor` rather than `spawn` because
      // `spawn` can't accept a persisted snapshot in XState 5 — only the
      // root-level `createActor` can. The trade-off is that the game lives
      // in its own actor system rather than as a child of the app actor.
      // It's fine: the game is fully self-contained and we own its lifecycle
      // through the gameRef stored in context.
      entry: assign(({ context }) => {
        const game =
          context.snapshot !== undefined
            ? // gameMachine declares `input` as required, but XState ignores
              // `input` when `snapshot` is provided — the persisted snapshot
              // already carries the full context. Cast around the type
              // requirement.
              createActor(gameMachine, {
                snapshot: context.snapshot,
                systemId: "game"
              } as Parameters<typeof createActor<typeof gameMachine>>[1])
            : createActor(gameMachine, {
                input: context.pending!,
                systemId: "game"
              });
        game.start();
        return {
          pending: undefined,
          snapshot: undefined,
          gameRef: game
        };
      }),
      exit: [
        ({ context }) => context.gameRef?.stop(),
        assign({
          pending: undefined,
          snapshot: undefined,
          gameRef: undefined
        })
      ],
      on: {
        QUIT: { target: "menu" }
      }
    }
  }
});
