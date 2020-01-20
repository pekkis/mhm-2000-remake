import { Map, List } from "immutable";
import { select, putResolve, call } from "redux-saga/effects";
import { managersTeam } from "../../services/selectors";
import r from "../../services/random";
import { addEvent } from "../../sagas/event";
import { incurPenalty } from "../../sagas/team";

const eventId = "protest";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager, victim } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        victim,
        resolved: false,
        autoResolve: true
      })
    );
  },

  resolve: function*(data) {
    console.log("FUCKEN RESOLVER?!?!?!?");

    const perpetratorTeam = yield select(managersTeam(data.get("manager")));

    const victimTeam = yield select(state =>
      state.game.getIn(["teams", data.get("victim")])
    );

    data = data
      .set("perpetrator", perpetratorTeam.get("id"))
      .set("perpetratorTeamName", perpetratorTeam.get("name"))
      .set("victimTeamName", victimTeam.get("name"))
      .set("success", r.bool())
      .set("resolved", true)
      .set("penalty", -3);
    yield putResolve({
      type: "EVENT_RESOLVE",
      payload: {
        id: data.get("id"),
        event: data
      }
    });
  },

  render: data => {
    let text = List.of(
      `Jääkiekkoliiton hallitus on juhlallisesti ynnä virallisesti kokoontunut ja käsitellyt protestisi mitä reiluimmassa ja tasapuolisimmassa hengessä. Päätös on lopullinen, eikä siitä voi valittaa.`
    );

    if (data.get("success")) {
      text = text.push(
        `Argumenttisi todetaan päteviksi. __${data.get(
          "victimTeamName"
        )}__ tuomitaan menettämään ${Math.abs(
          data.get("penalty")
        )} pistettä rangaistuksena väitetystä sääntörikkomuksesta.`
      );
    } else {
      text = text.push(
        `Argumenttisi todetaan hölynpölyksi. __${data.get(
          "perpetratorTeamName"
        )}__ tuomitaan menettämään ${Math.abs(
          data.get("penalty")
        )} pistettä rangaistuksena aiheettomasta syytöksestä.`
      );
    }

    return text;
  },

  process: function*(data) {
    const penalty = data.get("penalty");
    const success = data.get("success");

    const penalizedTeam = success
      ? data.get("victim")
      : data.get("perpetrator");

    const competitions = yield select(state => state.game.get("competitions"));

    const competition = competitions
      .filterNot(c => c.get("id") === "ehl")
      .find(c => c.get("teams").includes(penalizedTeam));

    const groupId = competition
      .getIn(["phases", 0, "groups"])
      .findIndex(g => g.get("teams").includes(penalizedTeam));

    yield call(
      incurPenalty,
      competition.get("id"),
      0,
      groupId,
      penalizedTeam,
      penalty
    );
  }
};

export default event;
