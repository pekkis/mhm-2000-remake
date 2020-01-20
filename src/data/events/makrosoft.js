import { Map, List } from "immutable";
import { select, put, call, all } from "redux-saga/effects";
import {
  managersTeam,
  managersDifficulty,
  randomManager,
  managerCompetesIn,
  randomTeamFrom
} from "../../services/selectors";
import { addEvent } from "../../sagas/event";
import { decrementStrength } from "../../sagas/team";

const eventId = "makrosoft";

/*
sat41:
y = CINT(14 * RND) + 1
f = CINT(14 * RND) + 1
IF y = f THEN GOTO sat41
x = CINT(11 * RND) + 1
IF sarja = 1 AND x = u THEN GOTO sat41
PRINT l(x); ":n sponsori MAKROSOFT on mennyt konkurssiin. Velkojat ovat "
PRINT "joukkueen kimpussa, ja syntipukiksi leimataan manageri "; lm(y); "."
PRINT "H„n saa potkut, ja tilalle palkataan "; lm(f); "."
PRINT "Palkanmaksu viiv„styy, ja muutama joukkueen pelaaja siirtyy ulkomaille."
v(x) = v(x) - 20
RETURN
*/

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const oldManager = yield select(randomManager());
    const newManager = yield select(randomManager([oldManager.get("id")]));

    const team = yield select(randomTeamFrom(["phl"]));

    yield call(
      addEvent,
      Map({
        manager,
        eventId,
        oldManager: oldManager.get("name"),
        newManager: newManager.get("name"),
        team: team.get("id"),
        teamName: team.get("name"),
        strengthLoss: 20,
        resolved: true
      })
    );
  },

  render: data => {
    let text = List.of(
      `${data.get(
        "teamName"
      )}:n sponsori __Makrosoft__ on mennyt konkurssiin. Velkojat ovat joukkueen kimpussa, ja syntipukiksi leimataan manageri ${data.get(
        "oldManager"
      )}. Hän saa potkut, ja tilalle palkataan ${data.get("newManager")}.

Palkanmaksu viivästyy, ja muutama joukkueen pelaaja siirtyy ulkomaille.`
    );
    return text;
  },

  process: function*(data) {
    const team = data.get("team");
    const strengthLoss = data.get("strengthLoss");
    yield call(decrementStrength, team, strengthLoss);
  }
};

export default event;
