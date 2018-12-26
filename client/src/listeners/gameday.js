import { select, put, take } from "redux-saga/effects";
import competitionData from "../data/competitions";

export default {
  phase: () => 1000,

  interested: state => {
    return true;
  },

  stop: () => false,

  generator: function*() {
    const round = yield select(state => state.game.getIn(["turn", "round"]));

    // const state = yield select(state => state.player);
    // console.log("generatore!", state);

    for (const item of ["phl", "division"]) {
      const gamedays = competitionData.getIn([item, "gamedays"]);

      console.log(gamedays.toJS(), "gamedays");

      if (!gamedays.includes(round)) {
        continue;
      }

      yield put({
        type: "GAME_GAMEDAY_REQUEST",
        payload: item
      });

      yield take("GAME_GAMEDAY_COMPLETE");
    }
  }
};
