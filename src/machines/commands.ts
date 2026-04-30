/**
 * EventCommand — discriminated union of all mutations that events can produce.
 *
 * When the event system is migrated (Phase 3, PRs 11–13), event files will
 * return `EventCommand[]` instead of calling saga generators. The game
 * machine will interpret these commands via `assign()` actions.
 *
 * Each variant maps 1:1 to a saga helper function that events currently
 * call via `yield* call(...)`. The mapping is:
 *
 *   Saga helper                        → Command type
 *   ─────────────────────────────────────────────────────
 *   incrementBalance(mgr, amt)         → "incrementBalance"
 *   decrementBalance(mgr, amt)         → "decrementBalance"
 *   setBalance(mgr, amt)               → "setBalance"
 *   incrementInsuranceExtra(mgr, amt)  → "incrementInsuranceExtra"
 *   setInsuranceExtra(mgr, val)        → "setInsuranceExtra"
 *   setExtra(mgr, extra)               → "setExtra"
 *   setFlag (manager)(mgr, flag, val)  → "setManagerFlag"
 *   setFlag (game)(flag, val)          → "setGameFlag"
 *   incrementMorale(team, amt)         → "incrementMorale"
 *   decrementMorale(team, amt)         → "decrementMorale"
 *   setMorale(team, morale)            → "setMorale"
 *   incrementStrength(team, amt)       → "incrementStrength"
 *   decrementStrength(team, amt)       → "decrementStrength"
 *   incrementReadiness(team, amt)      → "incrementReadiness"
 *   decrementReadiness(team, amt)      → "decrementReadiness"
 *   addEffect(team, param, amt, dur, extra?) → "addEffect"
 *   addOpponentEffect(team, ...)       → "addOpponentEffect"
 *   renameArena(mgr, name)             → "renameArena"
 *   setArenaLevel(mgr, level)          → "setArenaLevel"
 *   setService(mgr, svc, val)          → "setService"
 *   addAnnouncement(mgr, text)         → "addAnnouncement"
 *   addNotification(mgr, msg, type?)   → "addNotification"
 *   addNews(text)                      → "addNews"
 *   alterStrength (country)(iso, amt)  → "alterCountryStrength"
 *   teamRename(team, name)             → "renameTeam"
 *   addEvent(eventData)                → "addEvent"
 *   resolveEvent(id, event)            → "resolveEvent"
 *   setEventProcessed(id)              → "setEventProcessed"
 */

import type { TeamEffect, StoredEvent } from "./types";

// --- Manager balance & extras ---

type IncrementBalance = {
  type: "incrementBalance";
  managerId: string;
  amount: number;
};

type DecrementBalance = {
  type: "decrementBalance";
  managerId: string;
  amount: number;
};

type SetBalance = {
  type: "setBalance";
  managerId: string;
  amount: number;
};

type IncrementInsuranceExtra = {
  type: "incrementInsuranceExtra";
  managerId: string;
  amount: number;
};

type SetInsuranceExtra = {
  type: "setInsuranceExtra";
  managerId: string;
  value: number;
};

type SetExtra = {
  type: "setExtra";
  managerId: string;
  extra: number;
};

// --- Manager flags & services ---

type SetManagerFlag = {
  type: "setManagerFlag";
  managerId: string;
  flag: string;
  value: boolean;
};

type SetGameFlag = {
  type: "setGameFlag";
  flag: string;
  value: boolean | number | undefined;
};

type RenameArena = {
  type: "renameArena";
  managerId: string;
  name: string;
};

type SetArenaLevel = {
  type: "setArenaLevel";
  managerId: string;
  level: number;
};

type SetService = {
  type: "setService";
  managerId: string;
  service: string;
  value: boolean;
};

// --- Team morale ---

type IncrementMorale = {
  type: "incrementMorale";
  teamId: number;
  amount: number;
};

type DecrementMorale = {
  type: "decrementMorale";
  teamId: number;
  amount: number;
};

type SetMorale = {
  type: "setMorale";
  teamId: number;
  morale: number;
};

// --- Team strength ---

type IncrementStrength = {
  type: "incrementStrength";
  teamId: number;
  amount: number;
};

type DecrementStrength = {
  type: "decrementStrength";
  teamId: number;
  amount: number;
};

// --- Team readiness ---

type IncrementReadiness = {
  type: "incrementReadiness";
  teamId: number;
  amount: number;
};

type DecrementReadiness = {
  type: "decrementReadiness";
  teamId: number;
  amount: number;
};

// --- Team effects ---

type AddEffect = {
  type: "addEffect";
  teamId: number;
  effect: TeamEffect;
};

type AddOpponentEffect = {
  type: "addOpponentEffect";
  teamId: number;
  effect: TeamEffect;
};

// --- Team misc ---

type RenameTeam = {
  type: "renameTeam";
  teamId: number;
  name: string;
};

// --- News & notifications ---

type AddAnnouncement = {
  type: "addAnnouncement";
  managerId: string;
  announcement: string;
};

type AddNotification = {
  type: "addNotification";
  managerId: string;
  message: string;
  notificationType?: string;
};

type AddNews = {
  type: "addNews";
  text: string;
};

// --- Country ---

type AlterCountryStrength = {
  type: "alterCountryStrength";
  country: string;
  amount: number;
};

// --- Events ---

type AddEvent = {
  type: "addEvent";
  eventData: Omit<StoredEvent, "id">;
};

type ResolveEvent = {
  type: "resolveEvent";
  id: string;
  event: StoredEvent;
};

type SetEventProcessed = {
  type: "setEventProcessed";
  id: string;
};

// --- Union ---

export type EventCommand =
  // Manager balance & extras
  | IncrementBalance
  | DecrementBalance
  | SetBalance
  | IncrementInsuranceExtra
  | SetInsuranceExtra
  | SetExtra
  // Manager flags & services
  | SetManagerFlag
  | SetGameFlag
  | RenameArena
  | SetArenaLevel
  | SetService
  // Team morale
  | IncrementMorale
  | DecrementMorale
  | SetMorale
  // Team strength
  | IncrementStrength
  | DecrementStrength
  // Team readiness
  | IncrementReadiness
  | DecrementReadiness
  // Team effects
  | AddEffect
  | AddOpponentEffect
  // Team misc
  | RenameTeam
  // News & notifications
  | AddAnnouncement
  | AddNotification
  | AddNews
  // Country
  | AlterCountryStrength
  // Events
  | AddEvent
  | ResolveEvent
  | SetEventProcessed;
