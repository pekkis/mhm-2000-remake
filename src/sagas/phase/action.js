import {
  call,
  fork,
  all,
  take,
  takeEvery,
  cancel,
  put,
  select
} from "redux-saga/effects";
import { gameSave } from "../meta";
import {
  watchTransferMarket,
  crisisMeeting,
  improveArena,
  toggleService,
  setActiveManager
} from "../manager";
import { orderPrank } from "../prank";
import { acceptInvitation } from "../invitation";

import { INVITATION_ACCEPT_REQUEST } from "../../ducks/invitation";
import { BETTING_BET_REQUEST } from "../../ducks/betting";
import { bet } from "../betting";

export default function* actionPhase() {
  const managers = yield select(state => state.manager.get("managers"));

  console.log("HELLUREI?", managers.toJS());

  yield call(setActiveManager, managers.first().get("id"));

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
    takeEvery("PRANK_ORDER", orderPrank),
    takeEvery(INVITATION_ACCEPT_REQUEST, function*(action) {
      yield call(acceptInvitation, action.payload.manager, action.payload.id);
    }),
    takeEvery(BETTING_BET_REQUEST, function*(action) {
      const {
        payload: { manager, coupon, amount }
      } = action;
      yield call(bet, manager, coupon, amount);
    })
  ]);

  yield take("GAME_ADVANCE_REQUEST");
  yield cancel(tasks);
}
