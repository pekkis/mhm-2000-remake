import {
  GAME_QUIT_TO_MAIN_MENU,
  GameQuitToMainMenuAction,
  GameLoadStateAction,
  GAME_LOAD_STATE
} from "./game";
import { MapOf } from "../types/base";
import { Player } from "../types/player";
import { mergeLeft, over, lensProp, indexBy, prop } from "ramda";

export interface PlayerState {
  players: MapOf<Player>;
}

export const PLAYER_CREATE_PLAYER = "PLAYER_CREATE_PLAYER";

export interface PlayerCreatePlayerAction {
  type: typeof PLAYER_CREATE_PLAYER;
  payload: {
    players: Player[];
  };
}

const defaultState: PlayerState = {
  players: {}
};

type PlayerActions =
  | GameQuitToMainMenuAction
  | GameLoadStateAction
  | PlayerCreatePlayerAction;

export default function playerReducer(
  state: PlayerState = defaultState,
  action: PlayerActions
) {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return action.payload.player;

    case PLAYER_CREATE_PLAYER:
      const playerMap = indexBy(prop("id"), action.payload.players);
      return over(lensProp("players"), mergeLeft(playerMap), state);

    default:
      return state;
  }
}
