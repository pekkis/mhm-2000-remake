import { put, takeLatest, all, select } from "redux-saga/effects";

import events from "../data/events";

export function* resolveEvent(action) {
  const { event, value } = action.payload;

  const eventObj = events.get(event.get("eventId"));
  const resolvedEvent = eventObj.resolve(event, value);

  yield put({
    type: "EVENT_RESOLVE",
    payload: {
      id: resolvedEvent.get("id"),
      event: resolvedEvent
    }
  });
}

export function* processEvents() {
  const eventsToProcess = yield select(state =>
    state.event
      .get("events")
      .filter(e => e.get("resolved"))
      .filterNot(e => e.get("processed"))
  );

  for (const [, event] of eventsToProcess) {
    console.log(event, "event being processed", event);

    yield events.get(event.get("eventId")).generator(event);
    yield put({
      type: "EVENT_SET_PROCESSED",
      payload: {
        id: event.get("id")
      }
    });
  }
}

function* watchEventResolve() {
  yield takeLatest("EVENT_RESOLVE_REQUEST", resolveEvent);
}

export default function* gameSagas() {
  yield all([watchEventResolve()]);
}
