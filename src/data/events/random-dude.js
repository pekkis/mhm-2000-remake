import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect, incrementStrength } from "../../sagas/team";
import { randomTeamFrom } from "../../services/selectors";
import { cinteger } from "../../services/random";

/*

sat70:
xxx = CINT(11 * RND) + 1: IF sarja = 2 AND xxx = u THEN GOTO sat70
PRINT "Divisioonasta:"
PRINT ld(xxx); " ostaa ulkolaisvahvistuksen, josta kukaan ei ole koskaan"
PRINT "kuullut puhuttavankaan! Miehen kunto on siis t„ysi arvoitus."
nnn = CINT(10 * RND) + 1
vd(xxx) = vd(xxx) + nnn
RETURN

*/

const eventId = "randomDude";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(randomTeamFrom(["division"]));
    const strengthGain = cinteger(0, 10) + 1;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        strengthGain,
        team: team.get("id"),
        teamName: team.get("name"),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Divisioonasta:

__${data.get(
        "teamName"
      )}__ ostaa ulkolaisvahvistuksen, josta kukaan ei ole koskaan kuullut puhuttavankaan! Miehen pelikunto on siis täysi arvoitus.`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const strengthGain = data.get("strengthGain");
    yield call(incrementStrength, team, strengthGain);
  }
};

export default event;
