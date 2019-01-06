import { Map, List } from "immutable";
import { call } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";

const eventId = "cleandrug";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: true
      })
    );
  },

  render: data => {
    return List.of(`Kaikki pelaajasi olivat puhtaita huumausainetesteissä.`);
  },

  process: function*(data) {}
};

export default event;
