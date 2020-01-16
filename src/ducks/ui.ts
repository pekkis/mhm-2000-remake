import { GAME_QUIT_TO_MAIN_MENU, GameQuitToMainMenuAction } from "./game";
import { assoc } from "ramda";

export interface UIState {
  menu: Boolean;
  advanceEnabled: Boolean;
}

export interface UIDisableAdvanceAction {
  type: typeof UI_DISABLE_ADVANCE;
}

export interface UIEnableAdvanceAction {
  type: typeof UI_ENABLE_ADVANCE;
}

export interface UIMenuToggleAction {
  type: typeof UI_MENU_TOGGLE;
}

export interface UIMenuCloseAction {
  type: typeof UI_MENU_CLOSE;
}

export const UI_MENU_TOGGLE = "UI_MENU_TOGGLE";
export const UI_MENU_CLOSE = "UI_MENU_CLOSE";
export const UI_DISABLE_ADVANCE = "UI_DISABLE_ADVANCE";
export const UI_ENABLE_ADVANCE = "UI_ENABLE_ADVANCE";

const defaultState: UIState = {
  menu: false,
  advanceEnabled: true
};

export const toggleMenu = (): UIMenuToggleAction => {
  return {
    type: UI_MENU_TOGGLE
  };
};

export const closeMenu = (): UIMenuCloseAction => {
  return {
    type: UI_MENU_CLOSE
  };
};

type UIActions =
  | GameQuitToMainMenuAction
  | UIDisableAdvanceAction
  | UIEnableAdvanceAction
  | UIMenuCloseAction
  | UIMenuToggleAction;

export default function uiReducer(state = defaultState, action: UIActions) {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case UI_DISABLE_ADVANCE:
      return assoc("advanceEnabled", false, state);

    case UI_ENABLE_ADVANCE:
      return assoc("advanceEnabled", true, state);

    case UI_MENU_TOGGLE:
      return assoc("menu", !state.menu, state);

    case UI_MENU_CLOSE:
      return assoc("menu", false, state);

    default:
      return state;
  }
}
