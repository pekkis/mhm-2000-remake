import { put, call, spawn } from "redux-saga/effects";
import { Map } from "immutable";

import prankTypes from "../data/pranks";

export function* orderPrank(action) {
  const {
    payload: { manager, victim, type }
  } = action;

  const prank = Map({
    manager,
    victim,
    type
  });

  yield put({
    type: "PRANK_ADD",
    payload: prank
  });

  console.log(prank.toJS(), "prankster");

  const prankOrderer = prankTypes.getIn([prank.get("type"), "order"]);

  console.log(prankOrderer, "prankOrderer");

  yield call(prankOrderer, prank);
}
