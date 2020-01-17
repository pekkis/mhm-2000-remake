import { MHMState } from "../ducks";

export const saveGame = (state: MHMState) => {
  // TODO: Omit stuff that is not saved!!!
  const json = JSON.stringify(state);
  window.localStorage.setItem("mhm2k", json);
};

export const loadGame = (): MHMState => {
  try {
    const json = window.localStorage.getItem("mhm2k");

    if (!json) {
      throw new Error("Could not load game");
    }
    const state = JSON.parse(json);
    return state;
  } catch (e) {
    throw e;
  }
};

export default {
  saveGame,
  loadGame
};
