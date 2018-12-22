import { select, put } from "redux-saga/effects";

export default {
  phase: () => 2000,

  interested: () => true,

  stop: () => true,

  generator: function*() {
    // const state = yield select(state => state.player);
    // console.log("generatore!", state);

    yield put({
      type: "GAME_NEXT_TURN"
    });
  }
};
