import { take, putResolve, select, call, all, race } from "redux-saga/effects";
import { seasonStart } from "../game";
import strategies from "../../data/strategies";

function* selectStrategy() {
  yield putResolve({
    type: "GAME_SET_PHASE",
    payload: "select-strategy"
  });

  const action = yield take("MANAGER_SELECT_STRATEGY");
  const { payload } = action;

  const team = yield select(state =>
    state.manager.getIn(["managers", payload.manager, "team"])
  );

  yield all([
    putResolve({
      type: "TEAM_SET_STRATEGY",
      payload: {
        team,
        strategy: payload.strategy
      }
    }),
    putResolve({
      type: "TEAM_SET_READINESS",
      payload: {
        team,
        readiness: strategies.getIn([payload.strategy, "initialReadiness"])()
      }
    })
  ]);
}

function* championshipBetting() {
  yield putResolve({
    type: "GAME_SET_PHASE",
    payload: "championship-betting"
  });

  const { bet, advance } = yield race({
    bet: take("MANAGER_BET_CHAMPION_REQUEST"),
    advance: take("GAME_ADVANCE_REQUEST")
  });

  console.log(bet, advance, "bibbidi");
}

export default function* startOfSeasonPhase() {
  yield call(seasonStart);
  yield call(selectStrategy);
  yield call(championshipBetting);
}
