import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { randomTeamFrom, randomManager } from "../selectors";

/*
sat93:
xx = 1000
bb1 = CINT(14 * RND) + 1
bb2 = CINT(14 * RND) + 1
IF bb1 = bb2 THEN GOTO sat93
satt93:
IF cccp = 20 THEN RETURN
cc = CINT(11 * RND) + 1
IF sarja = 1 AND cc = u THEN cccp = cccp + 1: GOTO satt93
IF v(cc) < 270 THEN cccp = cccp + 1: GOTO satt93
IF ass(x) > 0 THEN cccp = cccp + 1: GOTO satt93
PRINT l(cc); ":n huippujoukkue on t”rm„nnyt pelaajapolitiikallaan j„„vuoreen!"
PRINT "T„hti„ vilisev„ mestariehdokas on muuttunut riitaisaksi muukalaislegioo-"
PRINT "naksi jossa kaikki vihaavat kaikkia!"
PRINT "Manageri "; lm(bb1); " saa l„hte„, tilalle palkataan "; lm(bb2)
PRINT "mutta tilanne ei oletettavasti muutu mihink„„n..."
ass(cc) = xx
talg(cc) = -60
RETURN
*/

const eventId = "foreignLegion";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(
      randomTeamFrom(["phl"], false, [], t => t.get("strength") >= 270)
    );
    if (!team) {
      return;
    }

    const duration = 1000;
    const random = yield select(randomManager());
    const random2 = yield select(randomManager([random.get("id")]));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        duration,
        team: team.get("id"),
        teamName: team.get("name"),
        managerName: random.get("name"),
        managerName2: random2.get("name"),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Liigan huippujoukkue __${data.get(
        "teamName"
      )}__ on törmännyt pelaajapolitiikallaan jäävuoreen! Tähtiä vilisevä mestariehdokas on muuttunut riitaisaksi muukalaislegioonaksi, jossa kaikki vihaavat kaikkia!

Manageri __${data.get(
        "managerName"
      )}__ saa lähteä. Tilalle palkataan __${data.get(
        "managerName2"
      )}__, mutta tilanne ei oletettavasti muutu mihinkään...`
    );

    return t;
  },

  process: function*(data) {
    const team = data.get("team");
    const duration = data.get("duration");
    yield call(addEffect, team, ["strength"], -60, duration);
  }
};

export default event;
