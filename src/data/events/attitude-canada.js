import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { flag } from "../selectors";
import { setFlag } from "../../sagas/game";

/*
sat78:
PRINT "Kanadassa asenne MM-kisoja kohtaan on muuttunut radikaalisti!"
IF knhl = 0 THEN PRINT "T„st„ edes kaikki supert„hdet tulevat kisoihin!"
IF knhl > 0 THEN PRINT "T„st„ l„htien heit„ edustaa rupuinen yliopistojoukkue!"
IF knhl = 0 THEN knhl = 30 ELSE knhl = 0
RETURN*/

const eventId = "attitudeCanada";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const attitude = yield select(flag("canada"));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        attitude: !attitude,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `__Kanadassa__ asenne MM-kisoja kohtaan on muuttunut radikaalisti.`
    );

    if (data.get("attitude") === true) {
      t = t.push(`Tästä edespäin kaikki supertähdet tulevat kisoihin!`);
    } else {
      t = t.push(`Tästä lähtien heitä edustaa rupuinen yliopistojoukkue!`);
    }

    return t;
  },

  process: function*(data) {
    const attitude = data.get("attitude");
    yield call(setFlag, "canada", attitude);
  }
};

export default event;
