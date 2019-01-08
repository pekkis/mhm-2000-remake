import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import {
  incrementBalance,
  incrementInsuranceExtra,
  setArenaLevel
} from "../../sagas/manager";
import { amount as a } from "../../services/format";
import {
  managerHasService,
  managersDifficulty,
  managersArena
} from "../selectors";
import arenas from "../../data/arenas";

/*
sat34:
IF vai = 5 THEN RETURN
IF hjalli = 10 THEN RETURN
PRINT "Salaper„inen rahoitusyhti” 'VŽLIVETO INC.' kustantaa hallinne laajennuksen!"
hjalli = hjalli + 1
RETURN*/

const eventId = "valiveto";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));
    if (difficulty === 4) {
      return;
    }

    const currentArena = yield select(managersArena(manager));
    if (currentArena.get("level") === 9) {
      return;
    }

    const newArenaLevel = currentArena.get("level") + 1;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        newArenaLevel,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Salaperäinen rahoitusyhtiö __Väliveto Inc.__ kustantaa hallinne laajennuksen!`
    );
    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const newArenaLevel = data.get("newArenaLevel");

    yield call(setArenaLevel, manager, newArenaLevel);
  }
};

export default event;
