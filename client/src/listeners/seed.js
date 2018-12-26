import { select, put } from "redux-saga/effects";
import events from "../data/events";
import competitionData from "../data/competitions";

export default {
  phase: () => 1900,

  interested: state => {
    return true;
  },

  stop: () => false,

  generator: function*() {
    const round = yield select(state => state.game.getIn(["turn", "round"]));

    /*
    yield put({
      type: "COMPETITION_SEED",
      payload: {
        competition: key,
        phase: 0,
        seed: competitionObj.getIn(["seed", 0])(competition)
      }
    });
    */

    if (round !== 44) {
      return;
    }

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

    console.log("SEEDING FUCKING TIME FOR YOU");
  }
};
