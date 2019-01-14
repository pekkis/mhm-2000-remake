import { call, all, take, put, select } from "redux-saga/effects";
import { seasonStart, promote, relegate, setPhase } from "../game";
import { victors, eliminated } from "../../services/playoffs";
import awards from "../../data/awards";
import { List, Map } from "immutable";
import { cinteger } from "../../services/random";

import countries from "../../data/countries";

const getLuck = () => {
  const isLucky = cinteger(1, 10);

  if (isLucky === 1) {
    return -(cinteger(0, 20) + 20);
  }

  if (isLucky === 10) {
    return cinteger(0, 20) + 20;
  }

  return 0;
};

function* worldChampionships() {
  yield call(setPhase, "world-championships");
  const turn = yield select(state => state.game.get("turn"));
  const season = turn.get("season");

  let strengths = List();
  for (const [index, country] of countries.entries()) {
    const strength = yield call(country.get("strength"));
    strengths = strengths.set(index, strength);
  }

  const entries = strengths
    .map((s, i) => {
      return Map({
        id: i,
        name: countries.getIn([i, "name"]),
        strength: strengths.get(i),
        luck: getLuck(),
        random: cinteger(0, 20) - cinteger(0, 10)
      });
    })
    .sortBy(e => e.get("strength") + e.get("luck") + e.get("random"))
    .reverse();

  console.log(entries.toJS(), "entries");

  yield put({
    type: "GAME_WORLD_CHAMPIONSHIP_RESULTS",
    payload: entries
  });

  yield take("GAME_ADVANCE_REQUEST");
}

export default function* endOfSeasonPhase() {
  yield call(worldChampionships);

  yield call(setPhase, "end-of-season");

  yield call(awards);

  yield take("GAME_ADVANCE_REQUEST");

  yield call(setPhase, "end-of-season");

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
