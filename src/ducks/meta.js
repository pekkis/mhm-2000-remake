import { Map } from "immutable";

const defaultState = Map({
  started: false,
  loading: false,
  saving: false,
  starting: false,
  manager: Map({
    name: "Gaylord Lohiposki",
    arena: "MasoSports Areena",
    difficulty: "2"
  })
});

export const quitToMainMenu = () => {
  return {
    type: "META_QUIT_TO_MAIN_MENU"
  };
};

export const startGame = () => {
  return {
    type: "META_GAME_START_REQUEST"
  };
};

export const saveGame = () => {
  return {
    type: "META_GAME_SAVE_REQUEST"
  };
};

export const loadGame = () => {
  return {
    type: "META_GAME_LOAD_REQUEST"
  };
};

export default function eventReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "SEASON_START_REQUEST":
      return state.set("loading", true);

    case "SEASON_START":
    case "META_GAME_LOADED":
      return state.set("started", true).set("loading", false);

    case "META_GAME_START_REQUEST":
      return state.set("starting", true);

    default:
      return state;
  }
}
