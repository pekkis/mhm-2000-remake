import { call, all, take, put, select } from "redux-saga/effects";
import { seasonStart, promote, relegate } from "../game";
import { victors } from "../../services/playoffs";
import awards from "../../data/awards";

export default function* endOfSeasonPhase() {
  yield call(awards);

  yield take("GAME_ADVANCE_REQUEST");

  yield put({
    type: "SEASON_END"
  });

  const division = yield select(state =>
    state.game.getIn(["competitions", "division"])
  );

  const phl = yield select(state => state.game.getIn(["competitions", "phl"]));

  const divisionVictor = victors(division.getIn(["phases", 3, "groups", 0]))
    .first()
    .get("id");

  const phlLoser = phl
    .getIn(["phases", 0, "groups", 0, "stats"])
    .last()
    .get("id");

  if (divisionVictor !== phlLoser) {
    yield all([promote("division", divisionVictor), relegate("phl", phlLoser)]);
  }

  yield call(seasonStart);
}
