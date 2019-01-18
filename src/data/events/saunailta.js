import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect, decrementMorale } from "../../sagas/team";
import { managersTeam, managersMainCompetition } from "../selectors";
import { cinteger } from "../../services/random";

/*
sat63:
IF yk > 0 THEN RETURN
xxx = CINT(2 * RND) + 2
PRINT "Rento saunailta muuttuu katastrofiksi, kun ajaudutte joukkueenjohtajan"
PRINT "kanssa k„sirysyyn pelillisten erimielisyyksien vuoksi."
PRINT "Mies saa luonnollisesti potkut, ja uutta pelinjohtajaa etsit„„n."
PRINT "Moraali laskee, ja joukkueen peli menee v„h„ksi aikaa sekaisin."
yk = xxx
tauti2 = 40 - 10 * sarja
RETURN
*/

const eventId = "saunailta";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const duration = cinteger(0, 2) + 2;
    const mainCompetition = yield select(managersMainCompetition(manager));

    const effect = mainCompetition === "phl" ? -30 : -20;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        effect,
        duration,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Rento saunailta muuttuu katastrofiksi, kun ajaudutte joukkueenjohtajan kanssa käsirysyyn pelillisten erimielisyyksien vuoksi.

Mies saa luonnollisesti potkut, ja uutta joukkueenohtajaa etsitään. Moraali laskee, ja joukkueen peli menee vähäksi aikaa sekaisin.`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeam(manager));
    const duration = data.get("duration");
    const effect = data.get("effect");

    yield call(decrementMorale, team.get("id"), 5);
    yield call(addEffect, team.get("id"), ["strength"], effect, duration);
  }
};

export default event;
