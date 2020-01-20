import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { managerHasService } from "../../services/selectors";
import { amount as a } from "../../services/format";
import { decrementBalance, incrementInsuranceExtra } from "../../sagas/manager";

/*
sat81:
IF sarja = 2 THEN RETURN
PRINT "Espanjalaisvahvistuksesi Jorg‚ Ramirez, liigan komeimmaksi ja egoistisim-"
PRINT "maksi mainittu pelaaja, kompastuu harjoituksissa kaatuen ja murtaen"
PRINT "nen„ns„! Sopimuksen erikoispyk„l„ velvoittaa sinut maksamaan"
PRINT "plastiikkakirurgikulut, 90.000 pekkaa!"
IF veikko = 1 THEN PRINT "Etel„l„ maksaa viulut!": palo = palo + 50:  ELSE raha = raha - 90000
*/

const eventId = "ramirez";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const hasInsurance = yield select(managerHasService(manager, "insurance"));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        hasInsurance,
        amount: 90000,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Espanjalaisvahvistuksesi __Jorge Ramirez__, liigan komeimmaksi ja egoistisimmaksi mainittu pelaaja, kompastuu harjoituksissa kaatuen ja murtaen kuuluisan kyömynenänsä! Sopimuksen erikoispykälä velvoittaa sinut maksamaan plastiikkakirurgikulut, ${a(
        data.get("amount")
      )} pekkaa!`
    );

    if (data.get("hasInsurance")) {
      t = t.push(`Etelälä maksaa viulut!`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");

    const hasInsurance = data.get("hasInsurance");

    if (hasInsurance) {
      yield call(incrementInsuranceExtra, manager, 50);
    } else {
      const amount = data.get("amount");
      yield call(decrementBalance, manager, amount);
    }
  }
};

export default event;
