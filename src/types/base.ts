import { Effect } from "redux-saga/effects";
import { Team } from "./team";
import { Manager } from "./manager";

export type MHMEventTypes = "manager";

export type MHMEventGenerator = Generator<Effect, void, unknown>;

export interface MHMEventHandler {
  type: MHMEventTypes;
  create: (data: any) => MHMEventGenerator;
  render: (data: any) => string[];
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
  | "championshipBetting"
  | "cleanup";

export type MHMTurnPhasesList = MHMTurnPhase[];

export interface MHMCompetitionSeedDefinition {
  competition: CompetitionNames;
  phase: number;
}

export interface AiTurnInfo {
  actions: string[];
}

export interface CalendarEntry {
  round: number;
  ai?: AiTurnInfo;
  phases: MHMTurnPhasesList;
  gamedays: CompetitionNameList;
  pranks: boolean;
  createRandomEvent: boolean;
  crisisMeeting: boolean;
  transferMarket: boolean;
  seed: MHMCompetitionSeedDefinition[];
  title?: string;
  tags: string[];
}

export type MHMTurnExtraOptions = Omit<
  CalendarEntry,
  "phases" | "gamedays" | "seed"
>;

export type MHMCalendar = CalendarEntry[];

export type Competitions = {
  phl: Competition;
  division: Competition;
  ehl: Competition;
  tournaments: Competition;
  mutasarja: Competition;
  cup: Competition;
  training: Competition;
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
  | "training"
  | "cup";

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

export type PartialMatchResult = Omit<MatchResult, "overtime" | "audience">;

export interface MatchResult {
  audience: number;
  home: number;
  away: number;
  overtime: boolean;
}

export interface MatchOvertimeType {
  type: "continuous" | "5min";
}

export interface MatchInput {
  competition: Competition;
  phase: CompetitionPhase;
  group: CompetitionGroup;
  matchup: number;
  teams: {
    home: Team;
    away: Team;
  };
}

export interface MatchOutput {
  result: MatchResult;
}

export interface MatchResultsSet {
  competition: CompetitionNames;
  phase: number;
  group: number;
  round: number;
  results: Required<MatchResult>[];
}

export interface MatchDescriptor {
  home: number;
  away: number;
  index: {
    home: string;
    away: string;
  };
  competition: CompetitionNames;
  phase: number;
  group: number;
  result?: MatchResult;
}

export interface MatchFacts {
  isWin: boolean;
  isDraw: boolean;
  isLoss: boolean;
  goalsFor: number;
  goalsAgainst: number;
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

export type CupStats = CupStat[];

export interface CupStat {
  home: CupTeamStat;
  away: CupTeamStat;
}

export interface CupTeamStat {
  index: number;
  id: string;
  goalsFor: number;
  goalsAgainst: number;
}

export interface TrainingStats {}

export interface CompetitionGroup {
  id: number;
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

export const isTrainingompetitionGroup = (
  group: CompetitionGroup
): group is TrainingCompetitionGroup => {
  return group.type === "training";
};

export interface TrainingCompetitionGroup extends CompetitionGroup {
  penalties: TeamPenalty[];
  type: "training";
  stats: TrainingStats;
}

export const isCupCompetitionGroup = (
  group: CompetitionGroup
): group is CupCompetitionGroup => {
  return group.type === "cup";
};

export interface CupCompetitionGroup extends CompetitionGroup {
  penalties: TeamPenalty[];
  matchups: Matchups;
  type: "cup";
  stats: CupStats;
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
  id: number;
  name: string;
  type: CompetitionTypes;
  teams: string[];
  groups: CompetitionGroup[];
}

export interface RoundRobinCompetitionPhase extends BaseCompetitionPhase {
  groups: RoundRobinCompetitionGroup[];
}

export interface CupCompetitionPhase extends BaseCompetitionPhase {
  groups: CupCompetitionGroup[];
}

export interface TrainingCompetitionPhase extends BaseCompetitionPhase {
  groups: TrainingCompetitionGroup[];
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
  | TournamentCompetitionPhase
  | CupCompetitionPhase
  | TrainingCompetitionPhase;

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
  subphase?: string;
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
  canChooseIntensity: (phase: number, group: number) => boolean;

  homeAdvantage: (phase: number, group: number) => number;
  awayAdvantage: (phase: number, group: number) => number;

  gameBalance: (phase: number, facts: Facts, manager: Manager) => number;
  moraleBoost: (phase: number, facts: Facts) => number;

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

export type DifficultyLevelNames = 1 | 2 | 3 | 4 | 5;

export interface OrganizationPrices {
  coaching: number[];
  goalieCoaching: number[];
  juniorAcademy: number[];
  care: number[];
  benefits: number[];
}

export interface DifficultyLevel {
  name: string;
  description: string;
  value: number;
  moraleMin: number;
  moraleMax: number;
  sponsorshipModifier: () => number;
  organizationPrices: () => OrganizationPrices;
  injuryChance: () => number;
}

export type MapOf<T> = {
  [key: string]: T;
};

export type SeasonStrategies = "simonov" | "kaikkipeliin" | "puurto";

export interface SeasonStrategy {
  weight: number;
  id: string;
  name: string;
  description: string;
  initialReadiness: (manager: Manager) => number;
  incrementReadiness: (turn: Turn) => number;
}

export type FinancialTransactionCategory =
  | "other"
  | "salary"
  | "sponsorship"
  | "attendance"
  | "reward";

export interface FinancialTransaction {
  team: string;
  season: number;
  round: number;
  amount: number;
  category: FinancialTransactionCategory;
  reference?: string;
}
