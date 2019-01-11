import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { decrementStrength } from "../../sagas/team";
import { randomTeamFrom } from "../selectors";

/*
sat66:
xxx = CINT(11 * RND) + 1
IF xxx = u AND sarja = 1 THEN GOTO sat66
PRINT "Liigasta:"
PRINT l(xxx); " on kokenut suuren menetyksen! Heid„n lupaava, nuori"
PRINT "sentterins„ lopettaa j„„kiekkouransa floristi-opintojensa takia!"
v(xxx) = v(xxx) - 13
RETURN
*/

const eventId = "florist";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["phl"], false, []));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
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
      )}__ on kokenut suuren menetyksen! Heidän lupaava, nuori sentterinsä lopettaa jääkiekkouransa floristi-opintojen takia!`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    yield call(decrementStrength, team, 13);
  }
};

export default event;
