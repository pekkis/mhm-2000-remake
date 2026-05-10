import type { Team } from "@/state/game";
import type { GameContext } from "@/state";
import type { Draft } from "immer";
import type { Manager } from "@/state/game";

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

/**
 * A bag of unrelated games played on the same calendar day. No
 * standings, no penalties, no colors — every match is its own little
 * universe. Used for practice / friendly matches (`harjoitusottelu`)
 * during preseason.
 */
export type IndependentGamesGroup = {
  type: "independent-games";
  round: number;
  name: string;
  teams: number[];
  schedule: Pairing[][];
  stats: never[];
};

// --- Cup matchup stat ---

export type CupMatchupTeamStat = {
  index: number;
  id: number;
  goals: number;
};

export type CupMatchupStat = {
  home: CupMatchupTeamStat;
  away: CupMatchupTeamStat;
  decided: boolean;
  victor?: "home" | "away";
};

/**
 * One round of PA Cup. Two-leg matchups (each team hosts once).
 * If aggregate goals are tied after the second leg, that leg goes to
 * sudden-death overtime — see `competitionTypes.cup.overtime` and
 * `services/cup.ts`. Stats track aggregate goals per matchup, not a
 * standings table.
 */
export type CupGroup = {
  type: "cup";
  round: number;
  name: string;
  teams: number[];
  matchups: [number, number][];
  schedule: Pairing[][];
  stats: CupMatchupStat[];
};

export type Group =
  | RoundRobinGroup
  | TournamentGroup
  | PlayoffGroup
  | IndependentGamesGroup
  | CupGroup;

// --- Phase ---

export type Phase = {
  type: "round-robin" | "playoffs" | "tournament" | "independent-games" | "cup";
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
  | "tournaments"
  // MHM 2000 calendar references these gameday ids; CompetitionDefinitions
  // for them are not built yet — see src/data/mhm2000/parse-calendar.ts.
  | "cup"
  | "practice";

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

export type GameFacts = {
  isWin: boolean;
  isDraw: boolean;
  isLoss: boolean;
};

export type HomeAndAwayTeamAdvantages = {
  home: number;
  away: number;
};

export type CompetitionDefinition = {
  data: Competition;
  relegateTo: CompetitionId | false;
  promoteTo: CompetitionId | false;

  homeAndAwayTeamAdvantages: (phase: number) => HomeAndAwayTeamAdvantages;

  moraleBoost: (phase: number, facts: GameFacts, manager: Manager) => number;
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
