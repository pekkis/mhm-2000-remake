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
import {
  watchTransferMarket,
  crisisMeeting,
  improveArena,
  toggleService
} from "../manager";
import { orderPrank } from "../prank";

export default function* actionPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "action"
  });

  const tasks = yield all([
    fork(watchTransferMarket),
    takeEvery("MANAGER_CRISIS_MEETING", crisisMeeting),
    takeEvery("MANAGER_IMPROVE_ARENA", improveArena),
    takeEvery("META_GAME_SAVE_REQUEST", gameSave),
    takeEvery("MANAGER_TOGGLE_SERVICE", toggleService),
    takeEvery("PRANK_ORDER", orderPrank)
  ]);

  yield take("GAME_ADVANCE_REQUEST");
  yield cancel(tasks);
}
