import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { decrementMorale } from "../../sagas/team";
import { randomManager, managersTeamId } from "../../services/selectors";

/*
sat65:
xxx = CINT(14 * RND) + 1
PRINT "Ilta-Pekkis rankkaa sinut sarjan huonoimmaksi manageriksi!"
PRINT "Listan k„rjest„ l”ytyy "; lm(xxx)
RETURN
*/

const eventId = "worstManagerEver";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const random = yield select(randomManager());

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        otherManager: random.get("name"),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `__Ilta-Pekkis__ rankkaa sinut _kaikkien aikojen huonoimmaksi_ manageriksi! Listan kärjestä löytyy ${data.get(
        "otherManager"
      )}.`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    yield call(decrementMorale, team, 1);
  }
};

export default event;
