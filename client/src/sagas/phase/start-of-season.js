import { take, putResolve, select } from "redux-saga/effects";

export default function* startOfSeasonPhase() {
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
