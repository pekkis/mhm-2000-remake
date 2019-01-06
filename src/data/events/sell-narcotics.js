import { select, putResolve, put, call } from "redux-saga/effects";
import { Map, List } from "immutable";
import { teamCompetesIn } from "../selectors";
import r, { cinteger } from "../../services/random";
import { decrementStrength } from "../../sagas/team";
import { decrementBalance } from "../../sagas/manager";
import { amount as a } from "../../services/format";

const eventId = "sellNarcotics";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager, victim } = data;

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          manager,
          victim,
          resolved: false,
          autoResolve: true
        })
      }
    });

    return;
  },

  /*
  huume:
  raha = raha - 150000
  IF sarja = 1 THEN PRINT "Hah Hah Haa! "; l(jj); ":n t„htipelaaja j„„ kiinni ja KUOLEE yliannostukseen!"
  IF sarja = 2 THEN PRINT "Hah Hah Haa! "; ld(jj); ":n pelaaja j„„ kiinni ja KUOLEE yliannostukseen!"
  IF sarja = 1 THEN v(jj) = v(jj) - CINT(25 * RND) + 1
  IF sarja = 2 THEN vd(jj) = vd(jj) - CINT(12 * RND) + 1
  IF sarja = 1 AND 100 * RND > 70 THEN PRINT "Mutta voi! Diilerikin napataan ja joudut pulittamaan miliisille rahaa!": PRINT "He veloittavat 200000 pekkaa!": raha = raha - 200000
  IF sarja = 2 AND 100 * RND > 70 THEN PRINT "Mutta voi! Diilerikin napataan ja joudut pulittamaan miliisille rahaa!": PRINT "He veloittavat 60000 pekkaa!": raha = raha - 60000
  INPUT yucca$
  proz = proz + 1
  */

  resolve: function*(data) {
    const victimTeam = yield select(state =>
      state.game.getIn(["teams", data.get("victim")])
    );

    const victimPlaysInPHL = yield select(teamCompetesIn(data.get("victim")));

    const skillLost = victimPlaysInPHL
      ? cinteger(0, 25) + 1
      : cinteger(0, 12) + 1;
    const fine = victimPlaysInPHL ? 200000 : 60000;

    data = data.merge({
      skillLost,
      fine,
      victimTeamName: victimTeam.get("name"),
      caught: r.bool(0.7),
      resolved: true
    });

    yield putResolve({
      type: "EVENT_RESOLVE",
      payload: {
        id: data.get("id"),
        event: data
      }
    });
  },

  render: data => {
    let text = List.of(
      `Voi ei! __${data.get(
        "victimTeamName"
      )}__ on kohdannut suuren tragedian. Joukkueen tähtipelaaja on löytynyt kotoaan kuolleena. Miliisi ei tiedota tapahtumista, mutta huhut väittävät syyksi tuntemattoman muuntohuumeen yliannostusta.`
    );

    if (data.get("caught")) {
      text = text.push(
        `Vaikka miliisi ei julkisesti tapahtumista puhukaan, sinulle he kyllä soittavat. On tapahtunut "pikku kämmi", ja tarvitaan lisävoitelua. Joudut pulittamaan ylimääräiset __${a(
          data.get("fine")
        )}__ pekkaa. Ystäväsi Jaarnio pahoittelee suuresti.`
      );
    }

    return text;
  },

  process: function*(data) {
    yield call(decrementStrength, data.get("victim"), data.get("skillLost"));

    if (data.get("caught")) {
      yield call(decrementBalance, data.get("manager"), data.get("fine"));
    }
  }
};

export default event;
