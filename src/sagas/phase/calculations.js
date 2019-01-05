import { put, putResolve, select, call } from "redux-saga/effects";

import strategies from "../../data/strategies";
import services from "../../data/services";
import { decrementBalance } from "../manager";

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

  const managers = yield select(state => state.manager.get("managers"));

  const basePrices = yield select(state => state.game.get("serviceBasePrices"));

  for (const [managerId, manager] of managers.entries()) {
    const managersServices = manager
      .get("services")
      .filter(s => s)
      .map((s, k) => services.get(k));

    const serviceCosts = managersServices.reduce((r, service, serviceId) => {
      console.log(r, service);
      return r + service.get("price")(basePrices.get(serviceId), manager);
    }, 0);

    yield call(decrementBalance, managerId, serviceCosts);
  }

  // TODO: MOVE DIS?
  yield putResolve({ type: "GAME_DECREMENT_DURATIONS" });
}
