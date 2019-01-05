import {
  call,
  fork,
  all,
  take,
  takeEvery,
  cancel,
  put
} from "redux-saga/effects";
import { gameSave } from "../meta";
import { watchTransferMarket, crisisMeeting, improveArena } from "../manager";

export default function* actionPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "action"
  });

  const tasks = yield all([
    fork(watchTransferMarket),
    takeEvery("MANAGER_CRISIS_MEETING", crisisMeeting),
    takeEvery("MANAGER_IMPROVE_ARENA", improveArena),
    takeEvery("META_GAME_SAVE_REQUEST", gameSave)
  ]);

  yield take("GAME_ADVANCE_REQUEST");
  yield cancel(tasks);
}
