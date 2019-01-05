import { OrderedMap, Map, List, fromJS } from "immutable";

const defaultState = Map({
  pranks: List()
});

export const dismissPrank = id => {
  return {
    type: "PRANK_DISMISS",
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

export const executePrank = player => {
  return {
    type: "PRANK_EXECUTE",
    payload: player
  };
};

export default function notificationReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "NOTIFICATION_ADD":
      return state.update("notifications", notifications =>
        notifications.set(payload.id, payload).takeLast(3)
      );

    case "NOTIFICATION_DISMISS":
      return state.deleteIn(["notifications", payload]);

    default:
      return state;
  }
}
