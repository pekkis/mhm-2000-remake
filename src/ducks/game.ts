import { Reducer } from "redux";
import { getCalendar } from "../services/calendar";
import {
  MHMTurnPhase,
  MHMCalendar,
  Turn,
  Flags,
  ServiceBasePrices,
  MatchResultsSet
} from "../types/base";
import { MHMState } from ".";
import {
  mergeRight,
  assoc,
  pipe,
  lensProp,
  over,
  mergeLeft,
  map,
  lensPath,
  assocPath,
  evolve,
  inc,
  reduce
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

export const GAME_MATCH_RESULTS = "GAME_MATCH_RESULTS";

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

export interface GameCleanupAction {
  type: typeof GAME_CLEAR_EXPIRED;
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
  worldChampionshipResults: unknown;
}

const defaultState: GameState = {
  started: false,
  loading: false,
  saving: false,
  starting: false,

  turn: {
    season: 3,
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

  calendar: getCalendar(),

  worldChampionshipResults: undefined
};

export const advance = (payload?: any) => {
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
  payload: any;
}

export interface GameAdvanceRequestAction {
  type: typeof GAME_ADVANCE_REQUEST;
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

export interface GameMatchResultsAction {
  type: typeof GAME_MATCH_RESULTS;
  payload: MatchResultsSet[];
}

export interface GameMatchResultsAction {
  type: typeof GAME_MATCH_RESULTS;
  payload: MatchResultsSet[];
}

export interface GameDecrementDurationsActions {
  type: typeof GAME_DECREMENT_DURATIONS;
}

export const setPhase = (phase: MHMTurnPhase): GameSetPhaseAction => ({
  type: GAME_SET_PHASE,
  payload: phase
});

type GameActions =
  | GameStartAction
  | GameQuitToMainMenuAction
  | GameLoadedAction
  | GameLoadStateAction
  | GameSeasonStartAction
  | GameMatchResultsAction
  | GameSeasonEndAction
  | GameSetPhaseAction
  | GameNextTurnAction;

const gameReducer: Reducer<typeof defaultState> = (
  state = defaultState,
  action: GameActions
) => {
  switch (action.type) {
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
      return action.payload.game;

    case GAME_SEASON_START:
      return mergeLeft(
        {
          started: true,
          loading: false,
          flags: {
            jarko: false
          }
        },
        state
      );

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

    case GAME_SET_PHASE:
      return assocPath(["turn", "phase"], action.payload, state);

    case GAME_NEXT_TURN:
      return evolve(
        {
          turn: {
            round: inc
          }
        },
        state
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

    case "GAME_SET_FLAG":
      return state.setIn(["flags", payload.flag], payload.value);

    case "GAME_WORLD_CHAMPIONSHIP_RESULTS":
      return state.set("worldChampionshipResults", payload);

    default:
      return state;
  }
};

export default gameReducer;
