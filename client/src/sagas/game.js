import {
  all,
  call,
  getContext,
  put,
  takeLatest,
  select
} from "redux-saga/effects";
import { delay } from "redux-saga";

function* gameAdvance() {
  const activePlayer = yield select(state => state.player.get("active"));
  const players = yield select(state => state.player.get("players"));

  console.log("players", players);

  if (activePlayer === players.count() - 1) {
    yield put({
      type: "GAME_ADVANCE"
    });
  } else {
    yield put({
      type: "PLAYER_NEXT"
    });
  }
}

function* watchGameAdvance() {
  yield takeLatest("GAME_ADVANCE_REQUEST", gameAdvance);
}

export default function* gameSagas() {
  yield all([watchGameAdvance()]);
}
