/**
 * XState GameContext — the unified game state type.
 *
 * This is the shape that `gameMachine.context` will hold once the XState
 * migration is complete. It is the union of all current Redux duck state
 * shapes, flattened into a single object.
 *
 * During the migration this type is used for:
 *   - Typing context-aware selectors (`src/machines/selectors.ts`)
 *   - Typing event commands (`src/machines/commands.ts`)
 *   - Gradually replacing `RootState` in new code
 *
 * The type intentionally re-exports constituent types from their current
 * homes so that a single import gives access to the full vocabulary.
 */

// --- Re-exports of state-shape types (canonical home: @/state) ---

export type * from "@/state";
export type { PrankInstance } from "@/game/pranks";
export type { ManagerDefinition } from "@/data/managers";

export type {
  Competition,
  CompetitionId,
  Phase,
  Group,
  RoundRobinGroup,
  TournamentGroup,
  PlayoffGroup,
  Pairing,
  GameResult,
  TeamStat,
  MatchupStat,
  MatchupTeamStat,
  Penalty
} from "@/types/competitions";

// --- GameContext lives in @/state and is re-exported via the barrel above. ---
