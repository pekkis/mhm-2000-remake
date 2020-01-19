import { put, call, spawn } from "redux-saga/effects";
import delay from "@redux-saga/delay-p";
import uuid from "uuid";
import {
  NotificationAddAction,
  NOTIFICATION_ADD,
  MHMNotificationTypes
} from "../ducks/notification";

export function* autoDismissal(id) {
  yield delay(7000);
  yield call(dismissNotification, id);
}

export function* addNotification(
  manager: string,
  message: string,
  type: MHMNotificationTypes = "info"
) {
  const id = uuid();

  yield put<NotificationAddAction>({
    type: NOTIFICATION_ADD,
    payload: {
      id,
      manager,
      message,
      type
    }
  });

  yield spawn(autoDismissal, id);
}

export function* dismissNotification(id) {
  yield put({
    type: "NOTIFICATION_DISMISS",
    payload: id
  });
}
