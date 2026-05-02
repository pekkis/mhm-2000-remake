import type { Team } from "@/state/game";
import type { GameContext } from "@/state";
import type { Draft } from "immer";

// --- Game result ---

export type GameResult = {
  home: number;
  away: number;
  overtime: boolean;
};

// --- Pairing (a single scheduled game) ---

export type Pairing = {
  home: number;
  away: number;
  result?: GameResult;
};

// --- Stats ---

export type TeamStat = {
  index: number;
  id: number;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type MatchupTeamStat = {
  index: number;
  id: number;
  wins: number;
  losses: number;
};

export type MatchupStat = {
  home: MatchupTeamStat;
  away: MatchupTeamStat;
};

// --- Penalty ---

export type Penalty = {
  team: number;
  penalty: number;
};

// --- Groups ---

export type RoundRobinGroup = {
  type: "round-robin";
  round: number;
  name: string;
  teams: number[];
  times?: number;
  schedule: Pairing[][];
  stats: TeamStat[];
  penalties: Penalty[];
  colors: string[];
};

export type TournamentGroup = {
  type: "tournament";
  round: number;
  name: string;
  teams: number[];
  schedule: Pairing[][];
  stats: TeamStat[];
  penalties: Penalty[];
  colors: string[];
};

export type PlayoffGroup = {
  type: "playoffs";
  round: number;
  name?: string;
  teams: number[];
  matchups: [number, number][];
  winsToAdvance: number;
  schedule: Pairing[][];
  stats: MatchupStat[];
};

export type Group = RoundRobinGroup | TournamentGroup | PlayoffGroup;

// --- Phase ---

export type Phase = {
  type: "round-robin" | "playoffs" | "tournament";
  name: string;
  teams: number[];
  groups: Group[];
};

// --- Competition (in state.game.competitions) ---

export type CompetitionId =
  | "phl"
  | "division"
  | "mutasarja"
  | "ehl"
  | "tournaments";

export type Competition = {
  id: CompetitionId;
  abbr: string;
  name: string;
  weight: number;
  phase: number;
  teams: number[];
  phases: Phase[];
};

// --- Competition Definitions (the imported data file, has functions) ---

export type GamedayAdvantage = {
  home: (team: Team) => number;
  away: (team: Team) => number;
};

export type GamedayParams = {
  advantage: GamedayAdvantage;
  base: () => number;
  moraleEffect: (team: Team) => number;
};

export type CompetitionParameters = {
  gameday: (phase: number, group?: number) => GamedayParams;
};

export type GameFacts = {
  isWin: boolean;
  isDraw: boolean;
  isLoss: boolean;
};

export type CompetitionDefinition = {
  data: Competition;
  relegateTo: string | false;
  promoteTo: string | false;
  parameters: CompetitionParameters;
  gameBalance: (phase: number, facts: GameFacts, manager: any) => number;
  moraleBoost: (phase: number, facts: GameFacts, manager: any) => number;
  readinessBoost: (phase: number, facts: GameFacts, manager: any) => number;
  seed: Array<
    (competitions: Record<CompetitionId, Competition>, context?: any) => Phase
  >;
  /**
   * Optional pure context-builders for `seed[phase]`. Indexed by phase.
   * Each function reads `GameContext` and returns whatever shape the
   * matching seeder expects as its `context` argument. Phases that don't
   * need extra context can be left undefined / sparse.
   */
  seedContext?: Array<((ctx: GameContext) => unknown) | undefined>;
  /**
   * Optional per-competition hook called from `executeGameday` when a
   * group's schedule is exhausted (i.e. the round just played was the
   * final one). Mutates the draft in place. Competitions without
   * end-of-group bookkeeping (PHL, division) omit it.
   */
  groupEnd?: (
    draft: Draft<GameContext>,
    args: { phase: number; groupIdx: number; group: Group }
  ) => void;
};
