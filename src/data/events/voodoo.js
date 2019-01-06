import { Map, List } from "immutable";
import { select, call } from "redux-saga/effects";
import { managersTeamId } from "../selectors";
import { amount as a } from "../../services/format";
import { addEvent, resolvedEvent } from "../../sagas/event";
import { incrementMorale, decrementMorale } from "../../sagas/team";
import { decrementBalance } from "../../sagas/manager";

const eventId = "voodoo";

/*
sat16:
Haitilta saapunut tumma mies lupaa tuplata joukkueesi voiman 100000 pekalla. Maksatko?
INPUT s$
IF s$ = "e" THEN PRINT "Mies vilauttaa sinulle voodoo-nukkeaan...": mo = mo - 1: RETURN
IF s$ = "k" THEN raha = raha - 100000: mo = 12: PRINT "Yhteishenki paranee kun pelaajat uskovat itseens„ enemm„n!": RETURN
GOTO sat16
*/

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 100000,
        resolved: false
      })
    );
  },

  options: data => {
    return Map({
      agree: `Totta kai. Tervetuloa harjoituksiimme, hyvä herra, tässä rahat!`,
      disagree: "En maksa. Kiitos tarjouksesta, ehkä joku toinen kerta!"
    });
  },

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true,
      agree: value === "agree"
    });

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `Haitilta saapunut tumma mies lupaa tuplata joukkueesi voiman ${a(
        data.get("amount")
      )} pekalla. Maksatko?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (data.get("agree")) {
      t = t.push("Yhteishenki paranee kun pelaajat uskovat itseensä enemmän!!");
    } else {
      t = t.push(`Mies vilauttaa sinulle voodoo-nukkeaan...`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));

    if (data.get("agree")) {
      yield call(incrementMorale, team, 10000);
      yield call(decrementBalance, team, data.get("amount"));
    } else {
      yield call(decrementMorale, team, 1);
    }
  }
};

export default event;
