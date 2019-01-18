import { Map, List, hasIn } from "immutable";
import { put, select, all, call } from "redux-saga/effects";
import {
  managersTeamId,
  teamCompetesIn,
  managerHasService
} from "../selectors";
import { amount as a } from "../../services/format";
import { addEvent } from "../../sagas/event";
import { incrementBalance, decrementBalance } from "../../sagas/manager";
import { decrementStrength, incrementStrength } from "../../sagas/team";

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

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 75000,
        resolved: false
      })
    );
  },

  options: data => {
    return Map({
      support: `Lahjoitan miliisien virkistysrahastoon ${a(
        data.get("amount")
      )} pekkaa.`,
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
      yield call(decrementStrength, team, skillLost);

      if (data.get("hasInsurance")) {
        yield call(incrementBalance, manager, data.get("amount"));
      }
    } else {
      const skillGained = 4 * multiplier;
      yield all([
        call(incrementStrength, team, skillGained),
        call(decrementBalance, manager, data.get("amount"))
      ]);
    }
  }
};

export default event;
