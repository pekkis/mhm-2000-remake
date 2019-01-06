import { Map, List } from "immutable";
import { select, put, call } from "redux-saga/effects";
import { managersArena } from "../selectors";
import { amount as a } from "../../services/format";
import { addEvent } from "../../sagas/event";
import { incrementBalance } from "../../sagas/manager";

const eventId = "concert";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const arena = yield select(managersArena(manager));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: true,
        amount: 10000 + 20000 * (arena.get("level") + 1)
      })
    );
    return;
  },

  render: data => {
    return List.of(
      `Joukkueesi areenalla pidetään suuri rock-konsertti. Tuotto: ${a(
        data.get("amount")
      )} pekkaa.`
    );
  },

  process: function*(data) {
    yield call(incrementBalance, data.get("manager"), data.get("amount"));
  }
};

export default event;
