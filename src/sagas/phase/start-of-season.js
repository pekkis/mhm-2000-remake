import { take, putResolve, select, call } from "redux-saga/effects";
import { seasonStart } from "../game";

export default function* startOfSeasonPhase() {
  yield call(seasonStart);

  yield putResolve({
    type: "GAME_SET_PHASE",
    payload: "select-strategy"
  });

  const action = yield take("PLAYER_SELECT_STRATEGY");
  const { payload } = action;

  const team = yield select(state =>
    state.player.getIn(["players", payload.player, "team"])
  );

  yield putResolve({
    type: "TEAM_SET_STRATEGY",
    payload: {
      team,
      strategy: payload.strategy
    }
  });
}
