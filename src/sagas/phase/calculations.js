import { put, putResolve, select } from "redux-saga/effects";

import strategies from "../../data/strategies";

export default function* calculationsPhase() {
  const turn = yield select(state => state.game.get("turn"));

  console.log("CALCULATIONS PHASE FOR TURN #", turn.get("round"));

  const teams = yield select(state => state.game.get("teams"));

  for (const team of teams) {
    const readinessIncrementer = strategies.getIn([
      team.get("strategy"),
      "incrementReadiness"
    ]);

    const amountToIncrement = readinessIncrementer(turn);

    if (amountToIncrement !== 0) {
      yield put({
        type: "TEAM_INCREMENT_READINESS",
        payload: {
          team: team.get("id"),
          amount: amountToIncrement
        }
      });
    }
  }

  yield putResolve({ type: "GAME_DECREMENT_DURATIONS" });
}
