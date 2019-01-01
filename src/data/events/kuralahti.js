import { Map, List } from "immutable";
import { put, select, all } from "redux-saga/effects";
import {
  playersTeamId,
  teamCompetesIn,
  playerHasService,
  teamHasActiveEffects
} from "../selectors";
import { amount as a, currency as c } from "../../services/format";
import { cinteger } from "../../services/random";

const eventId = "kuralahti";

/*
IF yk > 0 THEN RETURN
c = CINT(6 * RND) + 1
PRINT "L„het„t hy”kk„„j„ Jallu Kuralahden huumevieroitukseen"; c; "pelin ajaksi!!!"
IF veikko = 1 THEN PRINT "Vakuutusyhti” korvaa Kuralahden poissaolon 5.000 pekalla.": raha = raha + 5000: palo = palo + 60
IF sarja = 1 THEN tauti2 = 9
IF sarja = 2 THEN tauti2 = 5
yk = c
*/

const texts = data => {
  let t = List.of(
    `Lähetät raikulihyökkääjä __Jallu Kuralahden__ huumevieroitukseen ${data.get(
      "duration"
    )} pelin ajaksi.`
  );

  if (data.get("hasInsurance")) {
    t = t.push(`Vakuutusyhtiö maksaa sinulle ${c(data.get("amount"))}.`);
  }

  return t;
};

const event = {
  type: "player",

  create: function*(data) {
    const { player } = data;
    const team = yield select(playersTeamId(player));
    const hasEffects = yield select(teamHasActiveEffects(team));
    if (hasEffects) {
      return;
    }

    const hasInsurance = yield select(playerHasService(player, "insurance"));

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          player,
          duration: cinteger(1, 7),
          amount: 5000,
          hasInsurance,
          resolved: true
        })
      }
    });

    return;
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {
    const player = data.get("player");
    const team = yield select(playersTeamId(player));
    const multiplier = yield select(teamCompetesIn(team, "phl")) ? 2 : 1;

    const amount = multiplier * -5;

    yield put({
      type: "TEAM_ADD_EFFECT",
      payload: {
        team,
        effect: {
          amount,
          duration: data.get("duration"),
          parameter: ["strength"]
        }
      }
    });

    if (data.get("hasInsurance")) {
      yield put({
        type: "PLAYER_INCREMENT_BALANCE",
        payload: {
          player,
          amount: data.get("amount")
        }
      });
      yield put({
        type: "PLAYER_INCREMENT_INSURANCE_EXTRA",
        payload: {
          player,
          amount: 60
        }
      });
    }
  }
};

export default event;
