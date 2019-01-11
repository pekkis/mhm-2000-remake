import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect, decrementStrength } from "../../sagas/team";
import { randomTeamFrom, randomManager, teamsStrength } from "../selectors";

/*
sat58:
x = CINT(11 * RND) + 1
xx = 1000
IF sarja = 1 AND x = u THEN GOTO sat57
IF ass(x) > 0 THEN GOTO sat57
PRINT "Liigasta:"
PRINT l(x); " on joutunut kauhean tapaturman uhriksi."
PRINT "Heid„n tshekkivahvistuksensa Oreslav Jatovrel on t”rm„nnyt"
PRINT "laitaan kohtalokkain seurauksin. Koko joukkue on shokissa!"
PRINT "Kaikki toivovat tiukennusta s„„nt”ihin, ja liigan johto my”s lupaa niit„."
v(x) = v(x) - 14
ass(x) = xx
talg(x) = CINT(-(.33 * v(x)))
RETURN
*/

const eventId = "jatovrel";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["phl"], false, []));
    const duration = 1000;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        duration,
        team: team.get("id"),
        teamName: team.get("name"),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Liigasta:

__${data.get(
        "teamName"
      )}__ on joutunut kauhean tapaturman uhriksi. Heidän tshekkivahvistuksensa __Oreslav Jatovrel__ on törmännyt laitaan kohtalokkain seurauksin. Jatovrelin ura on paketissa, ja joukkue shokissa!

Kaikki toivovat tiukennusta sääntöihin, ja liigan johto myös lupaa niitä. _toim. huom. Jaroslav Otevrel never forget 2019_`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const duration = data.get("duration");
    const strength = yield select(teamsStrength(team));
    yield call(decrementStrength, team, 14);
    yield call(
      addEffect,
      team,
      ["strength"],
      Math.round(-0.33 * strength),
      duration
    );
  }
};

export default event;
