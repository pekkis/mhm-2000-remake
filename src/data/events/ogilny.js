import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomTeamFrom } from "../../services/selectors";
import { cinteger } from "../../services/random";

const eventId = "ogilny";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["phl"]));
    const duration = cinteger(0, 2) + 1;

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

Auts! ${data.get(
        "teamName"
      )}:n liukas venäläishyökkääjä Malexander Ogilny loukkaa nivusensa kun viuhuva lämäri kolahtaa sopivasti oikeaan paikkaan. Mies on poissa ${data.get(
        "duration"
      )} viikkoa.`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const duration = data.get("duration");

    yield call(addEffect, team, ["strength"], -15, duration);
  }
};

/*
sat49:
x = CINT(11 * RND) + 1
xx = CINT(2 * RND) + 1
IF sarja = 1 AND x = u THEN GOTO sat49
IF ass(x) > 0 THEN GOTO sat49
PRINT "Liigasta:"
PRINT "Auts! "; l(x); ":n liukas ven„l„ishy”kk„„j„ Malexander Ogilny loukkaa"
PRINT "nivusensa kun viuhuva l„m„ri kolahtaa sopivasti oikeaan paikkaan."
PRINT "Mies on poissa "; xx; " viikkoa."
ass(x) = xx
talg(x) = -15
RETURN
*/

export default event;
