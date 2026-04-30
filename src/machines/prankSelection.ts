import { setup, assign } from "xstate";

type PrankSelectionContext = {
  type: string | undefined;
  victim: number | undefined;
};

type PrankSelectionEvents =
  | { type: "SELECT_TYPE"; prankType: string }
  | { type: "SELECT_VICTIM"; victim: number }
  | { type: "ORDER" }
  | { type: "CANCEL" };

export const prankSelectionMachine = setup({
  types: {
    context: {} as PrankSelectionContext,
    events: {} as PrankSelectionEvents
  }
}).createMachine({
  id: "prankSelection",
  initial: "idle",
  context: {
    type: undefined,
    victim: undefined
  },
  states: {
    idle: {
      on: {
        SELECT_TYPE: {
          target: "typeSelected",
          actions: assign({
            type: ({ event }) => event.prankType,
            victim: undefined
          })
        }
      }
    },
    typeSelected: {
      on: {
        SELECT_VICTIM: {
          target: "victimSelected",
          actions: assign({
            victim: ({ event }) => event.victim
          })
        },
        CANCEL: {
          target: "idle",
          actions: assign({ type: undefined, victim: undefined })
        }
      }
    },
    victimSelected: {
      on: {
        ORDER: {
          target: "idle",
          actions: assign({ type: undefined, victim: undefined })
        },
        CANCEL: {
          target: "idle",
          actions: assign({ type: undefined, victim: undefined })
        }
      }
    }
  }
});
