import { List, Map, fromJS, Seq } from "immutable";
import competitionData from "../data/competitions";
import gameService from "../services/game";

import {
  all,
  call,
  getContext,
  put,
  takeLatest,
  takeEvery,
  select,
  take
} from "redux-saga/effects";
import { delay } from "redux-saga";

const save = state => {
  const json = JSON.stringify(
    Seq(state)
      .map(subtree => subtree.toJS())
      .toJS()
  );
  console.log("JSON blob", json);
  window.localStorage.setItem("mhm97", json);
};

const load = () => {
  const json = window.localStorage.getItem("mhm97");
  const state = JSON.parse(json);

  return state;

  // return fromJS(state);
};

function* gameStart() {
  /*
  yield all([
    put({
      type: "COMPETITION_PROMOTE",
      payload: {
        competition: "division",
        team: 14
      }
    }),
    put({
      type: "COMPETITION_RELEGATE",
      payload: {
        competition: "phl",
        team: 0
      }
    })
  ]);
  */

  yield put({
    type: "SEASON_START_REQUEST"
  });

  yield put({
    type: "GAME_START"
  });
}

function* watchLoadAndSave() {
  yield takeEvery("META_GAME_SAVE_REQUEST", gameSave);
  yield takeEvery("META_GAME_LOAD_REQUEST", gameLoad);
}
function* watchGameStart() {
  yield takeLatest("META_GAME_START_REQUEST", gameStart);
}

function* gameSave(action) {
  const state = yield select(state => state);
  yield call(save, state);
}

function* gameLoad(action) {
  const state = yield call(load);
  yield put({
    type: "META_GAME_LOAD_STATE",
    payload: state
  });

  yield put({
    type: "META_GAME_LOADED"
  });
}

export default function* gameSagas() {
  yield all([watchGameStart(), watchLoadAndSave()]);
}
