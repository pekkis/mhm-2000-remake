import { Map, List, hasIn } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect, addOpponentEffect } from "../../sagas/team";
import {
  managersTeam,
  managerCompetesIn,
  managerHasService,
  managersTeamId
} from "../../services/selectors";
import { amount as a } from "../../services/format";
import { incrementBalance, incrementInsuranceExtra } from "../../sagas/manager";

const eventId = "laskisalonen";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    const strength = competesInPHL ? -150 : -75;

    const hasInsurance = yield select(managerHasService(manager, "insurance"));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        strength,
        resolved: true,
        duration: 1,
        hasInsurance,
        amount: 35000
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Molemmat maalivahtinne ovat loukkaantuneet! Ainoa halukas tuuraaja on 300-kiloinen __Läski-Salonen__, joka kaikeksi onneksi tukkii maalin _tosi tehokkaasti_, mutta valitettavasti vain ${data.get(
        "duration"
      )} ottelun ajan!`
    );

    if (data.get("hasInsurance")) {
      t = t.push(
        `Etelälä on velvollinen maksamaan korvauksina ${a(
          data.get("amount")
        )} pekkaa!`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const strength = data.get("strength");
    const duration = data.get("duration");
    const team = yield select(managersTeamId(manager));
    const hasInsurance = data.get("hasInsurance");
    const amount = data.get("amount");

    yield call(addOpponentEffect, team, ["strength"], strength, duration);

    if (hasInsurance) {
      yield call(incrementBalance, manager, amount);
      yield call(incrementInsuranceExtra, manager, 90);
    }
  }
};

/*
sat43:
IF ky > 0 THEN RETURN
PRINT "Molemmat maalivahtinne ovat loukkaantuneet! Ainoa halukas tuuraaja on"
PRINT "300-kiloinen L„ski-Salonen, joka kaikeksi onneksi tukkii maalin TOSI tehok-"
PRINT "kaasti, mutta vain 1 ottelun ajan! "
IF veikko = 1 THEN PRINT "Etel„l„ on velvollinen maksamaan korvauksina 35.000 pekkaa!": raha = raha + 35000: palo = palo + 90
ky = 1
IF sarja = 2 THEN tauti3 = -50
IF sarja = 1 THEN tauti3 = -100
RETURN
*/

export default event;
