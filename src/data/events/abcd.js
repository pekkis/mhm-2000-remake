import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomTeamFrom, randomManager, teamsStrength } from "../../services/selectors";
import { cinteger } from "../../services/random";

const eventId = "abcd";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["phl"]));
    const duration = cinteger(0, 6) + 3;
    const random = yield select(randomManager());

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        duration,
        team: team.get("id"),
        teamName: team.get("name"),
        managerName: random.get("name"),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Liigasta:

Managerivelho ${data.get("managerName")} on saanut psyykattua ${data.get(
        "teamName"
      )}:n käsittämättömään vireeseen! Hänen nk. "ABCD-ohjelmansa" puree!`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const duration = data.get("duration");

    const strength = yield select(teamsStrength(team));

    yield call(
      addEffect,
      team,
      ["strength"],
      Math.round(strength / 4),
      duration
    );
  }
};

/*
y = CINT(14 * RND) + 1
x = CINT(11 * RND) + 1
xx = CINT(6 * RND) + 3
IF sarja = 1 AND x = u THEN GOTO sat50
IF ass(x) > 0 THEN GOTO sat50
PRINT "Liigasta:"
PRINT "Managerivelho "; lm(y); " on saanut psyykattua "; l(x); ":n"
PRINT "k„sitt„m„tt”m„„n vireeseen! H„nen ns. 'ABCD'- ohjelmansa puree!"
ass(x) = xx
talg(x) = CINT(v(x) / 4)*/

export default event;
