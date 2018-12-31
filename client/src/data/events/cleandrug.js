import { Map, List } from "immutable";
import { select, put } from "redux-saga/effects";
import { playersTeam } from "../selectors";
import { amount as a } from "../../services/format";

const eventId = "cleandrug";

const event = {
  type: "player",

  create: function*(data) {
    const { player } = data;

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          player,
          resolved: true
        })
      }
    });

    return;
  },

  render: data => {
    return List.of(`Kaikki pelaajasi olivat puhtaita huumausainetesteissä.`);
  },

  process: function*(data) {}
};

export default event;
