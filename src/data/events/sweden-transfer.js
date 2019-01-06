import { Map, List } from "immutable";
import { put, select, call } from "redux-saga/effects";
import {
  managersTeamId,
  teamCompetesIn,
  managerHasService
} from "../selectors";
import { amount as a } from "../../services/format";
import { incrementMorale } from "../../sagas/team";
import { addEvent } from "../../sagas/event";
import { incrementBalance, incrementInsuranceExtra } from "../../sagas/manager";
import { decrementStrength } from "../../sagas/team";

const eventId = "swedenTransfer";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;
    const team = yield select(managersTeamId(manager));

    const playsInPHL = yield select(teamCompetesIn(team, "phl"));
    const moraleBoost = playsInPHL ? -2 : 2;
    const strengthLoss = playsInPHL ? 12 : 7;

    const hasInsurance = yield select(managerHasService(manager, "insurance"));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        team,
        amount: 30000,
        hasInsurance,
        moraleBoost,
        strengthLoss,
        resolved: true
      })
    );
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = data.get("team");
    const amount = data.get("amount");
    const strengthLoss = data.get("strengthLoss");
    const hasInsurance = data.get("hasInsurance");
    const moraleBoost = data.get("moraleBoost");

    yield call(decrementStrength, team, strengthLoss);
    yield call(incrementMorale, team, moraleBoost);
    yield call(incrementBalance, manager, amount);

    if (hasInsurance) {
      yield call(incrementBalance, manager, amount / 2);
      yield call(incrementInsuranceExtra, manager, 100);
    }
  }
};

/*
sat11:
PRINT "Joukkueen nuori, lupaava taituri siirtyy Ruotsiin kesken kauden. Nyyh!"
PRINT "Ruotsalaiset korvaavat menetyksen 30000 pekalla!"
IF veikko = 1 THEN PRINT "Etel„l„lt„ saat lis„ksi 17.000 pekkaa!": raha = raha + 17000: palo = palo + 100
IF sarja = 1 THEN raha = raha + 30000: v(u) = v(u) - 12: mo = mo - 2
IF sarja = 2 THEN raha = raha + 30000: vd(u) = vd(u) - 7: mo = mo + 2
*/

const texts = data => {
  let t = List.of(
    `Joukkueen nuori, lupaava taituri siirtyy Ruotsiin kesken kauden. Nyyh! Ruotsalaiset korvaavat menetyksen ${a(
      data.get("amount")
    )} pekalla!`
  );

  if (data.get("hasInsurance")) {
    t = t.push(`Etelälältä saat lisäksi ${a(data.get("amount"))} pekkaa.`);
  }

  return t;
};

export default event;
