import { addManager } from "./manager";
import { gameLoop } from "./game";
import { addNotification } from "./notification";

import {
  all,
  call,
  race,
  putResolve,
  select,
  take,
  fork,
  cancel
} from "redux-saga/effects";

const save = state => {
  const json = transit.toJSON(state);
  window.localStorage.setItem("mhm97", json);
};

const load = () => {
  const json = window.localStorage.getItem("mhm97");
  const state = transit.fromJSON(json);
  return state;
};

function* gameStart() {
  const action = yield take("GAME_ADVANCE_REQUEST");

  yield call(addManager, action.payload);

  yield putResolve({
    type: "GAME_START"
  });
}

function* mainMenu() {
  do {
    const { load } = yield race({
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
}

export function* gameSave(action) {
  const manager = yield select(state =>
    state.manager.getIn(["managers", state.manager.get("active")])
  );
  const state = yield select(state => state);
  yield call(save, state);
  yield call(addNotification, manager.get("id"), "Peli tallennettiin.");
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
