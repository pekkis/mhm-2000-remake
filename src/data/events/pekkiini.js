import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { managersDifficulty, managersTeam } from "../../services/selectors";
import { addEffect } from "../../sagas/team";

/*
IF yk > 0 THEN RETURN
ccc = 8 - vai
c = CINT(ccc * RND) + 1
PRINT "On l”ytynyt uusi piriste, PEKKIINI, jota ei ole viel„ ehditty kielt„„."
PRINT "Laki aineen kiellosta astuu kuitenkin voimaan "; c; " viikon kuluttua,"
PRINT "ja tohtorinne pumppaa pelaajat t„yteen huumetta niin pitk„ksi aikaa kuin"
PRINT "mahdollista!"
yk = c
IF sarja = 1 THEN tauti2 = (v(u) / 2) * -1
IF sarja = 2 THEN tauti2 = (vd(u) / 2) * -1
RETURN*/

const eventId = "pekkiini";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));

    const team = yield select(managersTeam(manager));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: Math.round(team.get("strength") * 0.5),
        duration: 7 - difficulty,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `On löytynyt uusi piriste, __pekkiini__, jota ei ole vielä ehditty kieltämään. Laki aineen kiellosta astuu valitettavasti voimaan jo _${data.get(
        "duration"
      )} viikon kuluttua_, mutta tohtorinne pumppaa pelaajat täyteen tehoainetta niin pitkäksi aikaa kuin mahdollista!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const amount = data.get("amount");
    const duration = data.get("duration");
    const team = yield select(managersTeam(manager));

    yield call(addEffect, team.get("id"), ["strength"], amount, duration);
  }
};

export default event;
