import { take, call } from "redux-saga/effects";

import { GAME_ADVANCE_REQUEST, setPhase } from "../game";

export default function* newsPhase() {
  yield call(setPhase, "news");
  yield take(GAME_ADVANCE_REQUEST);
}
