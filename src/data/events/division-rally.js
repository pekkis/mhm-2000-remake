import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import {
  randomTeamFrom,
  randomManager,
  teamsStrength,
  managerCompetesIn,
  managerFlag,
  managersTeamId,
  managersDifficulty,
  managerById
} from "../selectors";
import { cinteger } from "../../services/random";
import { setFlag, setExtra } from "../../sagas/manager";
import difficultyLevels from "../../data/difficulty-levels";

/*
IF sarja = 1 THEN RETURN
IF ralli = 1 THEN RETURN
PRINT "Olet onnistunut luomaan k„sitt„m„tt”m„n yhteishengen, ja joukkue"
PRINT "on valmis taistelemaan tiens„ liigaan!!!"
extra = 10000
ralli = 1
*/

const eventId = "divisionRally";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const competesInDivision = yield select(
      managerCompetesIn(manager, "division")
    );

    if (!competesInDivision) {
      return;
    }

    const flag = yield select(managerFlag(manager, "rally"));
    if (flag) {
      return;
    }

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
    let t = List.of(
      `Olet onnistunut luomaan käsittämättömän yhteishengen, ja joukkue on valmis taistelemaan tiensä liigaan!!!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");

    const team = yield select(managersTeamId(manager));
    const duration = 1000;

    const difficulty = yield select(managersDifficulty(manager));

    yield call(setFlag, manager, "rally", true);

    yield call(
      setExtra,
      manager,
      difficultyLevels.getIn([difficulty, "rallyExtra"])("division")
    );

    yield call(
      addEffect,
      team,
      ["morale"],
      "rally",
      duration,
      Map({
        rallyMorale: difficultyLevels.getIn([difficulty, "rallyMorale"])
      })
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
