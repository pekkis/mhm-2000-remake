import { put, call, spawn } from "redux-saga/effects";
import { Map } from "immutable";

export function* executePrank(action) {
  const {
    payload: { manager, victim, type }
  } = action;

  yield put({
    type: "PRANK_ADD",
    payload: Map({
      manager,
      victim,
      type
    })
  });

  /*
  yield put({
    type: "NOTIFICATION_DISMISS",
    payload: id
  });
  */
}
