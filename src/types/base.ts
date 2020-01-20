import { Effect } from "redux-saga/effects";
import { List } from "immutable";
import { Team } from "./team";
import { Manager } from "./manager";

export type MHMEventTypes = "manager";

export type MHMEventGenerator = Generator<Effect, void, unknown>;

export interface MHMEventHandler {
  type: MHMEventTypes;
  create: (data: any) => MHMEventGenerator;
  render: (data: any) => List<string>;
  process: (data: any) => MHMEventGenerator;
}

export type MHMTurnPhase =
  | "invitationsProcess"
  | "invitationsCreate"
  | "gala"
  | "endOfSeason"
  | "startOfSeason"
  | "action"
  | "prank"
  | "gameday"
  | "results"
  | "calculations"
  | "eventCreation"
  | "event"
  | "news"
  | "worldChampionships"
  | "seed"
  | "selectStrategy"
  | "championshipBetting";

export type MHMTurnPhasesList = MHMTurnPhase[];

export interface MHMCompetitionSeedDefinition {
  competition: CompetitionNames;
  phase: number;
}

export interface MHMTurnDefinition {
  round: number;
  phases: MHMTurnPhasesList;
  gamedays: CompetitionNameList;
  pranks: boolean;
  createRandomEvent: boolean;
  crisisMeeting: boolean;
  transferMarket: boolean;
  seed: MHMCompetitionSeedDefinition[];
  title?: string;
}

export type MHMTurnExtraOptions = Omit<
  MHMTurnDefinition,
  "phases" | "gamedays" | "seed"
>;

export type MHMCalendar = MHMTurnDefinition[];

export type Competitions = {
  phl: Competition;
  division: Competition;
  ehl: Competition;
  tournaments: Competition;
  mutasarja: Competition;
};

export type CompetitionNames = keyof Competitions;
export type CompetitionNameList = CompetitionNames[];

export interface Competition {
  id: CompetitionNames;
  weight: number;
  teams: string[];
  abbr: string;
  name: string;
  phase: number;
  phases: CompetitionPhase[];
}

export type CompetitionTypes =
  | "round-robin"
  | "playoffs"
  | "tournament"
  | "training";

export interface TeamPenalty {
  team: string;
  points: number;
}

export type Schedule = ScheduleRound[];
export type ScheduleRound = ScheduleGame[];

export interface ScheduleGame {
  home: number;
  away: number;
  result?: MatchResult;
}

export interface MatchResult {
  audience: number;
  home: number;
  away: number;
  overtime: boolean;
}

export interface MatchInput {
  competition: {
    id: CompetitionNames;
    phase: number;
    group: number;
  };

  teams: {
    home: Team;
    away: Team;
  };
}

export interface MatchOutput {
  result: MatchResult;
}

export interface MatchResultsSet {
  competition: number;
  phase: number;
  group: number;
  round: number;
  results: Required<MatchResult>[];
}

export type PlayoffsStats = PlayoffStat[];

export interface PlayoffStat {
  home: PlayoffTeamStat;
  away: PlayoffTeamStat;
}

export interface PlayoffTeamStat {
  index: number;
  id: string;
  wins: number;
  losses: number;
}

export interface CompetitionGroup {
  type: CompetitionTypes;
  round: number;
  schedule: Schedule;
  name: string;
  teams: string[];
}

export const isRoundRobinCompetitionGroup = (
  group: CompetitionGroup
): group is RoundRobinCompetitionGroup => {
  return group.type === "round-robin";
};

export interface RoundRobinCompetitionGroup extends CompetitionGroup {
  penalties: TeamPenalty[];
  type: "round-robin";
  times: number;
  colors: Color[];
  stats: LeagueTable;
}

export const isTournamentCompetitionGroup = (
  group: CompetitionGroup
): group is TournamentCompetitionGroup => {
  return group.type === "tournament";
};

export interface TournamentCompetitionGroup extends CompetitionGroup {
  penalties: TeamPenalty[];
  type: "tournament";
  colors: Color[];
  stats: LeagueTable;
}

export const isPlayoffsCompetitionGroup = (
  group: CompetitionGroup
): group is PlayoffsCompetitionGroup => {
  return group.type === "playoffs";
};

export interface PlayoffsCompetitionGroup extends CompetitionGroup {
  type: "playoffs";
  matchups: Matchups;
  winsToAdvance: number;
  stats: PlayoffsStats;
}

type Color = "l" | "d";

interface BaseCompetitionPhase {
  name: string;
  type: CompetitionTypes;
  teams: string[];
  groups: CompetitionGroup[];
}

export interface RoundRobinCompetitionPhase extends BaseCompetitionPhase {
  groups: RoundRobinCompetitionGroup[];
}

export interface PlayoffsCompetitionPhase extends BaseCompetitionPhase {
  groups: PlayoffsCompetitionGroup[];
}

export interface TournamentCompetitionPhase extends BaseCompetitionPhase {
  groups: TournamentCompetitionGroup[];
}

export type CompetitionPhase =
  | RoundRobinCompetitionPhase
  | PlayoffsCompetitionPhase
  | TournamentCompetitionPhase;

export interface Facts {
  isLoss: boolean;
  isDraw: boolean;
  isWin: boolean;
}

export type Matchups = Matchup[];
export type Matchup = [number, number];

export interface Managers {
  [key: string]: Manager;
}

export interface Turn {
  season: number;
  round: number;
  phase: MHMTurnPhase | undefined;
}

export interface Flags {
  jarko: boolean;
  usa: boolean;
  canada: boolean;
}

export interface ServiceBasePrices {
  insurance: number;
  coach: number;
  microphone: number;
  cheer: number;
}

export interface CompetitionService {
  homeAdvantage: (phase: number, group: number) => number;
  awayAdvantage: (phase: number, group: number) => number;

  gameBalance: (phase: number, facts: Facts, manager: Manager) => number;
  moraleBoost: (phase: number, facts: Facts, manager: Manager) => number;
  readinessBoost: (phase: number, facts: Facts, manager: Manager) => number;

  start?: () => Generator<any, any, any>;
  groupEnd?: (phase: number, group: number) => Generator<any, void, any>;

  relegateTo: CompetitionNames | false;
  promoteTo: CompetitionNames | false;

  parameters: {
    gameday: (
      phase: number
    ) => {
      advantage: {
        home: (team: Team) => number;
        away: (team: Team) => number;
      };
      base: () => number;
      moraleEffect: (team: Team) => number;
    };
  };

  seed: ((
    competitions: Competitions
  ) => CompetitionPhase | Generator<any, CompetitionPhase, any>)[];
}

export type LeagueTable = LeagueTableRow[];

export interface LeagueTableRow {
  index: number;
  id: string;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Invitation {
  id: string;
  manager: string;
  duration: number;
  participate: boolean | undefined;
  tournament: number;
}

export type ForEvery<L extends string | symbol | number, T> = {
  [P in L]: T;
};

export type ForEveryCompetition<T> = ForEvery<CompetitionNames, T>;

export type ForEveryManager<T> = {
  [key: string]: T;
};

export interface Announcement {
  content: string;
}

export interface NewsPiece {
  content: string;
}

export interface Prank {
  id: string;
  manager: string;
  victim: number;
  type: number;
}

export interface MHMEvent {
  id: string;
}

export interface DifficultyLevelMap {
  1: DifficultyLevel;
  2: DifficultyLevel;
  3: DifficultyLevel;
  4: DifficultyLevel;
  5: DifficultyLevel;
}

export type DifficultyLevels = keyof DifficultyLevelMap;

export interface DifficultyLevel {
  name: string;
  description: string;
  value: number;
  moraleMin: number;
  moraleMax: number;
}

export type MapOf<T> = {
  [key: string]: T;
};
