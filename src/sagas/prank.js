import { put, call, select } from "redux-saga/effects";

import prankTypes from "../services/data/pranks";
import { managerCompetesIn } from "../services/selectors";
import { decrementBalance } from "../sagas/manager";

export function* orderPrank(action) {
  const {
    payload: { manager, victim, type }
  } = action;

  const prank = Map({
    manager,
    victim,
    type
  });

  const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
  const targetCompetition = competesInPHL ? "phl" : "division";

  const prankPrice = prankTypes.getIn([prank.get("type"), "price"])(
    targetCompetition
  );

  yield call(decrementBalance, manager, prankPrice);

  yield put({
    type: "PRANK_ADD",
    payload: prank
  });

  const prankOrderer = prankTypes.getIn([prank.get("type"), "order"]);

  yield call(prankOrderer, prank);
}
