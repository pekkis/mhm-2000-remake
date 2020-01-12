import { SEASON_START, GameSeasonStartAction } from "./game";
import { MHMState } from ".";
import { mergeRight, assoc } from "ramda";

export const META_QUIT_TO_MAIN_MENU = "META_QUIT_TO_MAIN_MENU";
export const META_GAME_LOAD_STATE = "META_GAME_LOAD_STATE";
export const META_GAME_START_REQUEST = "META_GAME_START_REQUEST";
export const META_GAME_LOAD_REQUEST = "META_GAME_LOAD_REQUEST";
export const META_GAME_SAVE_REQUEST = "META_GAME_SAVE_REQUEST";
export const META_GAME_LOADED = "META_GAME_LOADED";

export interface MetaState {
  started: boolean;
  loading: boolean;
  saving: false;
  starting: false;
  manager: {
    name: string;
    arena: string;
    difficulty: string;
    team: string;
  };
}

const defaultState: MetaState = {
  started: false,
  loading: false,
  saving: false,
  starting: false,
  manager: {
    name: "Gaylord Lohiposki",
    arena: "MasoSports Areena",
    difficulty: "2",
    team: "12"
  }
};

export interface MetaQuitToMainMenuAction {
  type: typeof META_QUIT_TO_MAIN_MENU;
}

export interface MetaGameLoadStateAction {
  type: typeof META_GAME_LOAD_STATE;
  payload: MHMState;
}

export interface MetaGameStartAction {
  type: typeof META_GAME_START_REQUEST;
}

export interface MetaGameSaveRequestAction {
  type: typeof META_GAME_SAVE_REQUEST;
}

export interface MetaGameLoadRequestAction {
  type: typeof META_GAME_LOAD_REQUEST;
}

export interface MetaGameLoadedAction {
  type: typeof META_GAME_LOADED;
}

export const quitToMainMenu = (): MetaQuitToMainMenuAction => ({
  type: META_QUIT_TO_MAIN_MENU
});

export const startGame = (): MetaGameStartAction => {
  return {
    type: META_GAME_START_REQUEST
  };
};

export const saveGame = (): MetaGameSaveRequestAction => {
  return {
    type: META_GAME_SAVE_REQUEST
  };
};

export const loadGame = (): MetaGameLoadRequestAction => {
  return {
    type: META_GAME_LOAD_REQUEST
  };
};

type MetaActions =
  | MetaQuitToMainMenuAction
  | GameSeasonStartAction
  | MetaGameLoadedAction
  | MetaGameStartAction;

export default function metaReducer(
  state = defaultState,
  action: MetaActions
): MetaState {
  switch (action.type) {
    case META_QUIT_TO_MAIN_MENU:
      return defaultState;

    case SEASON_START:
    case META_GAME_LOADED:
      return mergeRight(state, {
        started: true,
        loading: false
      });

    case META_GAME_START_REQUEST:
      return assoc("starting", true, state);

    default:
      return state;
  }
}
