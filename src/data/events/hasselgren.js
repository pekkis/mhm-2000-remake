import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { decrementBalance, incrementInsuranceExtra } from "../../sagas/manager";
import { decrementMorale } from "../../sagas/team";
import { amount as a } from "../../services/format";
import { addEffect } from "../../sagas/team";
import { managersTeam, managerHasService } from "../selectors";

const eventId = "hasselgren";

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
        amount: 40000,
        resolved: true,
        hasInsurance
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Pelaaja __Thomas Hasselgren__ hakkasi edellisessä ottelussa erään pelaajan henkihieveriin! Hän saa 5 ottelun pelikiellon, ja muiden pelaajien moraali laskee! Lisäksi joukkueesi tuomitaan ${a(
        data.get("amount")
      )} pekan sakkoihin!`
    );

    if (data.get("hasInsurance")) {
      t = t.push(`Etelälä maksaa sakot!`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const hasInsurance = data.get("hasInsurance");
    const team = yield select(managersTeam(manager));

    yield call(addEffect, team.get("id"), ["strength"], -10, 5);
    yield call(decrementMorale, team.get("id"), 5);

    if (hasInsurance) {
      yield call(incrementInsuranceExtra, manager, 90);
    } else {
      yield call(decrementBalance, manager, data.get("amount"));
    }
  }
};

/*
sat29:
IF yk > 0 THEN RETURN
PRINT "Pelaaja Thomas Hasselgren hakkasi edellisess„ ottelussa er„„n pelaajan"
PRINT "henkihieveriin! H„n saa 5 ottelun pelikiellon, ja muiden pelaajien moraa-"
PRINT "li laskee! Lis„ksi joukkueesi tuomitaan 40.000 pekan sakkoihin!"
IF veikko = 1 THEN PRINT "Etel„l„ maksaa sakot!": palo = palo + 90 ELSE raha = raha - 40000
tauti2 = 10: yk = 5: mo = mo - 5
*/

export default event;
