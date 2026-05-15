import { setup, assign } from "xstate";
import type { Random } from "random-js";
import type { HumanTeam } from "@/state/game";
import type { ManagerAttributes } from "@/data/managers";
import type { CrisisOption } from "@/data/crisis";
import {
  resolveCrisisMeeting,
  type CrisisMeetingResult
} from "@/game/crisis-meeting";

// ── Types ────────────────────────────────────────────────────────

export type CrisisMeetingInput = {
  team: HumanTeam;
  managerAttributes: ManagerAttributes;
  random: Random;
};

export type CrisisMeetingOutput =
  | { outcome: "cancelled" }
  | { outcome: "completed"; result: CrisisMeetingResult };

type CrisisMeetingContext = {
  team: HumanTeam;
  managerAttributes: ManagerAttributes;
  random: Random;
  result: CrisisMeetingResult | undefined;
};

type CrisisMeetingEvent =
  | { type: "CHOOSE_OPTION"; option: CrisisOption }
  | { type: "ACKNOWLEDGE" }
  | { type: "CANCEL" };

// ── Machine ──────────────────────────────────────────────────────

export const crisisMeetingMachine = setup({
  types: {
    context: {} as CrisisMeetingContext,
    input: {} as CrisisMeetingInput,
    events: {} as CrisisMeetingEvent,
    output: {} as CrisisMeetingOutput
  }
}).createMachine({
  id: "crisisMeeting",

  context: ({ input }): CrisisMeetingContext => ({
    team: input.team,
    managerAttributes: input.managerAttributes,
    random: input.random,
    result: undefined
  }),

  initial: "choosing",

  output: ({ context }): CrisisMeetingOutput =>
    context.result
      ? { outcome: "completed", result: context.result }
      : { outcome: "cancelled" },

  states: {
    choosing: {
      on: {
        CHOOSE_OPTION: {
          target: "narrating",
          actions: assign(({ context, event }) => {
            const result = resolveCrisisMeeting(
              context.team,
              { attributes: context.managerAttributes },
              event.option,
              context.random
            );
            return { ...context, result };
          })
        },
        CANCEL: { target: "done" }
      }
    },

    narrating: {
      on: {
        ACKNOWLEDGE: { target: "done" }
      }
    },

    done: { type: "final" }
  }
});
