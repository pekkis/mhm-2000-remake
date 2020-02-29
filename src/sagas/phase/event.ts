import { select, call, put, take, takeEvery, cancel } from "redux-saga/effects";
import { resolveEvent, processEvents } from "../event";

export default function* eventPhase() {
  return;
  yield put({
    type: "GAME_SET_PHASE",
    payload: "event"
  });

  yield put({
    type: "UI_DISABLE_ADVANCE"
  });

  const autoresolveEvents = yield select(state =>
    state.event
      .get("events")
      .filterNot(e => e.get("resolved"))
      .filter(e => e.get("autoResolve"))
  );

  for (const [, event] of autoresolveEvents) {
    const eventObj = events.get(event.get("eventId"));
    yield eventObj.resolve(event);
  }

  const resolver = yield takeEvery("EVENT_RESOLVE_REQUEST", resolveEvent);

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

  yield call(processEvents);

  yield put({
    type: "UI_ENABLE_ADVANCE"
  });
}
