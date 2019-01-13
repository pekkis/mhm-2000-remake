import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementReadiness } from "../../sagas/team";
import { managersTeamId } from "../selectors";

/*
sat92:
PRINT "Pelaajiesi kunto kohenee jostain syyst„ silmiss„! Kiekko liikkuu"
PRINT "kovalla sykkeell„ treeneiss„ ja peliesityksetkin kohenevat."
tre = tre + 3: RETURN
*/

const eventId = "strategySuccess";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Pelaajiesi kunto kohenee jostain syystä silmissä! Kiekko liikkuu kovalla sykkeellä treeneissä ja peliesityksetkin kohenevat.`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    yield call(incrementReadiness, team, 3);
  }
};

export default event;
