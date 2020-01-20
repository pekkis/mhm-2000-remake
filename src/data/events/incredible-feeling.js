import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomTeamFrom, randomManager } from "../../services/selectors";

/*
xx = 1000
IF cccp = 20 THEN RETURN
cc = CINT(11 * RND) + 1
ccc = CINT(14 * RND) + 1
IF cc = u AND sarja = 1 THEN cccp = cccp + 1: GOTO sat94
IF v(cc) > 200 THEN cccp = cccp + 1: GOTO sat94
IF ass(cc) > 0 THEN cccp = cccp + 1: GOTO sat94
PRINT "Kovin nimet”n "; l(cc); "on saanut uskomattoman fiiliksen p„„lle!"
PRINT "Kaikki pelaavat vain joukkueen menestyksen eteen, ja manageri"
PRINT lm(ccc); " lupaa pelaajiensa jaksavan koko pitk„n kauden loppuun!"
ass(cc) = xx
talg(cc) = 50

*/

const eventId = "incredibleFeeling";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(
      randomTeamFrom(["phl"], false, [], t => t.get("strength") < 200)
    );
    if (!team) {
      return;
    }

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
      `Kovin nimetön __${data.get(
        "teamName"
      )}__ on saanut uskomattoman fiiliksen päälle! Kaikki pelaavat vain joukkueen menestyksen eteen, ja manageri __${data.get(
        "managerName"
      )}__ lupaa pelaajiensa jaksavan koko pitkän kauden loppuun!`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const duration = data.get("duration");
    yield call(addEffect, team, ["strength"], 50, duration);
  }
};

export default event;
