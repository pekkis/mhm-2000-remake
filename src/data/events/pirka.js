import { Map, List } from "immutable";
import { put, call } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementBalance } from "../../sagas/manager";

const eventId = "pirka";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: true,
        amount: 80000
      })
    );
    return;
  },

  render: data => {
    return List.of(
      `Ikääntynyt rokkitähti, __Pirka__, kuolee ja lahjoittaa koko omaisuutensa joukkueelle (${data.get(
        "amount"
      )} pekkaa ja kiinanpalatsikoiran).`
    );
  },

  process: function*(data) {
    yield call(incrementBalance, data.get("manager"), data.get("amount"));
  }
};

export default event;
