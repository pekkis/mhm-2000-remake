import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent, resolvedEvent } from "../../sagas/event";
import { addOpponentEffect } from "../../sagas/team";
import { managersTeam } from "../selectors";
import r from "../../services/random";

const eventId = "metterer";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        strength: 30,
        resolved: false,
        duration: 3
      })
    );
    return;
  },

  options: () =>
    Map({
      agree: "Aina on tilaa yhdelle Karkukselle!",
      disagree: "Ei. Karkus pysyköön kotona."
    }),

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true,
      agree: value === "agree",
      positive: r.boolean()
    });

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `Karkus Metterer, tunnettu maalivahti, haluaisi tulla joukkueeseesi pelaamaan 3 ottelun ajaksi kun Elitserienissä peliaikaa ei siunaannu. Otatko Karkuksen mukaan?`
    );

    if (!data.get("agree")) {
      t = t.push(`Ei sitten.`);
    } else {
      t = t.push(
        `Karkus on iloinen ja kiittelee kovasti. Miehen todellinen pelikunto selvinnee lähipäivinä.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const strength = data.get("strength");
    const duration = data.get("duration");
    const positive = data.get("positive");

    const effectSize = positive ? -strength : strength;

    const team = yield select(managersTeam(manager));

    yield call(
      addOpponentEffect,
      team.get("id"),
      ["strength"],
      effectSize,
      duration
    );
  }
};

/*
/*
sat32:
IF ky > 0 THEN RETURN
PRINT "Karkus Metterer, tunnettu maalivahti, haluaisi tulla joukkueeseesi"
PRINT "pelaamaan 3 ottelun ajaksi, kun Elitserieniss„ peliaikaa ei siunaannu."
PRINT "Otatko Karkuksen mukaan? (k/e)"
INPUT karkus$
IF karkus$ = "k" THEN ky = 3: tauti3 = 30: RETURN
IF karkus$ = "e" THEN PRINT "Ei sitten!": RETURN
GOTO sat32
*/

export default event;
