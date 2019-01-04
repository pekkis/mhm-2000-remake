import { take, putResolve, select, call } from "redux-saga/effects";
import { seasonStart } from "../game";

export default function* startOfSeasonPhase() {
  yield call(seasonStart);

  yield putResolve({
    type: "GAME_SET_PHASE",
    payload: "select-strategy"
  });

  const action = yield take("MANAGER_SELECT_STRATEGY");
  const { payload } = action;

  const team = yield select(state =>
    state.manager.getIn(["managers", payload.manager, "team"])
  );

  yield putResolve({
    type: "TEAM_SET_STRATEGY",
    payload: {
      team,
      strategy: payload.strategy
    }
  });
}
