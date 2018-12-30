import { select, put } from "redux-saga/effects";
import competitionData from "../../data/competitions";

export default function* seedPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "seed"
  });

  const round = yield select(state => state.game.getIn(["turn", "round"]));

  if (round === 44) {
    const competitions = yield select(state => state.game.get("competitions"));
    for (const key of ["division", "phl"]) {
      const competitionObj = competitionData.get(key);

      yield put({
        type: "COMPETITION_SEED",
        payload: {
          competition: key,
          phase: 1,
          seed: competitionObj.getIn(["seed", 1])(competitions)
        }
      });
    }
  }
  if (round === 49) {
    const competitions = yield select(state => state.game.get("competitions"));
    for (const key of ["division", "phl"]) {
      const competitionObj = competitionData.get(key);

      yield put({
        type: "COMPETITION_SEED",
        payload: {
          competition: key,
          phase: 2,
          seed: competitionObj.getIn(["seed", 2])(competitions)
        }
      });
    }
  }

  if (round === 54) {
    const competitions = yield select(state => state.game.get("competitions"));
    for (const key of ["division", "phl"]) {
      const competitionObj = competitionData.get(key);

      yield put({
        type: "COMPETITION_SEED",
        payload: {
          competition: key,
          phase: 3,
          seed: competitionObj.getIn(["seed", 3])(competitions)
        }
      });
    }
  }
}
