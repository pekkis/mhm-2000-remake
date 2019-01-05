import { put, race, take, call, spawn } from "redux-saga/effects";
import delay from "@redux-saga/delay-p";
import uuid from "uuid";

export function* addNotification(manager, message, type = "info") {
  const id = uuid();

  yield put({
    type: "NOTIFICATION_ADD",
    payload: {
      id,
      manager,
      message,
      type
    }
  });

  yield delay(10000);
  yield call(dismissNotification, id);
}

export function* dismissNotification(id) {
  yield put({
    type: "NOTIFICATION_DISMISS",
    payload: id
  });
}
