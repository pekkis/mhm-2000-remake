import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { amount as a } from "../../services/format";
import {
  managersTeamId,
  managersDifficulty,
  managersArena,
  managersBalance
} from "../../services/selectors";
import { incrementStrength } from "../../sagas/team";
import { setArenaLevel, incrementBalance } from "../../sagas/manager";

/*
PRINT "Tisa Ekkanen, loistava NHL-pelaaja, palaa kotimaahan monien vuosien"
PRINT "j„lkeen. H„n liittyy joukkueeseen ilmaiseksi, "
IF hjalli < 6 AND vai < 5 THEN PRINT "kustantaa hallin laajennuksen,": hjalli = hjalli + 1
IF raha < 500000 AND vai < 3 THEN PRINT "ja lahjoittaa seuralle 500000 pekkaa!": raha = raha + 500000
IF sarja = 1 THEN v(u) = v(u) + 17
IF sarja = 2 THEN vd(u) = vd(u) + 17
*/

const eventId = "ekkanen";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));
    const arena = yield select(managersArena(manager));
    const balance = yield select(managersBalance(manager));

    console.log(balance);

    const expandArena = difficulty < 4 && arena.get("level") < 5;
    const giveMoney = difficulty < 2 && balance < 500000;

    console.log(balance, difficulty, giveMoney);

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        strength: 17,
        amount: 500000,
        expandArena,
        giveMoney,
        resolved: true,
        duration: 6
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Tisa Ekkanen, loistava NHL-pelaaja, palaa kotimaahan monien vuosien jälkeen. Hän liittyy joukkueeseen ilmaiseksi!`
    );

    if (data.get("expandArena")) {
      t = t.push(
        `Ekkanen on erityisen hövelillä päällä ja kustantaa hallisi laajennuksen.`
      );
    }

    if (data.get("giveMoney")) {
      t = t.push(
        `Eikä siinä vielä kaikki. Ekkanen lahjoittaa seuralle ${a(
          data.get("amount")
        )} pekkaa kylmää käteistä.
        )}.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    const strength = data.get("strength");
    const amount = data.get("amount");

    yield call(incrementStrength, team, strength);
    if (data.get("expandArena")) {
      const arena = yield select(managersArena(manager));
      yield call(setArenaLevel, manager, arena.get("level") + 1);
    }

    if (data.get("giveMoney")) {
      yield call(incrementBalance, manager, amount);
    }
  }
};

export default event;
