import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { managerHasService } from "../selectors";
import { cinteger } from "../../services/random";
import { incrementServiceBasePrice } from "../../sagas/game";

/*
sat75:
PRINT "Etel„l„ laskee vakuutuksensa l„ht”hintoja!"
hinta = hinta - CINT(100 * RND) + 50
IF veikko = 1 THEN PRINT "Johtokunta kiittelee yhti”n p„„t”st„!"
RETURN
*/

const eventId = "etelalaDescends";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const amount = -(cinteger(0, 100) + 50);

    const hasInsurance = yield select(managerHasService(manager, "insurance"));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount,
        hasInsurance,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(`Etelälä laskee vakuutuksensa lähtöhintoja!`);

    if (data.get("hasInsurance")) {
      t = t.push(`Johtokunta kiittelee yhtiön päätöstä!`);
    }

    return t;
  },

  process: function*(data) {
    const amount = data.get("amount");
    yield call(incrementServiceBasePrice, "insurance", amount);
  }
};

export default event;
