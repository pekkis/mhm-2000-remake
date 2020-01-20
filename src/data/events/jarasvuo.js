import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent, resolvedEvent } from "../../sagas/event";
import {
  addOpponentEffect,
  decrementMorale,
  decrementStrength,
  incrementMorale,
  addEffect
} from "../../sagas/team";
import { managersTeamId, managerCompetesIn } from "../../services/selectors";
import { incrementBalance } from "../../sagas/manager";

/*
IF yk > 0 THEN RETURN
IF sarja = 2 THEN RETURN
PRINT "Huippupelaajanne on Sari Jarasvuon ohjelmassa haastattelussa."
PRINT "H„n ry”pytt„„ jostain syyst„ useita kanssapelaajiaan, valmentajaa"
PRINT "ja koko organisaatiota. Kaikki saavat osansa."
PRINT "Miten rankaiset pelaajaa?"
PRINT "(s)akko, (e)i mit„„n vaiko (p)elikielto 3 ottelun ajaksi ??"
INPUT reag$
IF reag$ = "s" THEN PRINT "Tulos: Pelaaja pyyt„„ anteeksi.": mo = mo - 3: raha = raha + 10000: RETURN
IF reag$ = "e" THEN PRINT "Seuraus: KAPINA!!! Kaikki kaatuu p„„lle, johtokunta kokoontuu, pelaajat": PRINT "lopettavat protestina harjoituksen, fanit buuavat sinulle.": PRINT "Muutama pelaaja lopettaa uransakin.": v(u) = v(u) - 18: mo = -30: RETURN
IF reag$ = "p" THEN PRINT "Loistava tuomio, sanovat muut pelaajat.": yk = 3: tauti2 = 17: RETURN
*/

const eventId = "jarasvuo";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;
    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    if (!competesInPHL) {
      console.log("UWT?");
      return;
    }

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: false
      })
    );
    return;
  },

  options: () =>
    Map({
      fine: "Annan sakon.",
      ban: "Annan kolme ottelua kurinpidollista pelikieltoa.",
      nothing: "En tee mitään. Pojat ovat poikia!"
    }),

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true,
      solution: value
    });

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `Huippupelaajanne on Sari Jarasvuon ohjelmassa haastattelussa. Hän ryöpyttää jostain syystä useita kanssapelaajiaan, valmentajaa ja koko organisaatiota. Kaikki saavat osansa.

Miten rankaiset pelaajaa?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (data.get("solution") === "nothing") {
      t = t.push(
        `Seuraus on KAPINA!!! Kaikki kaatuu päälle, johtokunta kokoontuu, pelaajat lopettavat protestina harjoittelun, fanit buuavat sinulle. Muutama pelaaja jopa lopettaa uransakin.`
      );
    }

    if (data.get("solution") === "fine") {
      t = t.push(`Pelaaja pyytää anteeksi.`);
    }

    if (data.get("solution") === "ban") {
      t = t.push(`Loistava tuomio, sanovat muut pelaajat.`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const solution = data.get("solution");
    const team = yield select(managersTeamId(manager));

    if (solution === "nothing") {
      yield call(decrementMorale, team, 50);
      yield call(decrementStrength, team, 18);
    }

    if (solution === "fine") {
      yield call(incrementBalance, manager, 10000);
      yield call(decrementMorale, team, 3);
    }

    if (solution === "ban") {
      yield call(addEffect, team, ["strength"], -15, 3);
      yield call(incrementMorale, team, 5);
    }
  }
};

/*
sat42:
IF yk > 0 THEN RETURN
IF sarja = 2 THEN RETURN
PRINT "Huippupelaajanne on Sari Jarasvuon ohjelmassa haastattelussa."
PRINT "H„n ry”pytt„„ jostain syyst„ useita kanssapelaajiaan, valmentajaa"
PRINT "ja koko organisaatiota. Kaikki saavat osansa."
PRINT "Miten rankaiset pelaajaa?"
PRINT "(s)akko, (e)i mit„„n vaiko (p)elikielto 3 ottelun ajaksi ??"
INPUT reag$
IF reag$ = "s" THEN PRINT "Tulos: Pelaaja pyyt„„ anteeksi.": mo = mo - 3: raha = raha + 10000: RETURN
IF reag$ = "e" THEN PRINT "Seuraus: KAPINA!!! Kaikki kaatuu p„„lle, johtokunta kokoontuu, pelaajat": PRINT "lopettavat protestina harjoituksen, fanit buuavat sinulle.": PRINT "Muutama pelaaja lopettaa uransakin.": v(u) = v(u) - 18: mo = -30: RETURN
IF reag$ = "p" THEN PRINT "Loistava tuomio, sanovat muut pelaajat.": yk = 3: tauti2 = 17: RETURN
*/

export default event;
