import { setup, assign, sendTo, type ActorRefFrom } from "xstate";
import {
  notificationMachine,
  type NotificationData
} from "@/machines/notification";
import { createUniqueId } from "@/services/id";

const MAX_NOTIFICATIONS = 3;

export type NotificationActorRef = ActorRefFrom<typeof notificationMachine>;

/** Notification payload pushed by the app — `timeout` falls back to the parent's default. */
export type NotificationPayload = NotificationData & { timeout?: number };

type NotificationsContext = {
  notifications: NotificationActorRef[];
  defaultTimeout: number;
};

type NotificationsInput = { defaultTimeout: number };

type NotificationsEvents =
  | { type: "PUSH"; notification: NotificationPayload }
  | { type: "DISMISS"; id: string }
  | { type: "REMOVE"; id: string };

/**
 * Build a typed `PUSH` event for the notifications actor. Centralises
 * the `id: createUniqueId()` and `type: "PUSH"` boilerplate, and —
 * more usefully — gives call sites real type-checking on the
 * notification payload (the bare `enqueue.sendTo("notifications", ...)`
 * form has no way to infer the event shape from the string target).
 */
export const pushNotification = (
  notification: Omit<NotificationData, "id"> & { timeout?: number }
): { type: "PUSH"; notification: NotificationPayload } => ({
  type: "PUSH",
  notification: { id: createUniqueId(), ...notification }
});

/**
 * Parent machine for notifications. Each PUSH spawns a child
 * `notificationMachine` actor which auto-expires after its `timeout`
 * (defaulting to the parent's `defaultTimeout`). Children notify back
 * via REMOVE on expiry; we cap at MAX_NOTIFICATIONS by stopping the
 * oldest when we'd overflow.
 */
export const notificationsMachine = setup({
  types: {
    context: {} as NotificationsContext,
    input: {} as NotificationsInput,
    events: {} as NotificationsEvents
  },
  actors: {
    notification: notificationMachine
  }
}).createMachine({
  id: "notifications",
  context: ({ input }) => ({
    notifications: [],
    defaultTimeout: input.defaultTimeout
  }),
  on: {
    PUSH: {
      actions: assign({
        notifications: ({ context, event, spawn }) => {
          const ref = spawn("notification", {
            id: `notification-${event.notification.id}`,
            input: {
              ...event.notification,
              timeout: event.notification.timeout ?? context.defaultTimeout
            }
          });
          const next = [...context.notifications, ref];
          if (next.length > MAX_NOTIFICATIONS) {
            const dropped = next.shift();
            dropped?.send({ type: "DISMISS" });
          }
          return next;
        }
      })
    },
    DISMISS: {
      actions: sendTo(
        ({ context, event }) =>
          context.notifications.find(
            (r) => r.getSnapshot().context.id === event.id
          )!,
        { type: "DISMISS" }
      )
    },
    REMOVE: {
      actions: assign({
        notifications: ({ context, event }) =>
          context.notifications.filter(
            (r) => r.getSnapshot().context.id !== event.id
          )
      })
    }
  }
});
