import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementInsuranceExtra } from "../../sagas/manager";

/*
sat77:
IF CINT(100 * RND) < 50 THEN RETURN
PRINT "Etel„l„n tietokoneeseen on isketty virus! Kaikki vakuutustiedot ovat"
PRINT "kadonneet, ja siten bonukset nollautuvat!"
palo = 0
RETURN
*/

const eventId = "etelalaGlitch";

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
    return;
  },

  render: data => {
    let t = List.of(
      `__Etelälän__ tietokoneeseen on iskenyt _virus_! Kaikki vakuutustiedot ovat kadonneet, ja siten bonukset nollautuvat!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");

    const current = yield select(state =>
      state.manager.getIn(["managers", manager, "insuranceExtra"])
    );

    yield call(incrementInsuranceExtra, manager, 0 - current);
  }
};

export default event;
