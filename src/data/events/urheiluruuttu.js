import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementMorale } from "../../sagas/team";
import { managersTeamId, managersDifficulty } from "../../services/selectors";

/*
sat38:
PRINT "Urheilu-Ruuttu tekee joukkueestanne suuren jutun!"
PRINT "Moraali nousee kohisten..."
IF vai >= 4 THEN PRINT "kunnes 'pukukoppikameran' otokset suihkusta n„ytet„„n..."
mo = mo + 4
IF vai >= 4 THEN mo = mo - 8
*/

const eventId = "urheiluruuttu";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));
    const showerCam = difficulty >= 3 ? true : false;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        showerCam,
        moraleGain: showerCam ? -4 : 4,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Urheilu-Ruuttu tekee joukkueestanne suuren jutun! Moraali nousee kohisten...`
    );

    if (data.get("showerCam")) {
      t = t.push(
        `...ainakin siihen asti kunnes pukukoppikameran kuumat otokset suihkusta näytetään lapsille suorassa lähetyksessä.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const moraleGain = data.get("moraleGain");
    const team = yield select(managersTeamId(manager));

    yield call(incrementMorale, team, moraleGain);
  }
};

export default event;
