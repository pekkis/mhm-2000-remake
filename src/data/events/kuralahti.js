import { Map, List } from "immutable";
import { select, call } from "redux-saga/effects";
import {
  managersTeamId,
  teamCompetesIn,
  managerHasService,
  teamHasActiveEffects
} from "../selectors";
import { currency as c } from "../../services/format";
import { cinteger } from "../../services/random";
import { addEvent } from "../../sagas/event";
import { incrementBalance, incrementInsuranceExtra } from "../../sagas/manager";
import { addEffect } from "../../sagas/team";

const eventId = "kuralahti";

/*
IF yk > 0 THEN RETURN
c = CINT(6 * RND) + 1
PRINT "L„het„t hy”kk„„j„ Jallu Kuralahden huumevieroitukseen"; c; "pelin ajaksi!!!"
IF veikko = 1 THEN PRINT "Vakuutusyhti” korvaa Kuralahden poissaolon 5.000 pekalla.": raha = raha + 5000: palo = palo + 60
IF sarja = 1 THEN tauti2 = 9
IF sarja = 2 THEN tauti2 = 5
yk = c
*/

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;
    const team = yield select(managersTeamId(manager));
    const hasEffects = yield select(teamHasActiveEffects(team));
    if (hasEffects) {
      return;
    }

    const hasInsurance = yield select(managerHasService(manager, "insurance"));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        duration: cinteger(1, 7),
        amount: 5000,
        hasInsurance,
        resolved: true
      })
    );
  },

  render: data => {
    let t = List.of(
      `Lähetät raikulihyökkääjä __Jallu Kuralahden__ huumevieroitukseen ${data.get(
        "duration"
      )} pelin ajaksi.`
    );

    if (data.get("hasInsurance")) {
      t = t.push(`Vakuutusyhtiö maksaa sinulle ${c(data.get("amount"))}.`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    const multiplier = yield select(teamCompetesIn(team, "phl")) ? 2 : 1;

    const amount = multiplier * -5;

    yield call(addEffect, team, ["strength"], amount, data.get("duration"));

    if (data.get("hasInsurance")) {
      yield call(incrementBalance, manager, data.get("amount"));
      yield call(incrementInsuranceExtra, manager, 60);
    }
  }
};

export default event;
