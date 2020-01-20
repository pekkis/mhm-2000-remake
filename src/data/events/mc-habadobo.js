import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementMorale } from "../../sagas/team";
import {
  managersTeamId,
  managersMainCompetition,
  managersDifficulty,
  managersTeam,
  managerHasService,
  managersArena
} from "../../services/selectors";
import { amount as a } from "../../services/format";
import {
  decrementBalance,
  incrementBalance,
  incrementInsuranceExtra
} from "../../sagas/manager";

/*
sat72:
IF sarja = 2 THEN RETURN
IF v(u) < 250 THEN RETURN
IF vai < 4 THEN RETURN
PRINT "Joukkueen fanikaupan vieress„ sijaitsevaan MC Habadobon is„nn”im„„n"
PRINT "kapakkaan suunnattu sinkoisku osuu harhaan!! Lukematon m„„r„ fani-"
PRINT "tuotteita ja muuta s„l„„ tuhoutuu ja lasku kohoaa 650.000 pekkaan!!"
raha = raha - 650000
IF veikko = 1 THEN PRINT "Etel„l„ maksaa laskusta 532.300.": raha = raha + 532300: palo = palo + 40 * hjalli
RETURN
*/

const eventId = "mcHabadobo";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));
    if (difficulty < 3) {
      return;
    }

    const mainCompetition = yield select(managersMainCompetition(manager));
    if (mainCompetition !== "phl") {
      return;
    }

    const team = yield select(managersTeam(manager));

    if (team.get("strength") < 250) {
      return;
    }

    const hasInsurance = yield select(managerHasService(manager, "insurance"));

    const amount = 650000;
    const insuranceClaim = Math.round(0.8 * amount);

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        hasInsurance,
        amount,
        insuranceClaim,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Joukkueen fanikaupan vieressä sijaitsevaan moottoripyöräkerho __MC Habadobon__ isännöimään kapakkaan suunnattu leikkimielinen sinkoisku osuu harhaan!

Lukematon määrä fanituotteita ja muuta krääsää tuhoutuu. Lasku kohoaa ${a(
        data.get("amount")
      )} pekkaan!`
    );

    if (data.get("hasInsurance")) {
      t = t.push(
        `Etelälä maksaa laskusta ${a(data.get("insuranceClaim"))} pekkaa.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const amount = data.get("amount");
    const hasInsurance = data.get("hasInsurance");
    const insuranceClaim = data.get("insuranceClaim");

    yield call(decrementBalance, manager, amount);

    const currentArena = yield select(managersArena(manager));

    if (hasInsurance) {
      yield call(incrementBalance, manager, insuranceClaim);
      yield call(
        incrementInsuranceExtra,
        manager,
        40 * (currentArena.get("level") + 1)
      );
    }
  }
};

export default event;
