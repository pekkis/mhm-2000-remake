import { select, put } from "redux-saga/effects";
import events from "../data/events";

export default {
  phase: () => 11500,

  interested: state => {
    return true;
  },

  stop: () => false,

  suggestedPhase: () => undefined,

  generator: function*() {}
};
