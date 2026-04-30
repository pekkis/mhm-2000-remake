import type { GameContext } from "@/state";
import type { BaseEventCreationFields, BaseEventFields } from "@/types/base";
import type { EventEffect } from "@/game/event-effects";

/**
 * Declarative, saga-free event definition.
 *
 * Lives parallel to the legacy generator-based `MHMEvent` in
 * `@/types/base` during the migration. New events go in
 * `src/game/new-events/`; the machine's event-creation and event
 * phases will pick the new shape as files are ported.
 *
 * Contract:
 *   - `create` is pure. May read `ctx`. May roll random — random
 *     outcomes are baked into the returned payload (save-scummers
 *     beware: all rolls happen at event-creation time, mirroring the
 *     original 1997 game's behavior anyway).
 *   - `render` and `options` are pure functions of the stored data.
 *   - `resolve` is pure. Called once per event:
 *       * If `options` is defined → called with the player's choice.
 *       * If `options` is undefined → called with `"auto"` during the
 *         event phase entry.
 *       * If `resolve` itself is undefined → the data IS the resolved
 *         payload (e.g. `pirka`, where everything is decided at
 *         creation time).
 *   - `process` is pure. Returns an effect list that the interpreter
 *     applies to the game context. Never mutates anything.
 *
 * The interpreter (the machine's `event_creation` + `event` actions)
 * owns:
 *   - assigning `id` (via `crypto.randomUUID()`) on creation
 *   - setting `resolved: false` on creation, flipping to `true` after
 *     `resolve` runs
 *   - setting `processed: true` after the effect list is applied
 *   - looping through unresolved auto-resolve events on entry
 *   - waiting for `RESOLVE_EVENT` on interactive ones
 */
export type DeclarativeEvent<
  TData extends BaseEventFields,
  CData extends BaseEventCreationFields = BaseEventCreationFields
> = {
  type: "manager";

  /**
   * Build the event payload from current ctx + creation seed.
   * Return `null` to skip event creation (e.g. preconditions not met).
   */
  create: (ctx: GameContext, seed: CData) => Omit<TData, "id"> | null;

  /** Pure markdown lines for the event card. */
  render: (data: TData) => string[];

  /**
   * Player resolution options. Omit for events that have no player
   * choice — the interpreter will auto-resolve them on entry to the
   * event phase.
   */
  options?: (data: TData) => Record<string, string>;

  /**
   * Resolve the event. Pure. May read `ctx`. May roll random.
   * Returns the resolved payload (with whatever extra fields the
   * resolution decided — e.g. `agree: true`, `support: false`,
   * `hasInsurance: true`).
   *
   * Omit if the data is fully determined at creation time
   * (e.g. simple gift events like `pirka`).
   */
  resolve?: (ctx: GameContext, data: TData, value: string) => TData;

  /**
   * Translate a resolved event into a list of game-state effects.
   * Pure: must not mutate anything. The interpreter walks the list
   * via `applyEffect()`.
   */
  process: (ctx: GameContext, data: TData) => EventEffect[];
};
