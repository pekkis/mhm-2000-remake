import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementBalance, incrementInsuranceExtra } from "../../sagas/manager";
import { amount as a } from "../../services/format";
import { addEffect } from "../../sagas/team";
import { managersTeam, managerHasService } from "../selectors";

/*
sat20:
PRINT "Omituinen kuumetauti iskee joukkueeseen. Puolet pelaajista makaa pe-"
PRINT "tiss„ seuraavan ottelun ajan!!"
IF veikko = 1 THEN PRINT "Etel„l„ korvaa teille 10.000 pekkaa!": raha = raha + 10000: palo = palo + 90
IF sarja = 1 THEN tauti = v(u) / 2: mo = mo - 6
IF sarja = 2 THEN tauti = vd(u) / 2: mo = mo - 6
RETURN*/

const eventId = "fever";

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
        amount: 10000,
        resolved: true,
        hasInsurance
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Omituinen kuumetauti iskee joukkueeseen. Puolet pelaajista makaa petissä seuraavan ottelun ajan!`
    );

    if (data.get("insurance")) {
      t = t.push(`Etelälä korvaa ${a(data.get("amount"))} pekkaa.`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const hasInsurance = data.get("hasInsurance");
    const team = yield select(managersTeam(manager));

    yield call(
      addEffect,
      team.get("id"),
      ["strength"],
      -Math.round(team.get("strength") * 0.5),
      1
    );
    yield call(addEffect, team.get("id"), ["morale"], -6, 1);

    if (hasInsurance) {
      yield call(incrementBalance, manager, data.get("amount"));
      yield call(incrementInsuranceExtra, manager, 90);
    }
  }
};

export default event;
