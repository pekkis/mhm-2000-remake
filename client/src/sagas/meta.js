import { List, Map, fromJS, Seq } from "immutable";
import competitionData from "../data/competitions";
import gameService from "../services/game";

import { seasonStart, gameLoop } from "./game";

import {
  all,
  call,
  race,
  getContext,
  put,
  putResolve,
  takeLatest,
  takeEvery,
  select,
  take,
  fork,
  cancel
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
  yield call(seasonStart);

  yield put({
    type: "GAME_START"
  });
}

function* mainMenu() {
  do {
    const { load, start } = yield race({
      load: take("META_GAME_LOAD_REQUEST"),
      start: take("META_GAME_START_REQUEST")
    });

    if (load) {
      yield call(gameLoad);
    } else {
      yield call(gameStart);
    }

    const task = yield fork(gameLoop);

    yield take("META_QUIT_TO_MAIN_MENU");
    yield cancel(task);
  } while (true);

  // yield takeEvery("META_GAME_SAVE_REQUEST", gameSave);
  // yield takeEvery("META_GAME_LOAD_REQUEST", gameLoad);
}

export function* gameSave(action) {
  const state = yield select(state => state);
  yield call(save, state);
}

function* gameLoad(action) {
  const state = yield call(load);
  yield putResolve({
    type: "META_GAME_LOAD_STATE",
    payload: state
  });

  yield putResolve({
    type: "META_GAME_LOADED"
  });
}

export default function* metaSagas() {
  yield all([mainMenu()]);
}
