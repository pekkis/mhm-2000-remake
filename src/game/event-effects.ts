import type { Draft } from "immer";

import difficultyLevels from "@/data/difficulty-levels";
import type { GameContext } from "@/state";
import type { GameFlags, Team, TeamEffect } from "@/state/game";
import type { CompetitionId } from "@/types/competitions";
import type { BaseEventCreationFields } from "@/types/base";
import type { NotificationData } from "@/machines/notification";
import { computeStats } from "@/services/competition-type";
import { humanManagerById } from "@/machines/selectors";
import type { CountryIso } from "@/data/countries";
import type { MarketPlayer } from "@/state/player";
import type { RegularContract } from "@/state/player";

/**
 * Look up the morale clamp for a team. Mirrors `getMoraleMinMax` in
 * the deleted `src/sagas/team.ts`: a team's clamp comes from its
 * manager's difficulty (default 2 if NPC / unmanaged).
 */
function moraleClamp(
  draft: Draft<GameContext>,
  team: Draft<Team>
): { min: number; max: number } {
  const managerId = team.manager;
  const manager = managerId ? draft.managers[managerId] : undefined;

  if (!manager) {
    throw new Error(`Teaim ${team.name} has no manager`);
  }

  const difficulty = manager.difficulty;

  return {
    min: difficultyLevels[difficulty].moraleMin,
    max: difficultyLevels[difficulty].moraleMax
  };
}

/**
 * Spawn-event injection point. The interpreter doesn't know about the
 * event registry (cycle: registry imports `EventEffect`). The machine
 * layer provides this function when calling `applyEffects` so the
 * `spawnEvent` effect can resolve to a real `event.create(ctx, seed)`
 * + push into `draft.event.events`. Pranks rely on this to fire
 * follow-up events (`protest`, `bazookaStrike`, …).
 */
export type SpawnEventFn = (
  draft: Draft<GameContext>,
  eventId: string,
  seed: BaseEventCreationFields
) => void;

/**
 * Notification injection point. Notifications live in the invoked
 * `notifications` child actor — NOT on `GameContext` — so the pure
 * draft interpreter can't deliver them. The machine layer provides a
 * callback that the caller drains after `produce()` returns,
 * forwarding each collected notification to the child via `sendTo`.
 *
 * Same shape as the in-machine `notify` action's `notification`
 * parameter (id is assigned at the boundary, optional `timeout`).
 */
export type NotifyFn = (
  notification: Omit<NotificationData, "id"> & { timeout?: number }
) => void;

/**
 * Declarative effect descriptors.
 *
 * Events return a list of these from their pure `process(ctx, data)`
 * function. The interpreter (`applyEffect`) translates each descriptor
 * into a draft mutation. This keeps event files saga-free, fully
 * serializable (effect lists could be logged/replayed), and trivially
 * testable as `process(ctx, data) === expected`.
 *
 * The alphabet was extracted by reading every saga helper called from
 * the 96 event `process`/`create`/`resolve` functions. If a new event
 * needs a verb that isn't here, add it to the union and to
 * `applyEffect` — don't reach for an escape hatch.
 *
 * Random rolls happen during `create`/`resolve` (where they're baked
 * into the stored payload) — `process` is fully deterministic.
 */
export type EventEffect =
  // ── Manager balance ──
  | { type: "incrementBalance"; manager: string; amount: number }
  | { type: "decrementBalance"; manager: string; amount: number }
  | { type: "setBalance"; manager: string; amount: number }

  // ── Manager arena / extras / services ──
  | { type: "setArenaLevel"; manager: string; level: number }
  | { type: "renameArena"; manager: string; name: string }
  | { type: "hireManager"; manager: string; team: number }

  // ── Team strength / morale / readiness / strategy ──
  | { type: "incrementMorale"; team: number; amount: number }
  | { type: "decrementMorale"; team: number; amount: number }
  | { type: "setMorale"; team: number; value: number }
  | { type: "setStrategy"; team: number; value: number }
  | { type: "renameTeam"; team: number; name: string }

  // ── Team buffs / debuffs ──
  | { type: "addTeamEffect"; team: number; effect: TeamEffect }
  | { type: "addOpponentEffect"; team: number; effect: TeamEffect }

  // ── Competition penalties ──
  | {
      type: "incurPenalty";
      competition: CompetitionId;
      phase: number;
      group: number;
      team: number;
      penalty: number;
    }

  // ── Game-level state ──
  | {
      type: "setGameFlag";
      flag: keyof GameFlags;
      value: GameFlags[keyof GameFlags];
    }
  | {
      type: "setManagerFlag";
      manager: string;
      flag: string;
      value: boolean;
    }

  // ── Country strength (used by attitude-canada / attitude-usa) ──
  | { type: "alterCountryStrength"; country: CountryIso; amount: number }

  // ── News (events sometimes push announcements during process) ──
  | { type: "addAnnouncement"; manager: string; text: string }

  // ── Transient toast notification ──
  // Delivered to the `notifications` child actor by the machine-layer
  // `NotifyFn` (see top of file). Use this for short-lived UI feedback
  // ("Peli tallennettiin.", "Voitit kavioveikkauksessa…"). For
  // persistent per-manager news entries, use `addAnnouncement` instead.
  | {
      type: "notify";
      manager: string;
      message: string;
      notificationType?: string;
      timeout?: number;
    }

  // ── Spawn another event ──
  // Resolved by the machine-layer `SpawnEventFn` (see top of file). The
  // interpreter delegates because the event registry can't be imported
  // here without forming a cycle. Used by pranks (`protest`,
  // `bazookaStrike`, …) and any future event that wants to chain.
  | {
      type: "spawnEvent";
      eventId: string;
      seed: BaseEventCreationFields;
    }

  // ── Transfer market ──
  | {
      type: "signMarketPlayer";
      manager: string;
      player: MarketPlayer;
      contract: RegularContract;
      playerWasHappy: boolean;
    }
  | {
      type: "irritateMarketPlayer";
      managerId: string;
      playerId: string;
    };

/**
 * Apply a single effect to a game-context draft. Pure mutation —
 * never reads anything not on `effect` (lookups must happen in the
 * event's `process` function and be encoded into the descriptor).
 *
 * Use from inside an `assign(({context}) => produce(context, draft => …))`
 * pass: walk the effect list, call `applyEffect(draft, effect, spawn)`
 * for each.
 */
export function applyEffect(
  draft: Draft<GameContext>,
  effect: EventEffect,
  spawn: SpawnEventFn,
  notify: NotifyFn
): void {
  console.log(`EFFECT :: ${effect.type} `, effect);

  switch (effect.type) {
    // ── Manager balance ──
    case "incrementBalance": {
      const m = humanManagerById(effect.manager)(draft);
      if (m) {
        m.balance += effect.amount;
      }
      return;
    }
    case "decrementBalance": {
      const m = humanManagerById(effect.manager)(draft);
      if (m) {
        m.balance -= effect.amount;
      }
      return;
    }
    case "setBalance": {
      const m = humanManagerById(effect.manager)(draft);
      if (m) {
        m.balance = effect.amount;
      }
      return;
    }

    // ── Manager arena / extras / services ──
    case "setArenaLevel": {
      const m = humanManagerById(effect.manager)(draft);
      if (m) {
        m.arena.level = effect.level;
      }
      return;
    }
    case "renameArena": {
      const m = humanManagerById(effect.manager)(draft);
      if (m) {
        m.arena.name = effect.name;
      }
      return;
    }
    case "hireManager": {
      const m = humanManagerById(effect.manager)(draft);
      if (!m) {
        return;
      }
      if (m.team !== undefined) {
        const oldTeam = draft.teams[m.team];
        if (oldTeam) {
          oldTeam.manager = undefined;
        }
      }
      const newTeam = draft.teams[effect.team];
      if (newTeam) {
        newTeam.manager = effect.manager;
      }
      m.team = effect.team;
      return;
    }

    case "incrementMorale": {
      const t = draft.teams[effect.team];
      if (t) {
        const { min, max } = moraleClamp(draft, t);
        t.morale = Math.min(max, Math.max(min, t.morale + effect.amount));
      }
      return;
    }
    case "decrementMorale": {
      const t = draft.teams[effect.team];
      if (t) {
        const { min, max } = moraleClamp(draft, t);
        t.morale = Math.min(max, Math.max(min, t.morale - effect.amount));
      }
      return;
    }
    case "setMorale": {
      const t = draft.teams[effect.team];
      if (t) {
        const { min, max } = moraleClamp(draft, t);
        t.morale = Math.min(max, Math.max(min, effect.value));
      }
      return;
    }
    case "setStrategy": {
      const t = draft.teams[effect.team];
      if (t) {
        t.strategy = effect.value;
      }
      return;
    }
    case "renameTeam": {
      const t = draft.teams[effect.team];
      if (t) {
        t.name = effect.name;
      }
      return;
    }

    // ── Team buffs / debuffs ──
    case "addTeamEffect": {
      const t = draft.teams[effect.team];
      if (t) {
        t.effects.push(effect.effect);
      }
      return;
    }
    case "addOpponentEffect": {
      const t = draft.teams[effect.team];
      if (t) {
        t.opponentEffects.push(effect.effect);
      }
      return;
    }

    // ── Competition penalties ──
    case "incurPenalty": {
      const phase =
        draft.competitions[effect.competition]?.phases[effect.phase];
      const group = phase?.groups[effect.group];
      if (!group || group.type !== "round-robin") {
        return;
      }
      group.penalties.push({ team: effect.team, penalty: effect.penalty });
      // 1-1 port of `incurPenalty` saga: recompute standings after penalty.
      group.stats = computeStats(group);
      return;
    }

    // ── Game-level state ──
    case "setGameFlag": {
      // Cast: discriminated union loses per-flag value type after
      // narrowing on `flag`. `setGameFlag` is the boundary; callers
      // (event `process` fns) carry the type safety by construction.
      (draft.flags[effect.flag] as GameFlags[keyof GameFlags]) = effect.value;
      return;
    }
    case "setManagerFlag": {
      const m = humanManagerById(effect.manager)(draft);
      if (m) {
        m.flags[effect.flag] = effect.value;
      }
      return;
    }

    // ── Country strength ──
    case "alterCountryStrength": {
      const country = draft.country.countries[effect.country];
      if (country && country.strength !== undefined) {
        country.strength += effect.amount;
      }
      return;
    }

    // ── News ──
    case "addAnnouncement": {
      if (!draft.news.announcements[effect.manager]) {
        draft.news.announcements[effect.manager] = [];
      }
      draft.news.announcements[effect.manager].push(effect.text);
      return;
    }

    // ── Transient toast ──
    case "notify": {
      notify({
        manager: effect.manager,
        message: effect.message,
        type: effect.notificationType ?? "info",
        ...(effect.timeout !== undefined && { timeout: effect.timeout })
      });
      return;
    }

    // ── Spawn another event ──
    case "spawnEvent": {
      spawn(draft, effect.eventId, effect.seed);
      return;
    }

    // ── Transfer market ──
    case "signMarketPlayer": {
      const m = humanManagerById(effect.manager)(draft);
      if (!m || m.team === undefined) {
        return;
      }
      const team = draft.teams[m.team];
      if (!team || team.kind !== "human") {
        return;
      }
      const { askingSalary: _, type: __, ...baseFields } = effect.player;
      team.players[effect.player.id] = {
        ...baseFields,
        type: "hired",
        contract: effect.contract,
        tags: []
      };
      delete draft.transferMarket.players[effect.player.id];
      return;
    }
    case "irritateMarketPlayer": {
      const player = draft.transferMarket.players[effect.playerId];
      if (player) {
        player.tags.push(`irritated:${effect.managerId}`);
      }
      return;
    }
  }
}

/**
 * Convenience wrapper. Walks an effect list applying each.
 */
export function applyEffects(
  draft: Draft<GameContext>,
  effects: EventEffect[],
  spawn: SpawnEventFn,
  notify: NotifyFn
): void {
  for (const effect of effects) {
    applyEffect(draft, effect, spawn, notify);
  }
}
