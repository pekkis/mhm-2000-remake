import { call, all, take, put, select, putResolve } from "redux-saga/effects";
import { seasonStart, promote, relegate, setPhase } from "../game";
import { victors, eliminated } from "../../services/playoffs";
import awards from "../../data/awards";
import { List, Map } from "immutable";
import { cinteger } from "../../services/random";

import countries from "../../data/countries";
import { setSeasonStat, createSeasonStories } from "../stats";
import { processChampionBets } from "../betting";
import { competition, allTeams } from "../../data/selectors";
import { csetStrength, setStrength } from "../../ducks/country";

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

function* definePekkalandiaStrength() {
  const phl = yield select(competition("phl"));
  const teams = yield select(allTeams);

  const avg = phl
    .get("teams")
    .map(t => teams.getIn([t, "strength"]))
    .reduce((r, s) => r + s, 0);

  const strength = Math.round(avg / phl.get("teams").count());

  console.log("strength", strength);

  yield putResolve(setStrength("FI", strength));
}

function* worldChampionships() {
  yield call(setPhase, "world-championships");
  yield call(definePekkalandiaStrength);

  const countries = yield select(state => state.country.get("countries"));

  const entries = countries
    .map(c => {
      return Map({
        id: c.get("iso"),
        name: c.get("name"),
        strength: c.get("strength"),
        luck: getLuck(),
        random: cinteger(0, 20) - cinteger(0, 10)
      });
    })
    .sortBy(e => e.get("strength") + e.get("luck") + e.get("random"))
    .toList()
    .reverse();

  console.log(entries.toJS(), "entries");

  yield put({
    type: "GAME_WORLD_CHAMPIONSHIP_RESULTS",
    payload: entries
  });

  yield call(
    setSeasonStat,
    ["worldChampionships"],
    entries.map(e => e.get("id"))
  );

  yield take("GAME_ADVANCE_REQUEST");
}

export default function* endOfSeasonPhase() {
  yield call(worldChampionships);

  yield call(setPhase, "end-of-season");

  yield call(awards);

  yield call(setPhase, "end-of-season");

  const division = yield select(state =>
    state.game.getIn(["competitions", "division"])
  );

  const phl = yield select(state => state.game.getIn(["competitions", "phl"]));

  const divisionVictor = victors(division.getIn(["phases", 3, "groups", 0]))
    .first()
    .get("id");

  const presidentsTrophy = phl
    .getIn(["phases", 0, "groups", 0, "stats"])
    .first()
    .get("id");
  yield call(setSeasonStat, ["presidentsTrophy"], presidentsTrophy);

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

  yield call(setSeasonStat, ["medalists"], medalists);

  if (divisionVictor !== phlLoser) {
    yield call(setSeasonStat, ["relegated"], phlLoser);
    yield call(setSeasonStat, ["promoted"], divisionVictor);
  }

  yield call(processChampionBets);

  yield call(createSeasonStories);

  yield take("GAME_ADVANCE_REQUEST");

  yield put({
    type: "SEASON_END"
  });

  if (divisionVictor !== phlLoser) {
    yield all([promote("division", divisionVictor), relegate("phl", phlLoser)]);
  }

  yield call(seasonStart);
}
