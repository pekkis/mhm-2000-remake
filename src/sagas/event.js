import { put, select } from "redux-saga/effects";

import events from "../data/events";

export function* resolveEvent(action) {
  const { event, value } = action.payload;

  const eventObj = events.get(event.get("eventId"));

  yield eventObj.resolve(event, value);
}

export function* addEvent(eventData) {
  yield put({
    type: "EVENT_ADD",
    payload: { event: eventData }
  });
}

export function* resolvedEvent(eventData) {
  yield put({
    type: "EVENT_RESOLVE",
    payload: {
      id: eventData.get("id"),
      event: eventData
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
    yield events.get(event.get("eventId")).process(event);
    yield put({
      type: "EVENT_SET_PROCESSED",
      payload: {
        id: event.get("id")
      }
    });
  }
}
