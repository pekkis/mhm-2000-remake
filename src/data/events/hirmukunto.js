import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomTeamFrom, randomManager, teamsStrength } from "../selectors";
import { cinteger } from "../../services/random";

const eventId = "hirmukunto";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["division"]));
    const duration = 1000;
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
      `Divisioonasta:

__${data.get("teamName")}__ on päättänyt manageriguru ${data.get(
        "managerName"
      )}:n johdolla nousta liigaan! He ovat _hirmukunnossa!_`
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
      Math.round(strength / 2),
      duration
    );
  }
};

/*
sat51:
y = CINT(14 * RND) + 1
x = CINT(11 * RND) + 1
xx = 45 - kr
IF sarja = 2 AND x = u THEN GOTO sat51
IF ssa(x) > 0 THEN GOTO sat51
PRINT "Divisioonasta:"
PRINT ld(x); " on p„„tt„nyt manageriguru "; lm(y); ":n johdolla"
PRINT "nousta liigaan! He ovat hirmukunnossa!"
ssa(x) = xx
tadv(x) = vd(x) / 2
RETURN
*/

export default event;
