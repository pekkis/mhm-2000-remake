import {
  select,
  call,
  put,
  fork,
  take,
  takeEvery,
  cancel
} from "redux-saga/effects";
import events from "../../data/events";
import uuid from "uuid";
import r from "../../services/random";
import { resolveEvent, processEvents } from "../event";

export default function* eventPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "event"
  });

  return;

  console.log("events", events);

  const player = 0;

  const eventId = r.integer(0, 2);

  // const eventId = 2;

  console.log("eventid", eventId);

  yield events.get(eventId).create({
    player,
    eventId
  });

  const resolver = yield takeEvery("EVENT_RESOLVE_REQUEST", resolveEvent);
  console.log("resolver");

  let unresolved;
  do {
    unresolved = yield select(state =>
      state.event
        .get("events")
        .filterNot(e => e.get("resolved"))
        .count()
    );

    if (unresolved) {
      yield take("EVENT_RESOLVE");
    }
  } while (unresolved);

  yield cancel(resolver);

  console.log("PROCESSING EVENTS");
  yield call(processEvents);
}
