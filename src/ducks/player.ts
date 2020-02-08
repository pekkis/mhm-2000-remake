import {
  GAME_QUIT_TO_MAIN_MENU,
  GameQuitToMainMenuAction,
  GameLoadStateAction,
  GAME_LOAD_STATE
} from "./game";
import { MapOf } from "../types/base";
import { Player, ContractNegotiation, Contract } from "../types/player";
import {
  mergeLeft,
  over,
  lensProp,
  indexBy,
  prop,
  assoc,
  assocPath,
  lensPath
} from "ramda";

export interface PlayerState {
  players: MapOf<Player>;
  negotiations: MapOf<ContractNegotiation>;
}

export const PLAYER_CREATE_PLAYER = "PLAYER_CREATE_PLAYER";
export const PLAYER_CONTRACT_INITIATE_REQUEST =
  "PLAYER_CONTRACT_INITIATE_REQUEST";
export const PLAYER_CONTRACT_INITIATE = "PLAYER_CONTRACT_INITIATE";
export const PLAYER_CONTRACT_PROPOSE = "PLAYER_CONTRACT_PROPOSE";
export const PLAYER_CONTRACT_RESPOND = "PLAYER_CONTRACT_RESPOND";
export const PLAYER_CONTRACT_END_REQUEST = "PLAYER_CONTRACT_END_REQUEST";
export const PLAYER_CONTRACT_END = "PLAYER_CONTRACT_END";
export const PLAYER_CONTRACT_SIGN_REQUEST = "PLAYER_CONTRACT_SIGN_REQUEST";
export const PLAYER_CONTRACT_SIGN = "PLAYER_CONTRACT_SIGN";

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
    context?: string;
  };
}

export interface PlayerContractInitiateAction {
  type: typeof PLAYER_CONTRACT_INITIATE;
  payload: {
    negotiation: ContractNegotiation;
  };
}

export interface PlayerContractProposeAction {
  type: typeof PLAYER_CONTRACT_PROPOSE;
  payload: {
    negotiationId: string;
    contract: Contract;
  };
}

export interface PlayerContractRespondAction {
  type: typeof PLAYER_CONTRACT_RESPOND;
  payload: {
    negotiation: ContractNegotiation;
  };
}

export interface PlayerContractSignRequestAction {
  type: typeof PLAYER_CONTRACT_SIGN_REQUEST;
  payload: {
    negotiationId: string;
  };
}

export interface PlayerContractSignAction {
  type: typeof PLAYER_CONTRACT_SIGN;
  payload: {
    playerId: string;
    contract: Contract;
  };
}

export interface PlayerContractEndRequestAction {
  type: typeof PLAYER_CONTRACT_END_REQUEST;
  payload: {
    negotiationId: string;
  };
}

export interface PlayerContractEndAction {
  type: typeof PLAYER_CONTRACT_END;
  payload: {
    negotiationId: string;
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
  | PlayerContractInitiateAction
  | PlayerContractRespondAction
  | PlayerContractSignAction
  | PlayerContractEndAction;

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
    case PLAYER_CONTRACT_RESPOND:
      return assocPath(
        ["negotiations", action.payload.negotiation.id],
        action.payload.negotiation,
        state
      );

    case PLAYER_CONTRACT_END:
      return assocPath(
        ["negotiations", action.payload.negotiationId, "open"],
        false,
        state
      );

    case PLAYER_CONTRACT_SIGN:
      return assocPath(
        ["players", action.payload.playerId, "contract"],
        action.payload.contract,
        state
      );

    case PLAYER_CREATE_PLAYER:
      const playerMap = indexBy(prop("id"), action.payload.players);
      return over(lensProp("players"), mergeLeft(playerMap), state);

    default:
      return state;
  }
}
