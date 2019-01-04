import { put, race, take, call } from "redux-saga/effects";
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

  const { deathByOldAge } = yield race({
    dismiss: take("NOTIFICATION_DISMISS"),
    deathByOldAge: delay(10000)
  });

  if (deathByOldAge) {
    yield call(dismissNotification, id);
  }
}

export function* dismissNotification(id) {
  yield put({
    type: "NOTIFICATION_DISMISS",
    payload: id
  });
}
