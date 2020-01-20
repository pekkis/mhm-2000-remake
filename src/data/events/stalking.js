import { Map, List } from "immutable";
import { select, call } from "redux-saga/effects";
import { managersTeamId, randomManager, managerCompetesIn } from "../../services/selectors";
import { addEvent } from "../../sagas/event";
import { decrementMorale } from "../../sagas/team";

const eventId = "stalking";

/*
sat17:
IF sarja = 2 THEN RETURN
x = CINT(14 * RND) + 1
PRINT "Manageri "; lm(x); " kytt„„ paikkaa joukkueessa."
PRINT "Mies tunnetaan tappavan raskaista harjoituksistaan ja pirullisuudestaan,"
PRINT "joten pelko romahduttaa moraalin vaikkei jutussa olekaan per„„!"
mo = mo - 40
*/

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    if (!competesInPHL) {
      return;
    }

    const stalker = yield select(randomManager());

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        stalker: stalker.get("name"),
        resolved: true
      })
    );
  },

  render: data => {
    let t = List.of(
      `Manageri __${data.get(
        "stalker"
      )}__ kyttää paikkaa joukkueessa. Mies tunnetaan tappavan raskaista harjoituksistaan ja pirullisuudestaan, joten pelko romahduttaa moraalin vaikkei jutussa olekaan perää!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));

    yield call(decrementMorale, team, 10000);
  }
};

export default event;
