import { Map, List } from "immutable";
import { put, select, call } from "redux-saga/effects";
import {
  managersTeamId,
  teamCompetesIn,
  managerHasService,
  teamHasActiveEffects
} from "../selectors";
import { amount as a, currency as c } from "../../services/format";
import { cinteger } from "../../services/random";
import { addEvent } from "../../sagas/event";

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
  type: "manager",

  create: function*(data) {
    const { manager } = data;
    const team = yield select(managersTeamId(manager));
    const hasEffects = yield select(teamHasActiveEffects(team));
    if (hasEffects) {
      return;
    }

    const hasInsurance = yield select(managerHasService(manager, "insurance"));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        duration: cinteger(1, 7),
        amount: 5000,
        hasInsurance,
        resolved: true
      })
    );
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
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
        type: "MANAGER_INCREMENT_BALANCE",
        payload: {
          manager,
          amount: data.get("amount")
        }
      });
      yield put({
        type: "MANAGER_INCREMENT_INSURANCE_EXTRA",
        payload: {
          manager,
          amount: 60
        }
      });
    }
  }
};

export default event;
