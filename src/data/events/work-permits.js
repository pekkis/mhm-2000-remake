import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomTeamFrom } from "../selectors";
import { cinteger } from "../../services/random";

const eventId = "workPermits";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["phl"]));
    const duration = cinteger(0, 3) + 3;

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

${data.get(
        "teamName"
      )}:lla on ongelmia ulkolaisvahvistustensa, Haso Otchakin sekä Malex Atsijevskin, työlupien kanssa. Joukkue heikentyy merkittävästi ${data.get(
        "duration"
      )} ottelun ajaksi kun kyseiset herrat eivät pelaa.`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const duration = data.get("duration");

    yield call(addEffect, team, ["strength"], -35, duration);
  }
};

/*
x = CINT(11 * RND) + 1
xx = CINT(3 * RND) + 3
IF sarja = 1 AND x = u THEN GOTO sat47
IF ass(x) > 0 THEN GOTO sat47
PRINT "Liigasta:"
PRINT l(x); ":ll„ on ongelmia ulkolaisvahvistustensa, Haso Otchakin sek„"
PRINT "Malex Atsijevskin, ty”lupien kanssa. Joukkue heikentyy merkitt„v„sti "; xx
PRINT "ottelun ajaksi kun kyseiset herrat eiv„t pelaa."
ass(x) = xx
talg(x) = -35
*/

export default event;
