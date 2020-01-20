import { Map, List } from "immutable";
import { select, call } from "redux-saga/effects";
import { managersTeamId, managersDifficulty } from "../../services/selectors";
import { amount as a } from "../../services/format";
import { addEvent } from "../../sagas/event";
import { incrementBalance, decrementBalance } from "../../sagas/manager";

const eventId = "fanMerchandise";

/*
IF vai < 5 THEN PRINT "Fanituotteet myyv„t TODELLA hyvin! Viime kuukauden voitto 40000 pekkaa."
IF vai < 5 THEN raha = raha + 40000
IF vai = 5 THEN PRINT "Fanituotteet myyv„t TODELLA huonosti! Viime kuukauden tappio 40000 pekkaa."
IF vai = 5 THEN raha = raha - 40000
*/

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 40000,
        resolved: true,
        sales: difficulty === 4 ? "bad" : "good"
      })
    );
  },

  render: data => {
    let t = List();
    if (data.get("sales") === "good") {
      t = t.push(
        `Fanituotteet myyvät __todella hyvin__! Viime kuukauden voitto ${a(
          data.get("amount")
        )} pekkaa.`
      );
    } else {
      t = t.push(
        `Fanituotteet myyvät __todella huonosti__! Viime kuukauden tappio ${a(
          data.get("amount")
        )} pekkaa.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");

    if (data.get("sales") === "good") {
      yield call(incrementBalance, manager, data.get("amount"));
    } else {
      yield call(decrementBalance, manager, data.get("amount"));
    }
  }
};

export default event;
