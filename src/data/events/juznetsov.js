import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import {
  decrementBalance,
  incrementInsuranceExtra,
  incrementBalance
} from "../../sagas/manager";
import { decrementMorale, addOpponentEffect } from "../../sagas/team";
import { amount as a } from "../../services/format";
import { addEffect } from "../../sagas/team";
import {
  managersTeam,
  managerHasService,
  managerCompetesIn,
  managersTeamId
} from "../../services/selectors";
import { cinteger } from "../../services/random";

const eventId = "juznetsov";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const hasInsurance = yield select(managerHasService(manager, "insurance"));
    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        effect: competesInPHL ? 20 : 10,
        amount: 7000,
        duration: cinteger(0, 3) + 2,
        resolved: true,
        hasInsurance
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Auts! Venäläispakki Kuri Juznetsov törmää harjoituksissa pää edellä laitaan ja on seuraavat ${data.get(
        "duration"
      )} ottelua pyörällä päästään!`
    );

    if (data.get("hasInsurance")) {
      t = t.push(`Etelälä joutuu maksamaan ${data.get("amount")} pekkaa!`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const hasInsurance = data.get("hasInsurance");
    const effect = data.get("effect");
    const team = yield select(managersTeamId(manager));
    const amount = data.get("amount");

    yield call(addOpponentEffect, team, ["strength"], effect, 5);

    if (hasInsurance) {
      yield call(incrementBalance, manager, amount);
      yield call(incrementInsuranceExtra, manager, 50);
    }
  }
};

/*
sat46:
IF ky > 0 THEN RETURN
c = CINT(3 * RND) + 2
PRINT "Auts! Ven„l„ispakki Kuri Juznetsov t”rm„„ harjoituksissa p„„ edell„ laitaan"
PRINT "ja on seuraavat "; c; " ottelua py”r„ll„ p„„st„„n!"
IF veikko = 1 THEN PRINT "Etel„l„ joutuu maksamaan 7.000 pekkaa!!": raha = raha + 7000: palo = palo + 50
ky = c
IF sarja = 1 THEN tauti3 = 20
IF sarja = 2 THEN tauti3 = 10
RETURN
*/

export default event;
