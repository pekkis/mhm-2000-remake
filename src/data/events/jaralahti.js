import { Map, List, hasIn } from "immutable";
import { put, select, all } from "redux-saga/effects";
import { managersTeamId, teamCompetesIn, managerHasService } from "../selectors";
import { amount as a } from "../../services/format";

const eventId = "jaralahti";

const texts = data => {
  let t = List.of(
    `Miliisi soittaa kotiisi yöllä. Tähtipuolustajasi __Kale Jaralahti__ on juuri narahtanut kaupungin keskustassa auton ratista huumepöllyssä.`
  );

  if (!data.get("resolved")) {
    return t;
  }

  if (!data.get("support")) {
    t = t.push("Pelaaja katoaa lopullisesti aamuun mennessä!");
    if (data.get("hasInsurance")) {
      t = t.push(`Vakuutusyhtiö maksaa sinulle ${a(data.get("amount"))}.`);
    }
    return t;
  }

  return t.push(
    `Rahaa kuluu, mutta pelaaja on kiitollinen. Hän parantaa tasoansa (ja lupaa pyhästi parantaa tapansa)!`
  );
};

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          manager,
          amount: 75000,
          resolved: false
        })
      }
    });

    return;
  },

  options: data => {
    return Map({
      support: `Lahjoitan miliisien virkistysrahastoon ${a(
        data.get("amount")
      )}.`,
      nothing: "Lyön luurin korvaan ja sanoudun irti koko hommasta!"
    });
  },

  resolve: function*(data, value) {
    const hasInsurance = yield select(
      managerHasService(data.get("manager"), "insurance")
    );

    data = data
      .set("resolved", true)
      .set("support", value === "support")
      .set("hasInsurance", hasInsurance);

    yield put({
      type: "EVENT_RESOLVE",
      payload: {
        id: data.get("id"),
        event: data
      }
    });
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));

    const multiplier = yield select(teamCompetesIn(team, "phl")) ? 2 : 1;
    if (!data.get("support")) {
      const skillLost = 7 * multiplier;
      yield put({
        type: "TEAM_DECREMENT_STRENGTH",
        payload: { team, amount: skillLost }
      });

      if (data.get("hasInsurance")) {
        yield put({
          type: "MANAGER_INCREMENT_BALANCE",
          payload: {
            manager,
            amount: data.get("amount")
          }
        });
      }

      return;
    } else {
      const skillGained = 4 * multiplier;
      yield all([
        put({
          type: "TEAM_INCREMENT_STRENGTH",
          payload: { team, amount: skillGained }
        }),
        put({
          type: "MANAGER_DECREMENT_BALANCE",
          payload: {
            manager: manager,
            amount: data.get("amount")
          }
        })
      ]);
    }
  }
};

export default event;
