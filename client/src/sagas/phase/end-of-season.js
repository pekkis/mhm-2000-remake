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
import { seasonStart, promote, relegate } from "../game";
import { victors } from "../../services/playoffs";
import table from "../../services/league";
import awards from "../../data/awards";

export default function* endOfSeasonPhase() {
  const round = yield select(state => state.game.getIn(["turn", "round"]));

  if (round !== 62) {
    return;
  }

  yield call(awards);

  yield take("GAME_ADVANCE_REQUEST");

  yield put({
    type: "SEASON_END"
  });

  const division = yield select(state =>
    state.game.getIn(["competitions", "division"])
  );

  const phl = yield select(state => state.game.getIn(["competitions", "phl"]));

  const divisionVictor = victors(
    division.getIn(["phases", 3, "groups", 0])
  ).first().id;
  const phlLoser = table(phl.getIn(["phases", 0, "groups", 0])).last().id;

  if (divisionVictor !== phlLoser) {
    yield all([promote("division", divisionVictor), relegate("phl", phlLoser)]);
  }

  yield call(seasonStart);
}
