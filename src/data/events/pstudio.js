import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { decrementMorale } from "../../sagas/team";
import { managersTeamId, managersDifficulty } from "../../services/selectors";

/*
sat39:
PRINT "P-STUDIO tekee reportaasin joukkueenne veror„stien takia."
PRINT "Juttu on valetta, mutta se laskee moraalia kun pelaajat pelk„„v„t"
PRINT "palkanmaksun viiv„stymist„."
mo = mo - (1 + vai)
RETURN*/

const eventId = "pstudio";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));
    const moraleLoss = 2 + difficulty;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        moraleLoss,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `__P-Studio__ tekee reportaasin joukkueenne verorästien takia. Juttu on valetta, mutta se laskee moraalia kun pelaajat pelkäävät palkanmaksun viivästymistä.`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const moraleLoss = data.get("moraleLoss");
    const team = yield select(managersTeamId(manager));

    yield call(decrementMorale, team, moraleLoss);
  }
};

export default event;
