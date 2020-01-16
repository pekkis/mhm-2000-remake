import {
  ForEveryCompetition,
  Competition,
  CompetitionNames,
  CompetitionPhase
} from "../types/base";
import {
  over,
  lensPath,
  reject,
  append,
  set,
  lensProp,
  map,
  mergeLeft
} from "ramda";
import {
  GameSeasonStartAction,
  GAME_SEASON_START,
  GameLoadStateAction,
  GameQuitToMainMenuAction,
  GAME_LOAD_STATE,
  GAME_QUIT_TO_MAIN_MENU
} from "./game";
import { namesToIds } from "../services/team";

export interface CompetitionState {
  competitions: ForEveryCompetition<Competition>;
}

const defaultState: CompetitionState = {
  competitions: {
    phl: {
      weight: 500,
      id: "phl",
      abbr: "phl",
      phase: -1,
      name: "PHL",
      teams: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      phases: []
    },
    division: {
      abbr: "div",
      weight: 1000,
      id: "division",
      phase: -1,
      name: "Divisioona",
      teams: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      phases: []
    },
    mutasarja: {
      abbr: "mut",
      weight: 2000,
      id: "mutasarja",
      phase: -1,
      name: "Mutasarja",
      teams: [
        12,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47
      ],
      phases: []
    },
    tournaments: {
      weight: 2000,
      id: "tournaments",
      phase: -1,
      name: "Joulutauon turnaukset",
      abbr: "tournaments",
      phases: [],
      teams: []
    },
    ehl: {
      weight: 2000,
      id: "ehl",
      phase: -1,
      name: "EHL",
      abbr: "ehl",
      phases: [],
      teams: []
    }
  }
};

const COMPETITION_ADD_TEAM = "COMPETITION_ADD_TEAM";
const COMPETITION_REMOVE_TEAM = "COMPETITION_REMOVE_TEAM";
const COMPETITION_UPDATE_STATS = "COMPETITION_UPDATE_STATS";
const COMPETITION_SET_TEAMS = "COMPETITION_SET_TEAMS";
const COMPETITION_START = "COMPETITION_START";
const COMPETITION_SEED = "COMPETITION_SEED";

export interface CompetitionAddTeamAction {
  type: typeof COMPETITION_ADD_TEAM;
  payload: {
    competition: CompetitionNames;
    team: string;
  };
}

export interface CompetitionRemoveTeamAction {
  type: typeof COMPETITION_REMOVE_TEAM;
  payload: {
    competition: CompetitionNames;
    team: string;
  };
}

export interface CompetitionUpdateStatsAction {
  type: typeof COMPETITION_UPDATE_STATS;
  payload: {
    competition: CompetitionNames;
    phase: number;
    group: number;
    stats: any;
  };
}

export interface CompetitionSetTeamsAction {
  type: typeof COMPETITION_SET_TEAMS;
  payload: {
    competition: CompetitionNames;
    phase: number;
    group: number;
    teams: string[];
  };
}

export interface CompetitionSeedAction {
  type: typeof COMPETITION_SEED;
  payload: {
    competition: CompetitionNames;
    phase: number;
    seed: CompetitionPhase;
  };
}

export interface CompetitionStartAction {
  type: typeof COMPETITION_START;
  payload: {
    competition: CompetitionNames;
  };
}

type CompetitionActions =
  | CompetitionAddTeamAction
  | CompetitionRemoveTeamAction
  | CompetitionUpdateStatsAction
  | CompetitionSetTeamsAction
  | CompetitionStartAction
  | CompetitionSeedAction
  | GameSeasonStartAction
  | GameLoadStateAction
  | GameQuitToMainMenuAction;

export default function competitionReducer(
  state = defaultState,
  action: CompetitionActions
): CompetitionState {
  switch (action.type) {
    case GAME_LOAD_STATE:
      return action.payload.competition;

    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_SEASON_START:
      return over(
        lensProp("competitions"),
        map(
          mergeLeft({
            phase: -1,
            phases: []
          })
        )
      )(state);

    case COMPETITION_REMOVE_TEAM:
      return over(
        lensPath(["competitions", action.payload.competition, "teams"]),
        reject(t => t === action.payload.team),
        state
      );

    case COMPETITION_ADD_TEAM:
      return over(
        lensPath(["competitions", action.payload.competition, "teams"]),
        append(action.payload.team),
        state
      );

    case COMPETITION_UPDATE_STATS:
      return set(
        lensPath([
          "competitions",
          action.payload.competition,
          "phases",
          action.payload.phase,
          "groups",
          action.payload.group,
          "stats"
        ]),
        action.payload.stats,
        state
      );

    case COMPETITION_SET_TEAMS:
      return set(
        lensPath(["competitions", action.payload.competition, "teams"]),
        action.payload.teams,
        state
      );

    case COMPETITION_START:
      return set(
        lensPath(["competitions", action.payload.competition, "phases"]),
        [],
        state
      );

    case COMPETITION_SEED:
      return set(
        lensPath([
          "competitions",
          action.payload.competition,
          "phase",
          action.payload.phase
        ]),
        action.payload.seed,
        state
      );

    default:
      return state;
  }
}