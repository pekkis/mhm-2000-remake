import { setup, sendParent } from "xstate";

export type NotificationData = {
  id: string;
  manager: string;
  message: string;
  type: string;
};

export type NotificationInput = NotificationData & { timeout: number };

/**
 * One notification = one machine. Lives `timeout` ms in `active`, then
 * transitions to `expired` and notifies the parent so it can reap.
 * Manual `DISMISS` short-circuits the timer.
 */
export const notificationMachine = setup({
  types: {
    context: {} as NotificationInput,
    input: {} as NotificationInput,
    events: {} as { type: "DISMISS" }
  },
  delays: {
    AUTO_DISMISS: ({ context }) => context.timeout
  }
}).createMachine({
  id: "notification",
  context: ({ input }) => input,
  initial: "active",
  states: {
    active: {
      after: { AUTO_DISMISS: "expired" },
      on: { DISMISS: "expired" }
    },
    expired: {
      type: "final",
      entry: sendParent(({ context }) => ({
        type: "REMOVE",
        id: context.id
      }))
    }
  }
});
