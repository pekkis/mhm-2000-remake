import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent, resolvedEvent } from "../../sagas/event";
import { addOpponentEffect } from "../../sagas/team";
import { managersTeamId, managerCompetesIn } from "../../services/selectors";
import { amount as a } from "../../services/format";
import { decrementBalance, incrementBalance } from "../../sagas/manager";

/*
sat45:
IF ky > 0 THEN RETURN
IF sarja = 2 THEN RETURN
PRINT "NHL-seura Florida Panthersin kykyjenetsij„ ehdottaa:"
PRINT "Eestil„inen pakki Paki-Betteri Erg kiinnostaa heit„, mutta he haluavat"
PRINT "ensin n„hd„ h„nen taitonsa. Suostutko ottamaan Ergin joukkueeseen, kun"
PRINT "Panthers maksaisi joukkueellenne 6 ottelun koeajasta 150.000? (k/e)"
INPUT g$
IF g$ = "k" THEN raha = raha + 150000: ky = 6: tauti3 = -25: RETURN
IF g$ = "e" THEN PRINT "ei sitten...": RETURN
GOTO sat45*/

const eventId = "pakibetteri";

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
        amount: 150000,
        resolved: false,
        duration: 6
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
      `NHL-seura Florida Panthersin kykyjenetsijä ehdottaa: eestiläinen pakki Paki-Betteri Erg kiinnostaa heitä, mutta he haluavat ensin nähdä hänen taitonsa. Suostutko ottamaan Ergin joukkueeseen, kun Panthers maksaisi joukkueellenne ${data.get(
        "duration"
      )} ottelun koeajasta ${a(data.get("amount"))} pekkaa?
      `
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (!data.get("agree")) {
      t = t.push(`Paki-Betteri ei liity joukkueeseen.`);
    } else {
      t = t.push(
        `Paki-Betteri liittyy joukkueeseen. Hänhän tuntuisi olevan oikein jykevä peruspuolustaja!`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    const strength = -25;
    const amount = data.get("amount");
    const duration = data.get("duration");

    if (data.get("agree")) {
      yield call(incrementBalance, manager, amount);
      yield call(addOpponentEffect, team, ["strength"], strength, duration);
    }
  }
};

export default event;
