import { Effect } from "redux-saga/effects";
import { List } from "immutable";

export type MHMEventTypes = "manager";

export type MHMEventGenerator = Generator<Effect, void, unknown>;

export interface MHMEvent {
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
  | "seed";

export type MHMCompetition =
  | "phl"
  | "division"
  | "mutasarja"
  | "ehl"
  | "tournaments";

export type MHMCompetitionsList = MHMCompetition[];

export type MHMTurnPhasesList = MHMTurnPhase[];

export interface MHMCompetitionSeedDefinition {
  competition: MHMCompetition;
  phase: number;
}

export interface MHMTurnDefinition {
  round: number;
  phases: MHMTurnPhasesList;
  gamedays: MHMCompetitionsList;
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
