import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementReadiness } from "../../sagas/team";
import { managersTeamId, managersTeam } from "../selectors";

/*
sat90:
IF jursi = 0 THEN RETURN
PRINT "Pelaajasi ovat edell„ aikatauluaan! Vaikka kunto onkin ajoitettu"
PRINT "play-offeihin, pelaavat he jo nyt kuin hurmiossa!"
tre = tre + 6: RETURN
*/

const eventId = "simonovSuccess";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(managersTeam(manager));
    if (team.get("strategy") !== 0) {
      return;
    }

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
      `Pelaajasi ovat edellä suunniteltua aikataulua. Vaikka "Juri Simonov"-strategian ansiosta  kuntohuippunne onkin ajoitettu play-offeihin, pelaavat "pojat" jo nyt kuin huomista ei olisi. Sinulla on hyvä syy odottaa tilanteen ainoastaan paranevan kohti kevättä!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    yield call(incrementReadiness, team, 6);
  }
};

export default event;
