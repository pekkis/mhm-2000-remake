import { Map, List } from "immutable";
import { select, put, call, all } from "redux-saga/effects";
import {
  managersTeam,
  managersDifficulty,
  randomManager,
  managerCompetesIn,
  randomTeamFrom
} from "../selectors";
import { addEvent } from "../../sagas/event";
import { incurPenalty } from "../../sagas/team";

const eventId = "enemyProtest";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficultyLevel = yield select(managersDifficulty(manager));
    const otherManager = yield select(randomManager());

    const competesInPHL = yield select(managerCompetesIn("phl"));
    const otherTeam = yield select(
      randomTeamFrom([competesInPHL ? "phl" : "division"])
    );

    const penalty = difficultyLevel === 4 ? -4 : -2;
    const reward = 2;

    const team = yield select(managersTeam(manager));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        otherManagerName: otherManager.get("name"),
        otherTeam: otherTeam.get("id"),
        otherTeamName: otherTeam.get("name"),
        penalty,
        reward,
        team: team.get("id"),
        resolved: true
      })
    );
  },

  render: data => {
    let text = List.of(
      `Manageri __${data.get("otherManagerName")}__ ja joukkueensa __${data.get(
        "otherTeamName"
      )}__ tekevät protestin joukkuettasi vastaan.

Protesti menee läpi, ja teiltä vähennetään ${Math.abs(
        data.get("penalty")
      )} pistettä. ${data.get("otherTeamName")} saa ${Math.abs(
        data.get("reward")
      )} lisäpistettä.`
    );
    return text;
  },

  process: function*(data) {
    const otherTeam = data.get("otherTeam");
    const penalty = data.get("penalty");
    const reward = data.get("reward");
    const team = data.get("team");

    const competitions = yield select(state => state.game.get("competitions"));

    const competition = competitions
      .filterNot(c => c.get("id") === "ehl")
      .find(c => c.get("teams").includes(team));

    const groupId = competition
      .getIn(["phases", 0, "groups"])
      .findIndex(g => g.get("teams").includes(team));

    yield all([
      call(incurPenalty, competition.get("id"), 0, groupId, team, penalty),
      call(incurPenalty, competition.get("id"), 0, groupId, otherTeam, reward)
    ]);
  }
};

/*
  sat37:
y = CINT(14 * RND) + 1
IF sarja = 1 THEN PRINT l(z); ":n manageri "; lm(y); " nostaa kanteen joukkuettasi vastaan."
IF sarja = 2 THEN PRINT ld(z); ":n manageri "; lm(y); " nostaa kanteen joukkuettasi vastaan."
PRINT "Protesti menee l„pi, ja teilt„ v„hennet„„n 2 pistett„!!"
IF sarja = 1 THEN PRINT l(z); " saa 2 lis„pistett„.":
IF sarja = 2 THEN PRINT ld(z); " saa 2 lis„pistett„."
IF vai = 5 THEN PRINT "J„„kiekkoliitto rankaisee lis„ksi 2 pisteen menetyksell„!"
IF vai = 5 THEN o = 4 ELSE o = 2
IF sarja = 1 THEN p(u) = p(u) - o: p(z) = p(z) + 2
IF sarja = 2 THEN pd(u) = pd(u) - o: pd(z) = pd(z) + 2
RETURN
*/

export default event;
