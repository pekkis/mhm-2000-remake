import { Map, List } from "immutable";
import { select, call, all } from "redux-saga/effects";
import { randomTeamFrom, randomManager, managersTeamId } from "../selectors";
import { addEvent, resolvedEvent } from "../../sagas/event";
import {
  hireManager,
  setInsuranceExtra,
  setBalance,
  setArenaLevel,
  setService
} from "../../sagas/manager";
import { setMorale, setReadiness, setStrategy } from "../../sagas/team";
import table from "../../services/league";
import { cinteger } from "../../services/random";

/*
x = CINT(11 * RND) + 1
y = CINT(14 * RND) + 1
h = CINT(3 * RND)
IF sarja = 1 AND x = u THEN GOTO sat21
IF x = edus1 OR x = edus2 OR x = edus3 THEN GOTO sat21
satt21:
PRINT l(x); " tarjoaa sinulle ty”paikkaa!!"
PRINT "Joukkueen sijoitus liigassa: "; s(x)
PRINT "Otatko tarjouksen vastaan? (k/e)"
INPUT s$
IF s$ = "e" THEN PRINT "OK, ei sitten. Ty”h”n palkataan "; lm(y): RETURN
IF s$ = "k" THEN hallis: sarja = 1: u = x: raha = 700000: hjalli = 3 + h: pt = 0: pv = 0: mo = 0: tre = 0: jursi = 0: allgo = 0: ralli = 0: molce = 0: cheer = 0: veikko = 0: mikki = 0: palo = 0: euro = 0: RETURN
GOTO satt21
*/

const eventId = "jobofferPHL";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const oldTeam = yield select(managersTeamId(manager));

    const ehlTeams = yield select(state =>
      state.game.getIn(["competitions", "ehl", "teams"])
    );
    const offerer = yield select(randomTeamFrom(["phl"], false, ehlTeams));

    const group = yield select(state =>
      state.game.getIn(["competitions", "phl", "phases", 0, "groups", 0])
    );

    const ranking =
      table(group).findIndex(t => t.get("id") === offerer.get("id")) + 1;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        oldTeam,
        offerer: offerer.get("id"),
        offererName: offerer.get("name"),
        ranking
      })
    );
  },

  options: data => {
    return Map({
      agree: `Kyllä, ilman muuta!`,
      disagree: "Ei, kiitos."
    });
  },

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true,
      agree: value === "agree"
    });

    if (value === "agree") {
    } else {
      const otherManager = yield select(randomManager());
      data = data.merge({
        otherManager: otherManager.get("name")
      });
    }

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `__${data.get(
        "offererName"
      )}__ tarjoaa sinulle työpaikkaa. Joukkueen sijoitus liigassa: _${data.get(
        "ranking"
      )}_. Otatko tarjouksen vastaan?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (data.get("agree")) {
      t = t.push(
        `Suloinen haikeus valtaa mielesi kun pakkaat kamojasi, mutta ei pitkäksi aikaa. Maisemanvaihto tekee sinulle hyvää.`
      );
    } else {
      t = t.push(
        `Ei sitten. Tehtävään palkataan __${data.get("otherManager")}__.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const offerer = data.get("offerer");
    const oldTeam = data.get("oldTeam");

    if (data.get("agree")) {
      yield all([
        call(hireManager, manager, offerer),
        call(setBalance, manager, 700000),
        ...["coach", "cheer", "insurance", "microphone"].map(s =>
          call(setService, manager, s, false)
        ),
        call(setArenaLevel, manager, 3 + cinteger(0, 3)),
        call(setInsuranceExtra, manager, 0),

        call(setMorale, oldTeam, 0),
        call(setStrategy, oldTeam, 2),
        call(setReadiness, oldTeam, 0)
      ]);
    }
  }
};

export default event;
