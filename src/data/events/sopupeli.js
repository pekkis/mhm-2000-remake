import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent, resolvedEvent } from "../../sagas/event";
import { managerCompetesIn, managersTeamId } from "../selectors";
import { incrementBalance } from "../../sagas/manager";
import { addEffect } from "../../sagas/team";
import { amount as a } from "../../services/format";

/*
IF kr = 45 THEN RETURN
hgd = 300000
IF sarja = 1 THEN PRINT "Nimet”n soittaja lupaa siirt„„ joukkueenne tilille "; hgd; " pekkaa"
IF sarja = 2 THEN PRINT "Nimet”n soittaja lupaa siirt„„ joukkueenne tilille "; hgd / 2; " pekkaa"
PRINT "jos 'j„rjest„t' joukkueesi tappion seuraavassa ottelussa."
PRINT "Suostutko sopupeliin? (k/e)"
INPUT sopu$
IF sopu$ = "k" AND sarja = 1 THEN tauti = v(u) + 50: raha = raha + hgd: RETURN
IF sopu$ = "k" AND sarja = 2 THEN tauti = vd(u) + 50: raha = raha + hgd / 2: RETURN
IF sopu$ = "e" THEN RETURN
GOTO sat55*/

const eventId = "sopupeli";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    const amount = competesInPHL ? 300000 : 150000;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount,
        resolved: false
      })
    );
    return;
  },

  options: () =>
    Map({
      agree: "Kyllä. Sopu sijaa antaa!",
      disagree: "En. Kunnia ennen lompakkoa!"
    }),

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true,
      agree: value === "agree"
    });

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `Nimetön soittaja lupaa siirtää joukkueenne tilille ${a(
        data.get("amount")
      )} pekkaa jos "järjestät" joukkueesi tappion seuraavassa ottelussa. Suostutko sopupeliin?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (data.get("agree")) {
      t = t.push(`Soittaja lupaa suorittaa transaktion välittömästi.`);
    } else {
      t = t.push(`Soittaja lyö luurin korvaasi.`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    if (data.get("agree")) {
      const amount = data.get("amount");
      yield call(incrementBalance, manager, amount);
      yield call(addEffect, team, ["strength"], -1000, 1);
    }
  }
};

export default event;
