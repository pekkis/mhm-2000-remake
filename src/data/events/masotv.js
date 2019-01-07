import { Map, List } from "immutable";
import { call } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementBalance } from "../../sagas/manager";
import { amount as a } from "../../services/format";

/*
sat20:
PRINT "Maso TV ostaa seuraavan ottelunne televisiointioikeudet."
PRINT "He maksavat joukkueelle 30000 pekkaa."
raha = raha + 30000
*/

const eventId = "masotv";

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
        amount: 30000
      })
    );
    return;
  },

  render: data => {
    return List.of(
      `__Maso TV__ ostaa seuraavan ottelunne televisiointioikeudet. He maksavat joukkueelle ${a(
        data.get("amount")
      )} pekkaa.`
    );
  },

  process: function*(data) {
    yield call(incrementBalance, data.get("manager"), data.get("amount"));
  }
};

export default event;
