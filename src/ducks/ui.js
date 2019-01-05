import { Map } from "immutable";

const defaultState = Map({
  advanceEnabled: true,
  tabs: Map({
    transferMarket: 0
  })
});

export const selectTab = (tab, value) => {
  return {
    type: "UI_SELECT_TAB",
    payload: {
      tab,
      value
    }
  };
};

export default function uiReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "UI_DISABLE_ADVANCE":
      return state.set("advanceEnabled", false);

    case "UI_ENABLE_ADVANCE":
      return state.set("advanceEnabled", true);

    case "UI_SELECT_TAB":
      return state.setIn(["tabs", payload.tab], payload.value);

    default:
      return state;
  }
}
