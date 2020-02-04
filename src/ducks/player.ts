import {
  GAME_QUIT_TO_MAIN_MENU,
  GameQuitToMainMenuAction,
  GameLoadStateAction,
  GAME_LOAD_STATE
} from "./game";
import { MapOf } from "../types/base";
import { Player, ContractNegotiation } from "../types/player";
import {
  mergeLeft,
  over,
  lensProp,
  indexBy,
  prop,
  assoc,
  assocPath
} from "ramda";

export interface PlayerState {
  players: MapOf<Player>;
  negotiations: MapOf<ContractNegotiation>;
}

export const PLAYER_CREATE_PLAYER = "PLAYER_CREATE_PLAYER";
export const PLAYER_CONTRACT_INITIATE_REQUEST =
  "PLAYER_CONTRACT_INITIATE_REQUEST";
export const PLAYER_CONTRACT_INITIATE = "PLAYER_CONTRACT_INITIATE";

export interface PlayerCreatePlayerAction {
  type: typeof PLAYER_CREATE_PLAYER;
  payload: {
    players: Player[];
  };
}

export interface PlayerContractInitiateRequestAction {
  type: typeof PLAYER_CONTRACT_INITIATE_REQUEST;
  payload: {
    manager: string;
    player: string;
  };
}

export interface PlayerContractInitiateAction {
  type: typeof PLAYER_CONTRACT_INITIATE;
  payload: {
    negotiation: ContractNegotiation;
  };
}

const defaultState: PlayerState = {
  players: {},
  negotiations: {}
};

type PlayerActions =
  | GameQuitToMainMenuAction
  | GameLoadStateAction
  | PlayerCreatePlayerAction
  | PlayerContractInitiateAction;

export default function playerReducer(
  state: PlayerState = defaultState,
  action: PlayerActions
) {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return action.payload.player;

    case PLAYER_CONTRACT_INITIATE:
      return assocPath(
        ["negotiations", action.payload.negotiation.id],
        action.payload.negotiation,
        state
      );

    case PLAYER_CREATE_PLAYER:
      const playerMap = indexBy(prop("id"), action.payload.players);
      return over(lensProp("players"), mergeLeft(playerMap), state);

    default:
      return state;
  }
}
