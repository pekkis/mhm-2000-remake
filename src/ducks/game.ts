import { Map, List } from "immutable";

import teamData from "../data/teams";

import { Reducer } from "redux";
import { getCalendar } from "../services/calendar";
import {
  MHMTurnPhase,
  MHMCalendar,
  Turn,
  Flags,
  ServiceBasePrices
} from "../types/base";
import { Team } from "../types/team";
import { MHMState } from ".";
import {
  mergeRight,
  assoc,
  propEq,
  pipe,
  lensProp,
  over,
  mergeLeft,
  map,
  lensPath
} from "ramda";

export const GAME_QUIT_TO_MAIN_MENU = "GAME_QUIT_TO_MAIN_MENU";
export const GAME_LOAD_STATE = "GAME_LOAD_STATE";
export const GAME_START_REQUEST = "GAME_START_REQUEST";
export const GAME_LOAD_REQUEST = "GAME_LOAD_REQUEST";
export const GAME_SAVE_REQUEST = "GAME_SAVE_REQUEST";
export const GAME_LOADED = "GAME_LOADED";

export const GAME_START = "GAME_START";
export const GAME_ADVANCE_REQUEST = "GAME_ADVANCE_REQUEST";
export const GAME_ADVANCE = "GAME_ADVANCE";
export const GAME_DECREMENT_DURATIONS = "GAME_DECREMENT_DURATIONS";
export const GAME_CLEAR_EXPIRED = "GAME_CLEAR_EXPIRED";
export const GAME_NEXT_TURN = "GAME_NEXT_TURN";
export const GAME_SET_PHASE = "GAME_SET_PHASE";
export const GAME_SEASON_START = "GAME_SEASON_START";
export const GAME_SEASON_END = "GAME_SEASON_END";

export interface GameQuitToMainMenuAction {
  type: typeof GAME_QUIT_TO_MAIN_MENU;
}

export interface GameLoadStateAction {
  type: typeof GAME_LOAD_STATE;
  payload: MHMState;
}

export interface GameStartAction {
  type: typeof GAME_START_REQUEST;
}

export interface GameSaveRequestAction {
  type: typeof GAME_SAVE_REQUEST;
}

export interface GameLoadRequestAction {
  type: typeof GAME_LOAD_REQUEST;
}

export interface GameLoadedAction {
  type: typeof GAME_LOADED;
}

export const quitToMainMenu = (): GameQuitToMainMenuAction => ({
  type: GAME_QUIT_TO_MAIN_MENU
});

export const startGame = (): GameStartAction => {
  return {
    type: GAME_START_REQUEST
  };
};

export const saveGame = (): GameSaveRequestAction => {
  return {
    type: GAME_SAVE_REQUEST
  };
};

export const loadGame = (): GameLoadRequestAction => {
  return {
    type: GAME_LOAD_REQUEST
  };
};

export interface GameState {
  started: boolean;
  loading: boolean;
  saving: false;
  starting: false;

  turn: Turn;
  flags: Flags;
  serviceBasePrices: ServiceBasePrices;
  calendar: MHMCalendar;
  teams: { [key: string]: Team };
  worldChampionshipResults: unknown;
}

const defaultState: GameState = {
  started: false,
  loading: false,
  saving: false,
  starting: false,

  turn: {
    season: 0,
    round: 0,
    phase: undefined
  },

  flags: {
    jarko: false,
    usa: false,
    canada: false
  },

  serviceBasePrices: {
    insurance: 1000,
    coach: 3200,
    microphone: 500,
    cheer: 3000
  },

  teams: teamData,

  calendar: getCalendar(),

  worldChampionshipResults: undefined
};

export const advance = payload => {
  return {
    type: GAME_ADVANCE_REQUEST,
    payload
  };
};

export interface GameSeasonStartAction {
  type: typeof GAME_SEASON_START;
}

export interface GameAdvanceAction {
  type: typeof GAME_ADVANCE;
}

export interface GameSeasonEndAction {
  type: typeof GAME_SEASON_END;
}

export interface GameSetPhaseAction {
  type: typeof GAME_SET_PHASE;
  payload: MHMTurnPhase;
}

export interface GameNextTurnAction {
  type: typeof GAME_NEXT_TURN;
}

export const setPhase = (phase: MHMTurnPhase): GameSetPhaseAction => ({
  type: GAME_SET_PHASE,
  payload: phase
});

const gameReducer: Reducer<typeof defaultState> = (
  state = defaultState,
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case GAME_LOADED:
      return mergeRight(state, {
        started: true,
        loading: false
      });

    case GAME_START_REQUEST:
      return assoc("starting", true, state);

    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return payload.game;

    case GAME_SEASON_START:
      return pipe(
        mergeLeft({
          started: true,
          loading: false,
          flags: {
            jarko: false
          }
        }),
        over(
          lensProp("teams"),
          map(
            mergeLeft({
              effects: [],
              opponentEffects: [],
              morale: 0,
              strategy: 2,
              readiness: 0
            })
          )
        )
      )(state);

    case GAME_SEASON_END:
      return over(
        lensPath(["turn"]),
        turn => {
          return {
            season: turn.season + 1,
            round: -1
          };
        },
        state
      );

    case "GAME_GAME_RESULT":
      // console.log("pl", payload);

      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group,
          "schedule",
          payload.round,
          payload.pairing
        ],
        r => r.set("result", payload.result)
      );

    case "GAME_GAMEDAY_COMPLETE":
      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group
        ],
        group => {
          return group.update("round", r => r + 1);
        }
      );

    case GAME_SET_PHASE:
      return state.setIn(["turn", "phase"], payload);

    case "TEAM_INCREMENT_MORALE":
      return state.updateIn(["teams", payload.team, "morale"], m => {
        return Math.min(payload.max, Math.max(payload.min, m + payload.amount));
      });

    case "TEAM_SET_MORALE":
      return state.setIn(
        ["teams", payload.team, "morale"],
        Math.min(payload.max, Math.max(payload.min, payload.morale))
      );

    case "TEAM_SET_STRATEGY":
      return state.setIn(["teams", payload.team, "strategy"], payload.strategy);

    case "TEAM_SET_READINESS":
      return state.setIn(
        ["teams", payload.team, "readiness"],
        payload.readiness
      );

    case "TEAM_INCUR_PENALTY":
      return state.updateIn(
        [
          "competitions",
          payload.competition,
          "phases",
          payload.phase,
          "groups",
          payload.group,
          "penalties"
        ],
        List(),
        penalties => {
          return penalties.push(
            Map({
              team: payload.team,
              penalty: payload.penalty
            })
          );
        }
      );

    case "TEAM_INCREMENT_READINESS":
      return state.updateIn(
        ["teams", payload.team, "readiness"],
        r => r + payload.amount
      );

    case "TEAM_INCREMENT_STRENGTH":
      return state.updateIn(
        ["teams", payload.team, "strength"],
        m => m + payload.amount
      );

    case "TEAM_SET_STRENGTH":
      return state.setIn(["teams", payload.team, "strength"], payload.amount);

    case "TEAM_SET_STRENGTHS":
      return payload.reduce((state, entry) => {
        return state.setIn(["teams", entry.id, "strength"], entry.strength);
      }, state);

    case "TEAM_DECREMENT_STRENGTH":
      return state.updateIn(
        ["teams", payload.team, "strength"],
        m => m - payload.amount
      );

    case "TEAM_RENAME":
      return state.setIn(["teams", payload.team, "name"], payload.name);

    case "TEAM_ADD_EFFECT":
      return state.updateIn(["teams", payload.team, "effects"], effects =>
        effects.push(Map(payload.effect))
      );

    case "TEAM_ADD_OPPONENT_EFFECT":
      return state.updateIn(
        ["teams", payload.team, "opponentEffects"],
        opponentEffects => opponentEffects.push(Map(payload.effect))
      );

    case "TEAM_REMOVE_MANAGER":
      return state.removeIn(["teams", payload.team, "manager"]);

    case "TEAM_ADD_MANAGER":
      return state.setIn(["teams", payload.team, "manager"], payload.manager);

    case GAME_DECREMENT_DURATIONS:
      return state.update("teams", teams => {
        return teams.map(team => {
          return team
            .update("effects", effects => {
              return effects.map(e => e.update("duration", d => d - 1));
            })
            .update("opponentEffects", effects => {
              return effects.map(e => e.update("duration", d => d - 1));
            });
        });
      });

    case GAME_CLEAR_EXPIRED:
      return state.update("teams", teams => {
        return teams.map(team => {
          return team
            .update("effects", effects => {
              return effects.filter(e => e.get("duration") > 0);
            })
            .update("opponentEffects", effects => {
              return effects.filter(e => e.get("duration") > 0);
            });
        });
      });

    case GAME_NEXT_TURN:
      return state.updateIn(["turn", "round"], r => r + 1);

    case "GAME_SET_FLAG":
      return state.setIn(["flags", payload.flag], payload.value);

    case "GAME_SET_SERVICE_BASE_PRICE":
      return state.setIn(
        ["serviceBasePrices", payload.service],
        payload.amount
      );

    case "GAME_WORLD_CHAMPIONSHIP_RESULTS":
      return state.set("worldChampionshipResults", payload);

    default:
      return state;
  }
};

export default gameReducer;
