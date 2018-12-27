import { select, call, put, fork } from "redux-saga/effects";
import events from "../data/events";
import uuid from "uuid";
import r from "../services/random";

export default {
  phase: () => 1100,

  interested: state => {
    return true;
  },

  stop: () => false,

  generator: function*() {
    console.log("events", events);

    const player = 0;

    const eventId = r.integer(0, 2);

    // const eventId = 2;

    console.log("eventid", eventId);

    const tussi = yield* events.get(eventId).create({
      player,
      eventId
    });

    console.log("tussi", tussi);
  }
};
