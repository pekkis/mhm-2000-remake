import {
  ForEveryCompetition,
  Competition,
  CompetitionNames,
  CompetitionPhase,
  ScheduleGame,
  CompetitionGroup
} from "../types/base";
import {
  over,
  lensPath,
  reject,
  append,
  set,
  lensProp,
  map,
  mergeLeft,
  pipe,
  assocPath,
  reduce,
  inc,
  evolve
} from "ramda";
import {
  GameSeasonStartAction,
  GAME_SEASON_START,
  GameLoadStateAction,
  GameQuitToMainMenuAction,
  GAME_LOAD_STATE,
  GAME_QUIT_TO_MAIN_MENU,
  GameMatchResultsAction,
  GAME_MATCH_RESULTS
} from "./game";
import { namesToIds } from "../services/team";

export interface CompetitionState {
  competitions: ForEveryCompetition<Competition>;
}

const defaultState: CompetitionState = {
  competitions: {
    training: {
      weight: 2000,
      id: "training",
      abbr: "har",
      phase: -1,
      name: "Harjoitusottelut",
      teams: [],
      phases: []
    },
    cup: {
      weight: 500,
      id: "cup",
      abbr: "Cup",
      phase: -1,
      name: "Pekkalandian Cup",
      teams: [],
      phases: []
    },
    phl: {
      weight: 100,
      id: "phl",
      abbr: "phl",
      phase: -1,
      name: "PHL",
      teams: namesToIds([
        "TPS",
        "HIFK",
        "HPK",
        "SaiPa",
        "Jokerit",
        "Ilves",
        "Blues",
        "JYP",
        "Tappara",
        "Ässät",
        "Lukko",
        "Pelicans"
      ]),
      phases: []
    },
    division: {
      abbr: "div",
      weight: 200,
      id: "division",
      phase: -1,
      name: "Divisioona",
      teams: namesToIds([
        "kärpät",
        "hermes",
        "tuto",
        "fps",
        "diskos",
        "sport",
        "sapko",
        "jokipojat",
        "kjt",
        "ahmat",
        "jääkotkat",
        "kookoo"
      ]),
      phases: []
    },
    mutasarja: {
      abbr: "mut",
      weight: 300,
      id: "mutasarja",
      phase: -1,
      name: "Mutasarja",
      teams: namesToIds([
        "vg-62",
        "testicles",
        "santaclaus",
        "ruiske",
        "lightning",
        "nikkarit",
        "salama",
        "hait",
        "mahti",
        "siat",
        "veto",
        "ikirouta",
        "jymy",
        "hokki",
        "voitto",
        "teurastus",
        "komu ht",
        "saappaat",
        "aromi",
        "gepardit",
        "jukurit",
        "hardcore",
        "turmio",
        "kalpa"
      ]),
      phases: []
    },
    tournaments: {
      weight: 5000,
      id: "tournaments",
      phase: -1,
      name: "Joulutauon turnaukset",
      abbr: "tournaments",
      phases: [],
      teams: []
    },
    ehl: {
      weight: 500,
      id: "ehl",
      phase: -1,
      name: "EHL",
      abbr: "ehl",
      phases: [],
      teams: []
    }
  }
};

export const COMPETITION_ADD_TEAM = "COMPETITION_ADD_TEAM";
export const COMPETITION_REMOVE_TEAM = "COMPETITION_REMOVE_TEAM";
export const COMPETITION_UPDATE_STATS = "COMPETITION_UPDATE_STATS";
export const COMPETITION_SET_TEAMS = "COMPETITION_SET_TEAMS";
export const COMPETITION_START = "COMPETITION_START";
export const COMPETITION_SEED = "COMPETITION_SEED";
export const COMPETITION_ADVANCE = "COMPETITION_ADVANCE";

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

export interface CompetitionAdvanceAction {
  type: typeof COMPETITION_ADVANCE;
  payload: {
    competitions: CompetitionNames[];
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
    competition: string;
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
  | GameQuitToMainMenuAction
  | GameMatchResultsAction
  | CompetitionAdvanceAction;

export default function competitionReducer(
  state = defaultState,
  action: CompetitionActions
): CompetitionState {
  switch (action.type) {
    case GAME_LOAD_STATE:
      return action.payload.competition;

    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case COMPETITION_ADVANCE:
      return reduce(
        (state, competitionId) => {
          return over(
            lensPath(["competitions", competitionId]),
            (c: Competition) => {
              return over(
                lensPath(["phases", c.phase]),
                (phase: CompetitionPhase) => {
                  return over(
                    lensProp("groups"),
                    map((group: CompetitionGroup) => {
                      return evolve(
                        {
                          round: inc
                        },
                        group
                      );
                    }),
                    phase
                  );
                },
                c
              );
            },
            state
          );
        },
        state,
        action.payload.competitions
      );

    case GAME_MATCH_RESULTS:
      return reduce(
        (a, resultSet) => {
          return pipe<typeof a, typeof a>(
            assocPath(
              [
                "competitions",
                resultSet.competition,
                "phases",
                resultSet.phase,
                "groups",
                resultSet.group,
                "schedule",
                resultSet.round
              ],
              resultSet.results
            )
          )(a);
        },
        state,
        action.payload
      );

    case GAME_SEASON_START:
      return over(
        lensProp("competitions"),
        map(
          mergeLeft({
            phase: -1,
            phases: []
          })
        ),
        state
      );

    case COMPETITION_REMOVE_TEAM:
      return over(
        lensPath(["competitions", action.payload.competition, "teams"]),
        reject((t) => t === action.payload.team),
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
      const state2 = assocPath(
        ["competitions", action.payload.competition, "phase"],
        action.payload.phase,
        state
      );

      return set(
        lensPath([
          "competitions",
          action.payload.competition,
          "phases",
          action.payload.phase
        ]),
        action.payload.seed,
        state2
      );

    default:
      return state;
  }
}
