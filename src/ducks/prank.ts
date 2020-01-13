import { Prank } from "../types/base";
import { assocPath, dissocPath } from "ramda";
import {
  META_QUIT_TO_MAIN_MENU,
  MetaGameLoadStateAction,
  MetaQuitToMainMenuAction,
  META_GAME_LOAD_STATE
} from "./meta";
import uuid from "uuid";

export const PRANK_ORDER = "PRANK_ORDER";
export const PRANK_ADD = "PRANK_ADD";
export const PRANK_DISMISS = "PRANK_DISMISS";

export interface PrankState {
  pranks: {
    [key: string]: Prank;
  };
}

export interface PrankAddAction {
  type: typeof PRANK_ADD;
  payload: Prank;
}

export interface PrankOrderAction {
  type: typeof PRANK_ORDER;
  payload: Prank;
}

export interface PrankDismissAction {
  type: typeof PRANK_DISMISS;
  payload: string;
}

const defaultState: PrankState = {
  pranks: {}
};

export const cancelPrank = id => {
  return {
    type: "PRANK_CANCEL",
    payload: id
  };
};

export const selectPrankType = id => {
  return {
    type: "PRANK_SELECT_TYPE",
    payload: id
  };
};

export const selectPrankVictim = id => {
  return {
    type: "PRANK_SELECT_VICTIM",
    payload: id
  };
};

export const orderPrank = (
  manager: string,
  type: number,
  victim: number
): PrankOrderAction => {
  return {
    type: PRANK_ORDER,
    payload: {
      id: uuid(),
      manager,
      type,
      victim
    }
  };
};

type PrankActions =
  | PrankAddAction
  | PrankDismissAction
  | MetaQuitToMainMenuAction
  | MetaGameLoadStateAction;

export default function prankReducer(
  state: PrankState = defaultState,
  action: PrankActions
): PrankState {
  switch (action.type) {
    case META_QUIT_TO_MAIN_MENU:
      return defaultState;

    case META_GAME_LOAD_STATE:
      return action.payload.prank;

    case PRANK_ADD:
      return assocPath(["pranks", action.payload.id], action.payload, state);

    case PRANK_DISMISS:
      return dissocPath(["pranks", action.payload], state);

    default:
      return state;
  }
}
