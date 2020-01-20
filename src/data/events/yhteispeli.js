import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomTeamFrom, randomManager } from "../../services/selectors";
import { cinteger } from "../../services/random";

const eventId = "yhteispeli";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(
      randomTeamFrom(["division"], false, [], t => t.get("strength") > 120)
    );
    if (!team) {
      return;
    }

    const duration = cinteger(0, 10) + 7;
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

Manageri ${data.get("managerName")}:lla on käsissään huippujoukkue __${data.get(
        "teamName"
      )}__. Taitavista yksilöistä koostuvalla joukkueella on kuitenkin tällä hetkellä suuria ongelmia yhteispelinsä kanssa.`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const duration = data.get("duration");
    yield call(addEffect, team, ["strength"], -30, duration);
  }
};

/*
sat56:
FOR x = 1 TO 12
IF sarja = 2 AND x = u THEN x = x + 1
IF vd(x) > 120 THEN GOTO satt56
NEXT x
RETURN
satt56:
y = CINT(14 * RND) + 1
xx = CINT(10 * RND) + 7
IF ssa(x) > 0 THEN GOTO sat56
PRINT "Divisioonasta:"
PRINT "Manageri "; lm(y); ":ll„ on k„siss„„n huippujoukkue "; ld(x)
PRINT "Taitavista yksil”ist„ koostuvalla joukkueella on kuitenkin"
PRINT "t„ll„ hetkell„ suuria ongelmia yhteispelins„ kanssa."
ssa(x) = xx
tadv(x) = -30
RETURN
*/

export default event;
