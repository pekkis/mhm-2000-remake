import { OrderedMap, Map, List, fromJS } from "immutable";

const defaultState = Map({
  pranks: List()
});

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

export const executePrank = (manager, type, victim) => {
  return {
    type: "PRANK_EXECUTE",
    payload: {
      manager,
      type,
      victim
    }
  };
};

export default function notificationReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "META_GAME_LOAD_STATE":
      return fromJS(payload.prank);

    case "PRANK_ADD":
      return state.update("pranks", pranks => pranks.push(payload));

    case "PRANK_REMOVE":
      return state.deleteIn(["pranks", payload]);

    default:
      return state;
  }
}
