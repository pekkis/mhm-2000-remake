import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { managerHasService, managersArena } from "../selectors";
import { amount as a } from "../../services/format";
import { incrementInsuranceExtra } from "../../sagas/manager";

/*
sat76:
PRINT "Etel„l„ julkistaa suuren kansainv„lisen BONUSTEMPAUKSEN!"
IF veikko = 1 THEN PRINT "Vakuutussummasi laskee"; 30 * hjalli; "pekan verran!"
IF veikko = 1 THEN palo = palo - 30 * hjalli
RETURN*/

const eventId = "etelalaBonusFrenzy";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const arena = yield select(managersArena(manager));

    const amount = -(30 * (arena.get("level") + 1));

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
    let t = List.of(
      `Etelälä julkistaa suuren kansainvälisen __bonustempauksen__!`
    );

    if (data.get("hasInsurance")) {
      t = t.push(
        `Vakuutussummasi laskee ${a(
          Math.abs(data.get("amount"))
        )} pekan verran!`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const amount = data.get("amount");
    yield call(incrementInsuranceExtra, manager, amount);
  }
};

export default event;
