/**
 * MHM 2000 new-game wizard.
 *
 * Spawned by `appMachine` when the player picks an empty slot. Walks
 * the player through the QB `alku` / `alku2` flow:
 *
 *   1. `pickManagerCount` (1..4)               — `alku` plkm
 *   2. per-manager loop (`managerLoop`):       — `alku2` FOR pv = 1 TO plkm
 *      - `name`           — name input
 *      - `nationality`    — nation grid
 *      - `experience`     — UUSI KASVO / KOKENUT KONKARI / ELÄVÄ LEGENDA
 *      - `difficulty`     — Nörttivatsa..Katarrivatsa
 *      - `team`           — team grid (gated by experience tier)
 *        - optional `customTeam` subflow (omajoukkue)
 *      - `attributes`     — distribute `characterPoints` over 6 skills
 *   3. `askMore`           — add another manager or continue
 *   4. `peckingOrder`      — best-first / worst-first / random
 *   5. (TODO `hate` — `vihat`, deferred to a follow-up)
 *   6. `done` — emits `output` for the parent to assemble a GameContext.
 *
 * The wizard is intentionally pure-state — it doesn't touch persistence
 * or build a GameContext. The parent (`appMachine`) does that on
 * `onDone`. This keeps the wizard easy to test and replay.
 */

import { setup, assign, type ActorRefFrom } from "xstate";
import { produce } from "immer";

import type { CountryIso } from "@/data/countries";
import type { ManagerAttributes } from "@/data/managers";
import {
  difficultyLevels as mhm2kDifficulty,
  type DifficultyLevelId
} from "@/data/mhm2000/difficulty-levels";
import type { ManagerExperienceId } from "@/data/mhm2000/manager-experience";
import type { LeagueTier } from "@/data/mhm2000/teams";

/** Allowed team tiers per experience archetype. Mirrors QB's `sin1`-threshold gating. */
export const tiersForExperience = (
  experience: ManagerExperienceId
): readonly LeagueTier[] => {
  switch (experience) {
    case "rookie":
      return ["mutasarja"] as const;
    case "veteran":
      return ["divisioona", "mutasarja"] as const;
    case "legend":
      return ["phl", "divisioona", "mutasarja"] as const;
  }
};

/** Custom-team override (the QB "OMA JOUKKUE" path). */
export type CustomTeamOverride = {
  name: string;
  city: string;
  arena: string;
};

export type ManagerDraft = {
  name: string;
  nationality: CountryIso;
  experience: ManagerExperienceId;
  /** MHM 2000 difficulty id (1..5). Translated to legacy 0-based at GameContext build time. */
  difficulty: DifficultyLevelId;
  /** Team id (numeric, into `ctx.teams`). For `customTeam`, this is the team being displaced. */
  team: number;
  customTeam?: CustomTeamOverride;
  attributes: ManagerAttributes;
};

export type PeckingOrder = "best-first" | "worst-first" | "random";

export type NewGameOutput = {
  drafts: ManagerDraft[];
  peckingOrder: PeckingOrder;
};

export type NewGameInput = {
  /** Persistence slot the wizard is targeting. Carried through to `output` by the parent. */
  slot: number;
};

type NewGameContext = {
  slot: number;
  managerCount: number | undefined;
  drafts: ManagerDraft[];
  /** Accumulating fields for the manager currently being built. */
  current: Partial<ManagerDraft>;
  peckingOrder: PeckingOrder | undefined;
};

export type NewGameEvents =
  | { type: "SET_MANAGER_COUNT"; count: 1 | 2 | 3 | 4 }
  | { type: "SET_NAME"; name: string }
  | { type: "SET_NATIONALITY"; nationality: CountryIso }
  | { type: "SET_EXPERIENCE"; experience: ManagerExperienceId }
  | { type: "SET_DIFFICULTY"; difficulty: DifficultyLevelId }
  | { type: "SET_TEAM"; team: number; customTeam?: CustomTeamOverride }
  | { type: "SET_ATTRIBUTES"; attributes: ManagerAttributes }
  | { type: "ADD_MORE" }
  | { type: "FINISH_ADDING" }
  | { type: "SET_PECKING_ORDER"; order: PeckingOrder }
  | { type: "BACK" }
  | { type: "CANCEL" };

/**
 * The character-creation pool depends on difficulty (`characterPoints`
 * field on the MHM 2000 difficulty entry). The UI is responsible for
 * enforcing that the submitted attributes spend exactly that many
 * points; the machine just snapshots whatever it gets.
 *
 * Exposed as a helper so both the UI and any tests can derive the pool
 * from the chosen difficulty.
 */
export const characterPointsForDifficulty = (
  difficulty: DifficultyLevelId
): number => mhm2kDifficulty[difficulty - 1]!.characterPoints;

const initialAttributes = (): ManagerAttributes => ({
  strategy: 0,
  specialTeams: 0,
  negotiation: 0,
  resourcefulness: 0,
  charisma: 0,
  luck: 0
});

const finishCurrentDraft = (
  ctx: NewGameContext
): { drafts: ManagerDraft[]; current: Partial<ManagerDraft> } =>
  produce(
    { drafts: ctx.drafts, current: ctx.current },
    (draft) => {
      // Defensive: only append when all required fields are present.
      const c = draft.current;
      if (
        c.name &&
        c.nationality &&
        c.experience &&
        c.difficulty &&
        c.team !== undefined &&
        c.attributes
      ) {
        draft.drafts.push({
          name: c.name,
          nationality: c.nationality,
          experience: c.experience,
          difficulty: c.difficulty,
          team: c.team,
          attributes: c.attributes,
          ...(c.customTeam ? { customTeam: c.customTeam } : {})
        });
        draft.current = {};
      }
    }
  );

export const newGameMachine = setup({
  types: {
    context: {} as NewGameContext,
    events: {} as NewGameEvents,
    input: {} as NewGameInput,
    output: {} as NewGameOutput
  },
  actions: {
    setManagerCount: assign({
      managerCount: (_, params: { count: number }) => params.count
    }),
    setName: assign({
      current: ({ context }, params: { name: string }) =>
        produce(context.current, (d) => {
          d.name = params.name;
        })
    }),
    setNationality: assign({
      current: ({ context }, params: { nationality: CountryIso }) =>
        produce(context.current, (d) => {
          d.nationality = params.nationality;
        })
    }),
    setExperience: assign({
      current: ({ context }, params: { experience: ManagerExperienceId }) =>
        produce(context.current, (d) => {
          d.experience = params.experience;
        })
    }),
    setDifficulty: assign({
      current: ({ context }, params: { difficulty: DifficultyLevelId }) =>
        produce(context.current, (d) => {
          d.difficulty = params.difficulty;
        })
    }),
    setTeam: assign({
      current: (
        { context },
        params: { team: number; customTeam?: CustomTeamOverride }
      ) =>
        produce(context.current, (d) => {
          d.team = params.team;
          d.customTeam = params.customTeam;
        })
    }),
    setAttributesAndCommit: assign(
      ({ context }, params: { attributes: ManagerAttributes }) => {
        const withAttrs = produce(context.current, (d) => {
          d.attributes = params.attributes;
        });
        const next = finishCurrentDraft({ ...context, current: withAttrs });
        return next;
      }
    ),
    initAttributes: assign({
      current: ({ context }) =>
        produce(context.current, (d) => {
          if (!d.attributes) {
            d.attributes = initialAttributes();
          }
        })
    }),
    setPeckingOrder: assign({
      peckingOrder: (_, params: { order: PeckingOrder }) => params.order
    })
  },
  guards: {
    canAddMore: ({ context }) =>
      context.drafts.length < (context.managerCount ?? 1),
    isLastManager: ({ context }) =>
      context.drafts.length >= (context.managerCount ?? 1)
  }
}).createMachine({
  id: "newGame",
  initial: "pickManagerCount",
  context: ({ input }) => ({
    slot: input.slot,
    managerCount: undefined,
    drafts: [],
    current: {},
    peckingOrder: undefined
  }),
  output: ({ context }): NewGameOutput => ({
    drafts: context.drafts,
    peckingOrder: context.peckingOrder ?? "best-first"
  }),
  on: {
    CANCEL: { target: ".cancelled" }
  },
  states: {
    pickManagerCount: {
      on: {
        SET_MANAGER_COUNT: {
          target: "managerLoop",
          actions: {
            type: "setManagerCount",
            params: ({ event }) => ({ count: event.count })
          }
        }
      }
    },
    managerLoop: {
      initial: "name",
      states: {
        name: {
          on: {
            SET_NAME: {
              target: "nationality",
              actions: {
                type: "setName",
                params: ({ event }) => ({ name: event.name })
              }
            }
          }
        },
        nationality: {
          on: {
            SET_NATIONALITY: {
              target: "experience",
              actions: {
                type: "setNationality",
                params: ({ event }) => ({ nationality: event.nationality })
              }
            },
            BACK: { target: "name" }
          }
        },
        experience: {
          on: {
            SET_EXPERIENCE: {
              target: "difficulty",
              actions: {
                type: "setExperience",
                params: ({ event }) => ({ experience: event.experience })
              }
            },
            BACK: { target: "nationality" }
          }
        },
        difficulty: {
          on: {
            SET_DIFFICULTY: {
              target: "team",
              actions: {
                type: "setDifficulty",
                params: ({ event }) => ({ difficulty: event.difficulty })
              }
            },
            BACK: { target: "experience" }
          }
        },
        team: {
          on: {
            SET_TEAM: {
              target: "attributes",
              actions: {
                type: "setTeam",
                params: ({ event }) => ({
                  team: event.team,
                  customTeam: event.customTeam
                })
              }
            },
            BACK: { target: "difficulty" }
          }
        },
        attributes: {
          entry: { type: "initAttributes" },
          on: {
            SET_ATTRIBUTES: {
              target: "#newGame.askMore",
              actions: {
                type: "setAttributesAndCommit",
                params: ({ event }) => ({ attributes: event.attributes })
              }
            },
            BACK: { target: "team" }
          }
        }
      }
    },
    askMore: {
      always: [
        // If we've already collected all requested managers, jump straight to pecking order.
        { guard: "isLastManager", target: "peckingOrder" }
      ],
      on: {
        ADD_MORE: {
          guard: "canAddMore",
          target: "managerLoop"
        },
        FINISH_ADDING: { target: "peckingOrder" }
      }
    },
    peckingOrder: {
      always: [
        // Single-manager runs skip the pecking-order question; QB forces nokka = 1.
        {
          guard: ({ context }) => (context.managerCount ?? 1) <= 1,
          target: "done",
          actions: {
            type: "setPeckingOrder",
            params: () => ({ order: "best-first" as PeckingOrder })
          }
        }
      ],
      on: {
        SET_PECKING_ORDER: {
          target: "done",
          actions: {
            type: "setPeckingOrder",
            params: ({ event }) => ({ order: event.order })
          }
        },
        BACK: { target: "askMore" }
      }
    },
    // TODO: hate (`vihat`) screen — picks one team to demote and rename
    // to `Blackheads, Hirvikoski` (MHM2K-FLOW.md `vihat`). Optional;
    // deferred to a follow-up PR.
    done: { type: "final" },
    cancelled: { type: "final" }
  }
});

export type NewGameActorRef = ActorRefFrom<typeof newGameMachine>;
