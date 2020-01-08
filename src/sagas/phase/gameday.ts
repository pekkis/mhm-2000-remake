import { select, call, take } from "redux-saga/effects";
import { gameday } from "../gameday";
import { setPhase, GAME_ADVANCE_REQUEST } from "../game";
import { MHMTurnDefinition } from "../../types/base";
import { currentCalendarEntry } from "../../data/selectors";

export default function* gamedayPhase() {
  yield call(setPhase, "gameday");
  yield take(GAME_ADVANCE_REQUEST);

  const calendarEntry: MHMTurnDefinition = yield select(currentCalendarEntry);
  for (const item of calendarEntry.gamedays) {
    yield call(gameday, item);
  }

  yield call(setPhase, "results");
  yield take(GAME_ADVANCE_REQUEST);
}
