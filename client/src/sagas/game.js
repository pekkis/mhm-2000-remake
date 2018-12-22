import { List } from "immutable";

import {
  all,
  call,
  getContext,
  put,
  takeLatest,
  takeEvery,
  select
} from "redux-saga/effects";
import { delay } from "redux-saga";

import gamedayListener from "../listeners/gameday";
import nextTurnListener from "../listeners/next-turn";

const listeners = List.of(gamedayListener, nextTurnListener).sortBy(l =>
  l.phase()
);

function* gameday(action) {
  const { payload } = action;

  yield put({
    type: "GAME_GAMEDAY",
    payload
  });
}

function* advance() {
  // const game = yield select(state => state.game);
  // const players = yield select(state => state.players);

  let stop = false;
  let counter = 0;
  do {
    counter = counter + 1;
    const turn = yield select(state => state.game.get("turn"));

    const phase = turn.get("phase");
    const interestedListeners = listeners.filter(l => l.phase() === phase);

    for (var listener of interestedListeners.toArray()) {
      yield listener.generator();
    }

    stop = interestedListeners.some(l => l.stop());

    const nextPhase = Math.min(
      ...listeners
        .filter(l => l.phase() > phase)
        .map(l => l.phase())
        .toArray()
    );

    console.log(nextPhase, "next phase");

    if (!stop) {
      yield put({
        type: "GAME_SET_PHASE",
        payload: nextPhase
      });
    }
  } while (!stop);

  // console.log("interested listeners", interestedListeners.toJS());

  // yield all(interestedListeners.map(l => l.generator).toArray());

  // console.log("da steit", state);

  return;

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

function* start() {
  yield put({
    type: "GAME_START"
  });

  yield put({
    type: "SEASON_START"
  });
}

function* watchAdvance() {
  yield takeEvery("GAME_ADVANCE_REQUEST", advance);
}

function* watchGameday() {
  yield takeEvery("GAME_GAMEDAY_REQUEST", gameday);
}

function* watchStart() {
  yield takeLatest("GAME_START_REQUEST", start);
}

export default function* gameSagas() {
  yield all([watchAdvance(), watchStart(), watchGameday()]);
}
