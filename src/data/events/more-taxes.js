import { Map, List } from "immutable";
import { select, put, call } from "redux-saga/effects";
import { managerCompetesIn, managersDifficulty } from "../selectors";
import { amount as a } from "../../services/format";
import { addEvent } from "../../sagas/event";

/*
sat13:
IF sarja = 1 THEN matky = 100000
IF sarja = 2 THEN matky = 50000
IF vai > 3 THEN matky = matky + 40000
IF vai < 2 THEN matky = matky - 20000
PRINT "Aaaaargh! Verokarhu p„„tt„„ m„tk„ist„ "; matky; " pekan lis„veron joukkueellesi!"
raha = raha - matky
*/

const getAmount = (competesInPHL, difficulty) => {
  let amount = competesInPHL ? 100000 : 50000;

  console.log("difficulty");

  if ([0, 1].includes(difficulty)) {
    return amount;
  }

  if ([2, 3].includes(difficulty)) {
    return amount + 40000;
  }

  return amount - 20000;
};

const texts = data => {
  return List.of(
    `Aaaaargh! Verokarhu päättää mätkäistä ${a(
      data.get("amount")
    )} pekan lisäveron joukkueellesi!`
  );
};

const eventId = "moreTaxes";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    const difficulty = yield select(managersDifficulty(manager));

    const amount = getAmount(competesInPHL, difficulty);

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: true,
        amount
      })
    );
  },

  render: texts,

  process: function*(data) {
    yield put({
      type: "MANAGER_DECREMENT_BALANCE",
      payload: {
        manager: data.get("manager"),
        amount: data.get("amount")
      }
    });
  }
};

export default event;
