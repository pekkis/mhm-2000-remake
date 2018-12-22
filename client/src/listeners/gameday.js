import { select, put } from "redux-saga/effects";

export default {
  phase: () => 1000,

  interested: state => {
    return true;
  },

  stop: () => false,

  suggestedPhase: () => undefined,

  generator: function*() {
    // const state = yield select(state => state.player);
    // console.log("generatore!", state);

    for (const item of ["phl", "division"]) {
      yield put({
        type: "GAME_GAMEDAY_REQUEST",
        payload: item
      });
    }
  }
};
