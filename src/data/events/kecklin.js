import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent, resolvedEvent } from "../../sagas/event";
import { addOpponentEffect } from "../../sagas/team";
import { managersTeamId } from "../selectors";
import { amount as a } from "../../services/format";
import { decrementBalance } from "../../sagas/manager";

/*
sat44
IF ky > 0 THEN RETURN
PRINT "Ykk”smaalivahtinne Limmo Kecklin haluaa 150.000 pekan palkankorotuksen!"
PRINT "Suostutko? (k/e)"
INPUT mo$
IF mo$ = "k" THEN raha = raha - 150000: PRINT "Mies on tyytyv„inen.": RETURN
IF mo$ = "e" THEN ky = 1: tauti3 = 65: PRINT "Kecklin sanoo: 'No, ainahan kannatti yritt„„...": RETURN
GOTO sat44
*/

const eventId = "kecklin";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 150000,
        resolved: false,
        duration: 3
      })
    );
    return;
  },

  options: () =>
    Map({
      agree: "Suostun, mutta vain pakon edessä.",
      disagree: "Ei tule kuulonkaan."
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
      `Ykkösmaalivahtinne Limmo Kecklin haluaa ${a(
        data.get("amount")
      )} pekan palkankorotuksen. Suostutko?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (!data.get("agree")) {
      t = t.push(
        `Kecklin kohauttaa olkapäitään. "No, aina kannattaa yrittää."`
      );
    } else {
      t = t.push(`Kecklin on oikein tyytyväinen itseensä poistuessaan.`);
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    const strength = data.get("agree") ? -65 : 65;
    const amount = data.get("amount");

    if (data.get("agree")) {
      yield call(decrementBalance, manager, amount);
    }

    yield call(addOpponentEffect, team, ["strength"], strength, 1);
  }
};

export default event;
