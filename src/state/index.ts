/**
 * Unified state-shape types.
 *
 * These types describe the shape of the game's state, decoupled from
 * any particular state-management library. They are consumed by the
 * Redux ducks (during the transition) and by the XState machines.
 */

export type {
  Team,
  TeamEffect,
  GameFlags,
  WorldChampionshipEntry,
  GameState,
  Manager,
  HumanManager,
  AIManager,
  ManagerArena,
  SeasonAction
} from "./game";
export type { HumanState } from "./human";
export type { StoredEvent, EventState } from "./event";
export type { Invitation, InvitationState } from "./invitation";
export type { MetaManager, MetaState } from "./meta";
export type { NewsState } from "./news";
export type { Notification, NotificationState } from "./notification";
export type { PrankState } from "./prank";
export type { Streak, GameRecord, SeasonStats, StatsState } from "./stats";
export type { UiState } from "./ui";
export type { Country, CountryState } from "./country";
export type { BettingState } from "./betting";

export type { GameContext } from "./game-context";
export { createDefaultGameContext } from "./defaults";
