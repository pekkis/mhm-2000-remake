import { Map } from "immutable";

const defaultState = Map({
  advanceEnabled: true,
  tabs: Map({
    transferMarket: 0,
    prankVictim: 0
  }),
  prank: Map({
    type: undefined,
    victim: undefined
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

    case "PRANK_CANCEL":
    case "PRANK_ORDER":
      return state.set(
        "prank",
        Map({
          type: undefined,
          victim: undefined
        })
      );

    case "PRANK_SELECT_TYPE":
      return state.setIn(["prank", "type"], payload);

    case "PRANK_SELECT_VICTIM":
      return state.setIn(["prank", "victim"], payload);

    default:
      return state;
  }
}
