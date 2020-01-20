import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { addEffect } from "../../sagas/team";
import { managersTeam } from "../../services/selectors";

const eventId = "karijurri";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        strength: 15,
        resolved: true,
        duration: 6
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `NHL on lakossa ${data.get(
        "duration"
      )} ottelun ajan, ja __Kari Jurri__ saapuu Denveristä, Coloradosta, joukkueeseesi pitämään kuntoaan yllä!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const strength = data.get("strength");
    const duration = data.get("duration");
    const team = yield select(managersTeam(manager));

    yield call(addEffect, team.get("id"), ["strength"], strength, duration);
  }
};

/*
/*
IF yk > 0 THEN RETURN
PRINT "NHL on lakossa 6 ottelun ajan, ja Kari Jurri saapuu Denverist„,"
PRINT "Coloradosta, joukkueeseesi pit„m„„n kuntoaan yll„!"
tauti2 = -15
yk = 6
RETURN
*/

export default event;
