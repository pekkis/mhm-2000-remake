import { select, call, take } from "redux-saga/effects";
import { gameday } from "../gameday";
import { setPhase, GAME_ADVANCE_REQUEST } from "../game";
import { MHMTurnDefinition } from "../../types/base";
import { currentCalendarEntry } from "../../services/selectors";

export default function* gamedayPhase() {
  yield call(setPhase, "gameday");
  yield take(GAME_ADVANCE_REQUEST);

  const calendarEntry: MHMTurnDefinition = yield select(currentCalendarEntry);
  yield call(gameday, calendarEntry.gamedays);

  yield call(setPhase, "results");
  yield take(GAME_ADVANCE_REQUEST);
}
