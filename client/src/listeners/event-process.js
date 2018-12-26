import { select, put } from "redux-saga/effects";
import events from "../data/events";
import { processEvents } from "../sagas/event";

export default {
  phase: () => 1200,

  interested: state => {
    return true;
  },

  stop: () => false,

  block: function*() {
    const unresolved = yield select(state =>
      state.event
        .get("events")
        .filterNot(e => e.get("resolved"))
        .count()
    );

    return unresolved > 0;
  },

  suggestedPhase: () => undefined,

  generator: processEvents
};
