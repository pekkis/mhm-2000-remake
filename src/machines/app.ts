/**
 * Top-level application lifecycle machine — MHM 2000 edition.
 *
 *   menu                 — slot menu (8 cards), reads slot list async on entry
 *     loadingSlots
 *     slotList
 *     confirmingClear    — T-press confirmation (QB `tyhjennalokero`)
 *   creatingGame         — `newGameMachine` invoked as a child
 *   loading              — read snapshot from IndexedDB
 *   playing              — game actor running
 *
 * The `playing` state owns the spawned `gameMachine` actor; it's
 * created with `createActor()` (rather than `spawn()`) so we can pass
 * a persisted snapshot when loading. The wizard is `invoke`d so its
 * lifecycle is tied to `creatingGame`.
 */

import {
  setup,
  assign,
  fromPromise,
  createActor,
  sendTo,
  type Actor,
  type Snapshot
} from "xstate";

import { gameMachine } from "@/machines/game";
import { newGameMachine, type NewGameOutput } from "@/machines/new-game";
import {
  loadSlot,
  saveSlot,
  clearSlot,
  listSlots,
  getLastSlot,
  setLastSlot,
  type SlotInfo,
  type SlotMetadata
} from "@/services/persistence";
import { composeNewGameContext } from "@/machines/parts/compose-new-game";
import type { GameContext } from "@/state";

export type AppContext = {
  /** All 8 slot cards, populated on entry to `menu`. */
  slots: SlotInfo[];
  /** Highlighted slot in the menu. Persisted across sessions. */
  selectedSlot: number;
  /** Slot the user is currently confirming clear for. */
  pendingClearSlot: number | undefined;
  /** Slot the new-game wizard is targeting. */
  newGameSlot: number | undefined;
  /** Snapshot loaded from IndexedDB, awaiting `playing` entry. */
  snapshot: Snapshot<unknown> | undefined;
  /** GameContext built by the new-game wizard, awaiting `playing` entry. */
  pending: GameContext | undefined;
  /** Live game actor while in `playing`. */
  gameRef: Actor<typeof gameMachine> | undefined;
};

export type AppMachineEvents =
  | { type: "SELECT_SLOT"; slot: number }
  | { type: "START_NEW_GAME"; slot: number }
  | { type: "LOAD_SLOT"; slot: number }
  | { type: "REQUEST_CLEAR_SLOT"; slot: number }
  | { type: "CONFIRM_CLEAR_SLOT" }
  | { type: "CANCEL_CLEAR_SLOT" }
  | { type: "SAVE_GAME" }
  | { type: "QUIT" };

const buildSlotMetadata = (ctx: GameContext): SlotMetadata => {
  const managers = ctx.human.order.flatMap((id) => {
    const m = ctx.managers[id];
    if (!m) return [];
    const teamId = m.team;
    const team = teamId !== undefined ? ctx.teams[teamId] : undefined;
    // Pick the most prestigious competition the team appears in.
    const phlIds = (ctx.competitions.phl?.teams ?? []) as number[];
    const divIds = (ctx.competitions.division?.teams ?? []) as number[];
    const league =
      teamId !== undefined && phlIds.includes(teamId)
        ? "phl"
        : teamId !== undefined && divIds.includes(teamId)
          ? "divisioona"
          : "mutasarja";
    return [
      {
        name: m.name,
        teamName: team?.name ?? "",
        league: league as SlotMetadata["managers"][number]["league"]
      }
    ];
  });
  return {
    managerCount: managers.length,
    year: 1998 + (ctx.turn.season ?? 0),
    managers,
    savedAt: Date.now()
  };
};

export const appMachine = setup({
  types: {
    context: {} as AppContext,
    events: {} as AppMachineEvents
  },
  actors: {
    newGame: newGameMachine,
    loadSlots: fromPromise<{ slots: SlotInfo[]; lastSlot: number }>(async () => {
      const [slots, lastSlot] = await Promise.all([listSlots(), getLastSlot()]);
      return { slots, lastSlot: lastSlot ?? 1 };
    }),
    loadFromStorage: fromPromise<Snapshot<unknown>, { slot: number }>(
      async ({ input }) => {
        const record = await loadSlot(input.slot);
        if (!record) {
          throw new Error(`no saved game in slot ${input.slot}`);
        }
        return record.snapshot as Snapshot<unknown>;
      }
    ),
    persistSlot: fromPromise<
      void,
      { slot: number; snapshot: Snapshot<unknown>; metadata: SlotMetadata }
    >(async ({ input }) => {
      await saveSlot(input.slot, input.snapshot, input.metadata);
      await setLastSlot(input.slot);
    }),
    clearSlot: fromPromise<void, { slot: number }>(async ({ input }) => {
      await clearSlot(input.slot);
    })
  },
  actions: {
    persistLastSlot: (_, params: { slot: number }) => {
      // Fire-and-forget: the menu UI doesn't need to wait on it.
      void setLastSlot(params.slot);
    }
  }
}).createMachine({
  id: "app",
  initial: "menu",
  context: {
    slots: [],
    selectedSlot: 1,
    pendingClearSlot: undefined,
    newGameSlot: undefined,
    snapshot: undefined,
    pending: undefined,
    gameRef: undefined
  },
  on: {
    SAVE_GAME: {
      guard: ({ context }) => context.gameRef !== undefined,
      // Two steps: persist the snapshot (with metadata) and nudge the
      // game so it can render its own "Peli tallennettiin." notification.
      actions: [
        ({ context }) => {
          const ref = context.gameRef!;
          const snapshot = ref.getPersistedSnapshot() as Snapshot<unknown>;
          const liveCtx = ref.getSnapshot().context as GameContext;
          const slot = context.newGameSlot ?? context.selectedSlot;
          void saveSlot(slot, snapshot, buildSlotMetadata(liveCtx)).then(() =>
            setLastSlot(slot)
          );
        },
        sendTo(({ context }) => context.gameRef!, { type: "SAVED" })
      ]
    }
  },
  states: {
    menu: {
      initial: "loadingSlots",
      states: {
        loadingSlots: {
          invoke: {
            src: "loadSlots",
            onDone: {
              target: "slotList",
              actions: assign({
                slots: ({ event }) => event.output.slots,
                selectedSlot: ({ event }) => event.output.lastSlot
              })
            },
            onError: {
              target: "slotList",
              actions: assign({
                slots: ({ context }) => context.slots
              })
            }
          }
        },
        slotList: {
          on: {
            SELECT_SLOT: {
              actions: [
                assign({
                  selectedSlot: ({ event }) => event.slot
                }),
                {
                  type: "persistLastSlot",
                  params: ({ event }) => ({ slot: event.slot })
                }
              ]
            },
            START_NEW_GAME: {
              target: "#app.creatingGame",
              actions: assign({
                newGameSlot: ({ event }) => event.slot,
                selectedSlot: ({ event }) => event.slot
              })
            },
            LOAD_SLOT: {
              target: "#app.loading",
              actions: assign({
                newGameSlot: ({ event }) => event.slot,
                selectedSlot: ({ event }) => event.slot
              })
            },
            REQUEST_CLEAR_SLOT: {
              target: "confirmingClear",
              actions: assign({
                pendingClearSlot: ({ event }) => event.slot
              })
            }
          }
        },
        confirmingClear: {
          on: {
            CONFIRM_CLEAR_SLOT: { target: "clearingSlot" },
            CANCEL_CLEAR_SLOT: {
              target: "slotList",
              actions: assign({ pendingClearSlot: undefined })
            }
          }
        },
        clearingSlot: {
          invoke: {
            src: "clearSlot",
            input: ({ context }) => ({ slot: context.pendingClearSlot! }),
            onDone: {
              target: "loadingSlots",
              actions: assign({ pendingClearSlot: undefined })
            },
            onError: {
              target: "slotList",
              actions: assign({ pendingClearSlot: undefined })
            }
          }
        }
      }
    },
    creatingGame: {
      invoke: {
        id: "newGame",
        src: "newGame",
        input: ({ context }) => ({ slot: context.newGameSlot! }),
        onDone: {
          target: "playing",
          actions: assign({
            pending: ({ event }) =>
              composeNewGameContext(event.output as NewGameOutput)
          })
        },
        onError: {
          target: "menu",
          actions: assign({ newGameSlot: undefined })
        }
      },
      on: {
        QUIT: {
          target: "menu",
          actions: assign({ newGameSlot: undefined })
        }
      }
    },
    loading: {
      invoke: {
        src: "loadFromStorage",
        input: ({ context }) => ({ slot: context.newGameSlot! }),
        onDone: {
          target: "playing",
          actions: assign({ snapshot: ({ event }) => event.output })
        },
        onError: { target: "menu" }
      }
    },
    playing: {
      // Hydrate from `snapshot` if we came via load, otherwise from
      // `pending` (new-game wizard). `createActor` (vs `spawn`) is the
      // only API that accepts `snapshot` in XState 5.
      entry: assign(({ context }) => {
        const game =
          context.snapshot !== undefined
            ? createActor(gameMachine, {
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
          gameRef: undefined,
          newGameSlot: undefined
        })
      ],
      on: {
        QUIT: { target: "menu" }
      }
    }
  }
});
