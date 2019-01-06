import { select, call } from "redux-saga/effects";
import { Map, List } from "immutable";
import { randomManager } from "../selectors";
import { decrementStrength } from "../../sagas/team";
import { addEvent } from "../../sagas/event";

const eventId = "bazookaStrike";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager, victim } = data;

    const victimManager = yield select(randomManager());

    const victimTeam = yield select(state =>
      state.game.getIn(["teams", victim])
    );

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        victim,
        victimTeamName: victimTeam.get("name"),
        victimManager: victimManager.get("name"),
        resolved: true
      })
    );
  },

  render: data => {
    let text = List.of(
      `Pum! Matkalla vieraspeliin __${data.get(
        "victimTeamName"
      )}__ kohtaa yllättäviä hankaluuksia. Silminnäkijäkuvauksen mukaan metsänrajasta sinkoutuu liikkeelle toisen ison kötinän aikainen panssarinyrkki, ja yks kaks tilausajon värjää punaiseksi liekkien kajo.

Iskun tekijäksi ilmoittautuu PVA. Miliisi ei kommentoi. Joukkue joutuu joka tapauksessa turvautumaan junioreihinsa, ja manageri __${data.get(
        "victimManager"
      )}__ vannoo löytävänsä syylliset!`
    );
    return text;
  },

  process: function*(data) {
    const team = yield select(state =>
      state.game.getIn(["teams", data.get("victim")])
    );

    const skillLost = Math.round(0.75 * team.get("strength"));

    yield call(decrementStrength, data.get("victim"), skillLost);
  }
};

export default event;
