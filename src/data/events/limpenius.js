import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementBalance, decrementBalance } from "../../sagas/manager";
import { incrementMorale, decrementMorale } from "../../sagas/team";
import { amount as a } from "../../services/format";
import { managersTeamId } from "../../data/selectors";
import r from "../../services/random";

/*
sat28:
PRINT "Ilta-Maso kirjoittaa h„v„istysjutun sinusta ja Landa Limpeniuksesta!"
PRINT "Haastat Ilta-Mason oikeuteen!"
x = 10 * RND
IF x > 6 THEN PRINT "Ilta-Maso voittaa jutun ja maksat kulut, 60000 pekkaa.": raha = raha + 60000
IF x < 6 THEN PRINT "Voitat jutun ja IM maksaa sinulle 60000 pekkaa!": raha = raha + 60000
IF x > 6 THEN PRINT "Lis„ksi moraali laskee maineesi murentuessa!": mo = mo - 4
IF x < 6 THEN PRINT "Lis„ksi moraali nousee maineesi puhdistuessa!": mo = mo + 4*/

const eventId = "limpenius";

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
        amount: 60000,
        moraleChange: 4,
        success: r.bool(0.6)
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Ilta-Maso kirjoittaa häväistysjutun sinusta ja __Landa Limpeniuksesta__. Haastat Ilta-Mason oikeuteen!`
    );

    if (data.get("success")) {
      t = t.push(
        `Voitat jutun ja Ilta-Maso maksaa sinulle ${a(
          data.get("amount")
        )} pekkaa. Lisäksi moraali nousee maineesi puhdistuessa!`
      );
    } else {
      t = t.push(
        `Ilta-Maso voittaa jutun ja maksat kulut, ${a(
          data.get("amount")
        )} pekkaa. Lisäksi moraali laskee maineesi murentuessa!`
      );
    }
    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const success = data.get("success");
    const amount = data.get("amount");
    const moraleChange = data.get("moraleChange");

    const team = yield select(managersTeamId(manager));

    if (success) {
      yield call(incrementBalance, manager, amount);
      yield call(incrementMorale, team, moraleChange);
    } else {
      yield call(decrementBalance, manager, amount);
      yield call(decrementMorale, team, moraleChange);
    }
  }
};

export default event;
