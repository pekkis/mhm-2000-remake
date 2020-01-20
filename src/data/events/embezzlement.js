import { Map, List } from "immutable";
import { select, call } from "redux-saga/effects";
import {
  managersDifficulty,
  managerObject,
  managerHasService
} from "../../services/selectors";
import { amount as a } from "../../services/format";
import { addEvent } from "../../sagas/event";
import {
  incrementBalance,
  decrementBalance,
  incrementInsuranceExtra
} from "../../sagas/manager";

const eventId = "embezzlement";

const embezzledAmount = (balance, difficulty) => {
  if (difficulty < 3) {
    return Math.round(0.1 * balance);
  }

  if (difficulty === 3) {
    return Math.round(0.15 * balance);
  }

  return Math.round(0.25 * balance);
};

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const managerObj = yield select(managerObject(manager));

    if (managerObj.get("balance") < 100000) {
      return;
    }

    const difficulty = yield select(managersDifficulty(manager));

    const amountEmbezzled = embezzledAmount(
      managerObj.get("balance"),
      difficulty
    );

    const hasInsurance = yield select(managerHasService(manager, "insurance"));
    const amountReimbursed = hasInsurance
      ? Math.round(0.8 * amountEmbezzled)
      : 0;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amountEmbezzled,
        amountReimbursed,
        resolved: true
      })
    );
  },

  render: data => {
    let t = List.of(
      `Yksi johtokunnan jäsen katoaa, vieden mukanaan aimo siivun joukkueen kassasta. Tililtänne uupuu yhteensä __${a(
        data.get("amountEmbezzled")
      )}__ pekkaa.`
    );
    if (data.get("amountReimbursed")) {
      t = t.push(
        `Etelälä maksaa teille korvauksena __${a(
          data.get("amountReimbursed")
        )}__ pekkaa.`
      );
    }
    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");

    yield call(decrementBalance, manager, data.get("amountEmbezzled"));

    if (data.get("amountReimbursed")) {
      yield call(incrementBalance, manager, data.get("amountReimbursed"));
      yield call(
        incrementInsuranceExtra,
        manager,
        Math.round(data.get("amountReimbursed") / 60)
      );
    }
  }
};

/*
sat19:
IF raha < 100000 THEN RETURN
IF vai < 4 THEN ccc = 10
IF vai = 4 THEN ccc = 8
IF vai = 5 THEN ccc = 4
PRINT "Yksi johtokunnan j„sen katoaa, vieden mukanaan"; ccc; "-osan kassasta!"
pimitys = raha / ccc
vaksum = raha / (ccc + 1)
IF veikko = 1 THEN PRINT "Etel„l„ maksaa teille "; vaksum; " pekkaa."
raha = raha - pimitys
IF veikko = 1 THEN raha = raha + vaksum: palo = palo + vaksum / 60
RETURN
*/

export default event;
