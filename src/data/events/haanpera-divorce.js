import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementStrength } from "../../sagas/team";
import { managersTeam, flag, managerCompetesIn } from "../selectors";
import { setFlag } from "../../sagas/game";

/*
IF ero = 1 THEN RETURN
PRINT "Aki Haanper„n avioliitto p„„ttyy eroon! Mies on onnellinen kun p„„see"
PRINT "eroon vaimostaan ja parantaa otteitaan!"
IF sarja = 1 THEN v(u) = v(u) + 8
IF sarja = 2 THEN vd(u) = vd(u) + 4
ero = 1
*/

const eventId = "haanperaDivorce";

const event = {
  type: "manager",

  create: function*(data) {
    const isMarried = yield select(flag("haanperaMarried"));
    if (!isMarried) {
      return;
    }

    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    const t = List.of(
      `Pelaaja Aki Haanperän avioliitto p„„ttyy eroon! Mies on onnellinen kun pääsee eroon nalkuttavasta vaimosta ja parantaa otteitaan!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeam(manager));

    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    const skillGain = competesInPHL ? 8 : 4;

    yield call(incrementStrength, team.get("id"), skillGain);
    yield call(setFlag, "haanperaMarried", false);
  }
};

export default event;
