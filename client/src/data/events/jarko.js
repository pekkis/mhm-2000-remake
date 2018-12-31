import { Map, List } from "immutable";
import { put, select } from "redux-saga/effects";
import {
  playersTeamId,
  teamCompetesIn,
  playerHasService,
  flag,
  playerHasEnoughMoney,
  randomTeamFrom
} from "../selectors";
import { amount as a } from "../../services/format";

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
  type: "player",

  create: function*(data) {
    const { player } = data;
    const jarkoFlag = yield select(flag("jarko"));
    if (jarkoFlag) {
      return;
    }

    const team = yield select(playersTeamId(player));
    const otherTeam = yield select(randomTeamFrom("phl", false));
    const playsInPHL = yield select(teamCompetesIn(team, "phl"));
    if (!playsInPHL) {
      return;
    }
    const strength = 15;
    const amount = 200000;
    const enoughMoney = select(playerHasEnoughMoney(player, amount));

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          player,
          team,
          otherTeam: otherTeam.get("id"),
          otherTeamName: otherTeam.get("name"),
          enoughMoney,
          amount,
          strength,
          resolved: !enoughMoney,
          agree: !enoughMoney ? false : undefined
        })
      }
    });

    return;
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
    const player = data.get("player");
    const team = data.get("team");
    const otherTeam = data.get("team");
    const amount = data.get("amount");
    const strength = data.get("strength");
    const agree = data.get("agree");

    if (agree) {
      yield put({
        type: "TEAM_INCREMENT_STRENGTH",
        payload: {
          team,
          amount: strength
        }
      });
      yield put({
        type: "TEAM_INCREMENT_MORALE",
        payload: {
          team,
          amount: 2
        }
      });
      yield put({
        type: "PLAYER_DECREMENT_BALANCE",
        payload: {
          player,
          amount
        }
      });
    } else {
      yield put({
        type: "TEAM_INCREMENT_STRENGTH",
        payload: {
          team: otherTeam,
          amount: strength
        }
      });
    }

    yield put({
      type: "GAME_SET_FLAG",
      payload: {
        flag: "jarko",
        value: true
      }
    });
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
