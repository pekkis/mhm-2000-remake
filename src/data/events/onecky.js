import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomManager, randomTeamFrom } from "../selectors";

/*
sat71:
x = CINT(11 * RND) + 1
IF x = u AND sarja = 1 THEN GOTO sat71
PRINT l(x); " p„„see otsikoihin, kun joukkueessa pelaava Jatakar Onecky,"
PRINT "liigan suurin sika, yritt„„ potkaista vastustajaansa luistimella naamaan."
PRINT "Tuomari seisoo vieress„, mutta Oneckyn vaikutusvaltainen tukija, manageri X"
PRINT "hoitaa asian siten, ett„ Onecky selvi„„ ilman seuraamuksia."
RETURN
*/

const eventId = "onecky";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["phl"]));
    const random = yield select(randomManager());

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        team: team.get("id"),
        teamName: team.get("name"),
        otherManager: random.get("name"),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `__${data.get(
        "teamName"
      )}__ pääsee otsikoihin, kun joukkueessa pelaava __Jatakar Onecky__, liigan suurin sika, yrittää potkaista vastustajaansa luistimella naamaan.

Tuomari seisoo vieressä, mutta Oneckyn vaikutusvaltainen tukija, manageri ${data.get(
        "otherManager"
      )}, hoitaa asian siten, että Onecky selviää ilman seuraamuksia."`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    yield call(addEffect, team, ["morale"], -5, 3);
  }
};

export default event;
