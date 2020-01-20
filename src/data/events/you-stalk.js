import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomTeamFrom, randomManager } from "../../services/selectors";
import { cinteger } from "../../services/random";

/*
sat60:
x = CINT(11 * RND) + 1
xx = 5
IF sarja = 1 AND x = u THEN GOTO sat60
IF ass(x) > 0 THEN GOTO sat60
PRINT "Liigasta:"
PRINT lm(x); " valmentaa joukkuetta "; l(x); ". SINŽ kytt„„t lehtien mukaan h„nen paikkaansa,"
PRINT "ja "; l(x); ":n pakka menee t„ydellisesti sekaisin!"
ass(x) = xx
talg(x) = -15
RETURN*/

const eventId = "youStalk";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["phl"], false, []));
    const duration = 5;
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

__${data.get("managerName")}__ valmentaa joukkuetta __${data.get(
        "teamName"
      )}__. Sinä kyttäät lehtien mukaan hänen paikkaansa, ja joukkue-paran pakka menee hetkeksi hiukan sekaisin!`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const duration = data.get("duration");
    yield call(addEffect, team, ["strength"], -15, duration);
  }
};

export default event;
