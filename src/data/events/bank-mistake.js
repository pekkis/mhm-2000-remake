import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementBalance, decrementBalance } from "../../sagas/manager";
import { amount as a } from "../../services/format";
import { managersDifficulty } from "../selectors";

/*
PRINT "Pankkinne on tehnyt virheen. Tilill„nne on 500.000 pekkaa liikaa."
PRINT "Kukaan ei huomaa mit„„n..."
IF vai >= 4 THEN PRINT "paitsi er„s pelaaja, jonka vaikeneminen maksaa 200.000 pekkaa!"
raha = raha + 500000
IF vai >= 4 THEN raha = raha - 200000
*/

const eventId = "bankMistake";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 500000,
        bribe: difficulty === 4 && 200000,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Pankkinne on tehnyt virheen. Tilillänne on __${a(
        data.get("amount")
      )}__ pekkaa liikaa. Kukaan ei huomaa mitään...`
    );

    if (data.get("bribe")) {
      t = t.push(
        `... paitsi yksi erittäin tarkkaavainen pelaaja, jonka vaikeneminen maksaa __${a(
          data.get("bribe")
        )}__ pekkaa.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const amount = data.get("amount");
    const bribe = data.get("bribe");

    yield call(incrementBalance, manager, amount);
    if (bribe) {
      yield call(decrementBalance, manager, bribe);
    }
  }
};

export default event;
