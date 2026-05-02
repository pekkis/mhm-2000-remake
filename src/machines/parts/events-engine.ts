import newEvents from "@/game/new-events";
import type { DeclarativeEvent } from "@/types/event";
import type { BaseEventFields, BaseEventCreationFields } from "@/types/base";
import type { NotifyFn, SpawnEventFn } from "@/game/event-effects";
import type { GameContext } from "@/state";
import { produce, type Draft } from "immer";
import type { NotificationData } from "@/machines/notification";
import { createUniqueId } from "@/services/id";

// Heterogeneous registry lookup — `newEvents` is `as const` for per-event
// payload typing at known keys; the interpreter looks events up by string
// from `eventsMap`, so we widen here. See `new-events/index.ts` for why.
export const eventRegistry = newEvents as unknown as Record<
  string,
  DeclarativeEvent<BaseEventFields, BaseEventCreationFields> | undefined
>;

/**
 * Resolve a `spawnEvent` effect against the registry: build the event's
 * payload via `def.create(ctx, seed)` and push it into the events map.
 * Lives in the machine layer so `event-effects.ts` doesn't need to
 * import the registry (which would form a cycle through every event
 * file). Threaded through `applyEffects(...)`.
 */
export const spawnEvent: SpawnEventFn = (draft, eventId, seed) => {
  const def = eventRegistry[eventId];
  if (!def) {
    return;
  }
  const payload = def.create(draft as GameContext, seed);
  if (!payload) {
    return;
  }
  const id = createUniqueId();
  draft.event.events[id] = { ...payload, id };
};

/**
 * One notify-effect collection on its way out of an `enqueueActions`
 * pass. Carries everything the `notifications` child needs except the
 * id (assigned at flush time so each toast gets its own UUID).
 */
export type PendingNotification = Omit<NotificationData, "id"> & {
  timeout?: number;
};

/**
 * Minimal slice of XState's `enqueue` object that `runInterpreter`
 * touches. Typed loosely so we don't have to thread the full
 * `EnqueueObject<...>` generic stew through here — the call sites
 * (inside `enqueueActions(...)`) already get strong typing for free.
 */
type InterpreterEnqueue = {
  assign: (assigner: GameContext) => void;
  sendTo: (target: string, event: unknown) => void;
};

/**
 * Run an effect-producing body against a fresh draft of `context`,
 * then drain any notifications it queued out to the `notifications`
 * child actor.
 *
 * Encapsulates the "produce + collect + sendTo" dance that every
 * `applyEffects` caller would otherwise repeat. Makes adding new
 * side-effect channels (e.g. `enqueue.spawn(betActor)` once bets are
 * actorized) a one-place change.
 *
 * Notifications can't be a draft mutation — they live in a child
 * actor, not on `GameContext` — so the body collects them through a
 * `NotifyFn` and we forward each one via `sendTo` after `produce()`
 * returns.
 */
export function runInterpreter(
  context: GameContext,
  enqueue: InterpreterEnqueue,
  body: (draft: Draft<GameContext>, notify: NotifyFn) => void
): void {
  const pending: PendingNotification[] = [];
  const notify: NotifyFn = (n) => pending.push(n);
  enqueue.assign(
    produce(context, (draft) => {
      body(draft, notify);
    })
  );
  for (const n of pending) {
    enqueue.sendTo("notifications", {
      type: "PUSH" as const,
      notification: { id: createUniqueId(), ...n }
    });
  }
}
