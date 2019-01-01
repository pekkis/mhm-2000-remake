import { select, call, put } from "redux-saga/effects";
import competitionData from "../../data/competitions";
import { gameday } from "../gameday";
import calendar from "../../data/calendar";
import { List } from "immutable";

export default function* gamedayPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "gameday"
  });

  const round = yield select(state => state.game.getIn(["turn", "round"]));

  const calendarEntry = calendar.get(round);
  const gamedays = calendarEntry.get("gamedays", List());

  for (const item of gamedays) {
    yield call(gameday, item);
  }
}
