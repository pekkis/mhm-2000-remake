import { Map } from "immutable";

const defaultState = Map({
  advanceEnabled: true
});

export default function uiReducer(state = defaultState, action) {
  const { type } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "UI_DISABLE_ADVANCE":
      return state.set("advanceEnabled", false);

    case "UI_ENABLE_ADVANCE":
      return state.set("advanceEnabled", true);

    default:
      return state;
  }
}
