import { Map, List } from "immutable";
import { put, select, call } from "redux-saga/effects";
import {
  managersTeamId,
  teamCompetesIn,
  flag,
  managerHasEnoughMoney,
  randomTeamFrom
} from "../../services/selectors";
import { amount as a } from "../../services/format";
import { incrementMorale, incrementStrength } from "../../sagas/team";
import { addEvent } from "../../sagas/event";
import { decrementBalance } from "../../sagas/manager";
import { setFlag } from "../../sagas/game";

const eventId = "jarko";

/*
sat12:
IF jarko = 1 THEN RETURN
IF sarja = 2 THEN RETURN
jarko = 1
x = CINT(10 * RND) + 2
PRINT "NHL on ollut liian kova pala Jarko Mantuselle. H„n haluaisi palata kotimaahan,"
PRINT "ja sinun joukkueeseesi. My”s "; l(x); " on kiinnostunut pelaajasta."
PRINT "Siirtosumma on pienehk” 200.000 pekkaa, ja pelaajan voima on 15."
PRINT "Ostatko Mantusen? (k,e)"
INPUT s$
IF raha < 200000 THEN PRINT "Rahatilanne ei anna mahdollisuutta ostaa Mantusta.": s$ = "e"
IF s$ = "k" THEN PRINT "Hienoa! Joukkueellasi on uusi maalintekij„!": raha = raha - 200000: v(u) = v(u) + 15: mo = mo + 2
IF s$ = "e" THEN PRINT "Mantunen siirtyy "; l(x); ":n.": v(x) = v(x) + 15
RETURN
*/

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;
    const jarkoFlag = yield select(flag("jarko"));
    if (jarkoFlag) {
      return;
    }

    const team = yield select(managersTeamId(manager));
    const otherTeam = yield select(randomTeamFrom("phl", false));
    const playsInPHL = yield select(teamCompetesIn(team, "phl"));
    if (!playsInPHL) {
      return;
    }
    const strength = 15;
    const amount = 200000;
    const enoughMoney = select(managerHasEnoughMoney(manager, amount));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        team,
        otherTeam: otherTeam.get("id"),
        otherTeamName: otherTeam.get("name"),
        enoughMoney,
        amount,
        strength,
        resolved: !enoughMoney,
        agree: !enoughMoney ? false : undefined
      })
    );
  },

  options: data =>
    Map({
      agree: "Ostan Mantusen joukkueeseeni",
      disagree: "En osta Mantusta joukkueeseeni"
    }),

  resolve: function*(data, value) {
    data = data.set("agree", value === "agree");

    yield put({
      type: "EVENT_RESOLVE",
      payload: {
        id: data.get("id"),
        event: data.set("resolved", true)
      }
    });
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = data.get("team");
    const otherTeam = data.get("team");
    const amount = data.get("amount");
    const strength = data.get("strength");
    const agree = data.get("agree");

    if (agree) {
      yield call(incrementStrength, team, strength);
      yield call(incrementMorale, team, amount);
      yield call(decrementBalance, manager, amount);
    } else {
      yield call(incrementStrength, otherTeam, strength);
    }

    yield call(setFlag, "jarko", true);
  }
};

/*
sat12:
IF jarko = 1 THEN RETURN
IF sarja = 2 THEN RETURN
jarko = 1
x = CINT(10 * RND) + 2
PRINT "NHL on ollut liian kova pala Jarko Mantuselle. H„n haluaisi palata kotimaahan,"
PRINT "ja sinun joukkueeseesi. My”s "; l(x); " on kiinnostunut pelaajasta."
PRINT "Siirtosumma on pienehk” 200.000 pekkaa, ja pelaajan voima on 15."
PRINT "Ostatko Mantusen? (k,e)"
INPUT s$
IF raha < 200000 THEN PRINT "Rahatilanne ei anna mahdollisuutta ostaa Mantusta.": s$ = "e"
IF s$ = "k" THEN PRINT "Hienoa! Joukkueellasi on uusi maalintekij„!": raha = raha - 200000: v(u) = v(u) + 15: mo = mo + 2
IF s$ = "e" THEN PRINT "Mantunen siirtyy "; l(x); ":n.": v(x) = v(x) + 15
RETURN
*/

const texts = data => {
  let t = List.of(
    `NHL on ollut liian kova pala Jarko Mantuselle. Hän haluaisi palata kotimaahan, ja sinun joukkueeseesi. Myös __${data.get(
      "otherTeamName"
    )}__ on kiinnostunut pelaajasta. Siirtosumma on pienehkö ${a(
      data.get("amount")
    )}, ja pelaajan voima on ${data.get("strength")}.`
  );

  if (!data.get("resolved")) {
    return t;
  }

  if (!data.get("enoughMoney")) {
    t = t.push(`Rahatilanne ei anna mahdollisuutta ostaa Mantusta.`);
  }

  if (data.get("agree")) {
    t = t.push(`Hienoa! Joukkueellasi on uusi maalintekijä!`);
  } else {
    t = t.push(`Mantusen uusi joukkue on ${data.get("otherTeamName")}.`);
  }

  return t;
};

export default event;
