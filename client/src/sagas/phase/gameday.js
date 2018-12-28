import { select, call, put } from "redux-saga/effects";
import competitionData from "../../data/competitions";
import { gameday } from "../game";

export default function* gamedayPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "gameday"
  });

  const round = yield select(state => state.game.getIn(["turn", "round"]));

  for (const item of ["phl", "division"]) {
    const gamedays = competitionData.getIn([item, "gamedays"]);

    console.log(gamedays.toJS(), "gamedays");

    if (!gamedays.includes(round)) {
      continue;
    }

    yield call(gameday, item);
  }
}
