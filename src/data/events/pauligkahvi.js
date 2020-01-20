import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent, resolvedEvent } from "../../sagas/event";
import { addOpponentEffect } from "../../sagas/team";
import { managersTeamId, managerCompetesIn } from "../../services/selectors";
import { amount as a } from "../../services/format";
import { decrementBalance, incrementBalance } from "../../sagas/manager";

/*
sat69:
IF sarja = 2 THEN RETURN
IF ky > 0 THEN RETURN
PRINT "Superpakillesi, Pauli G. Kahville, ei pikkuraha en„„ riit„. Mies"
PRINT "vaatii 100.000 korotusta ja edustusautoa."
PRINT "suostutko? (k/e)"
INPUT dd$
IF dd$ = "k" THEN raha = raha - 100000: PRINT "Pauli hymyilee muikeasti.": RETURN
IF dd$ = "e" THEN PRINT "Mies mutisee jotakin kapinasta poistuessaan luotasi.": ky = 3: tauti3 = 50
RETURN
*/

const eventId = "pauligkahvi";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    if (!competesInPHL) {
      return;
    }

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 100000,
        resolved: false,
        duration: 3
      })
    );
    return;
  },

  options: () =>
    Map({
      agree: "Suostun.",
      disagree: "En suostu."
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
      `Superpakillesi, Pauli G. Kahville, ei pikkuraha enää riitä. Mies vaatii ${data.get(
        "amount"
      )} pekan korotusta ja edustusautoa. Suostutko?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (data.get("agree")) {
      t = t.push(`Pauli hymyilee muikeasti.`);
    } else {
      t = t.push(`Mies mutisee jotakin kapinasta poistuessaan luotasi.`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    const strength = 50;
    const amount = data.get("amount");
    const duration = data.get("duration");

    if (data.get("agree")) {
      yield call(decrementBalance, manager, amount);
      yield call(addOpponentEffect, team, ["strength"], -strength, duration);
    } else {
      yield call(addOpponentEffect, team, ["strength"], strength, duration);
    }
  }
};

export default event;
