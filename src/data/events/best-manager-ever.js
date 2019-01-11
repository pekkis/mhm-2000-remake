import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementMorale } from "../../sagas/team";
import { randomManager, managersTeamId } from "../selectors";

/*
sat64:
xxx = CINT(14 * RND) + 1
PRINT "Ilta-Maso rankkaa sinut kaikkien aikojen parhaaksi manageriksi!"
PRINT "Listan h„nnilt„ l”ytyy "; lm(xxx)
RETURN
*/

const eventId = "bestManagerEver";

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
      `__Ilta-Maso__ rankkaa sinut _kaikkien aikojen parhaaksi_ manageriksi! Listan hänniltä löytyy ${data.get(
        "otherManager"
      )}.`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    yield call(incrementMorale, team, 1);
  }
};

export default event;
