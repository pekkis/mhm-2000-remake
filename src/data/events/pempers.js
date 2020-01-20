import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementBalance } from "../../sagas/manager";
import { decrementMorale } from "../../sagas/team";
import { amount as a } from "../../services/format";
import { managersTeamId } from "../../services/selectors";

/*
PRINT "Mainostoimisto maksaa 55000 pekkaa joukkueen esiintymisest„ vaippa-"
PRINT "mainoksessa. Ihmiset nauravat, ja moraali laskee!"
raha = raha + 55000: mo = mo - 3
*/

const eventId = "pempers";

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
        amount: 55000,
        moraleLost: 3
      })
    );
    return;
  },

  render: data => {
    return List.of(
      `Mainostoimisto maksaa ${a(
        data.get("amount")
      )} pekkaa joukkueen esiintymisestä vaippamainoksessa. Ihmiset nauravat, ja moraali laskee!`
    );
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));

    yield call(incrementBalance, manager, data.get("amount"));
    yield call(decrementMorale, team, data.get("moraleLost"));
  }
};

export default event;
