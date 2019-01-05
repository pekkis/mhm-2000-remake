import { call, all, take, put, select } from "redux-saga/effects";
import { seasonStart, promote, relegate } from "../game";
import { victors, eliminated } from "../../services/playoffs";
import awards from "../../data/awards";
import { List } from "immutable";

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

  const phlFinals = phl.getIn(["phases", 3, "groups", 0]);
  const phlVictors = victors(phlFinals);
  const phlLosers = eliminated(phlFinals);

  const medalists = List.of(
    phlVictors.first(),
    phlLosers.first(),
    phlVictors.last()
  ).map(e => e.get("id"));

  console.log("MEDALISTS", medalists.toJS());
  yield put({
    type: "GAME_HISTORY_PUSH",
    payload: {
      ehlParticipants: medalists
    }
  });

  if (divisionVictor !== phlLoser) {
    yield all([promote("division", divisionVictor), relegate("phl", phlLoser)]);
  }

  yield call(seasonStart);
}
