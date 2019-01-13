import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { randomManager, managersArena } from "../selectors";
import { decrementBalance } from "../../sagas/manager";
import { amount as a } from "../../services/format";

/*
sat80:
yyy = CINT(14 * RND) + 1
IF hjalli > 6 THEN RETURN
PRINT "Hallisi tulostaulu on pudonnut keskell„ y”t„! Er„s pelaajasi l”yt„„ mustan"
PRINT "kommandopipon pukuhuoneen roskiksesta,mutta tekij„„ ei saada kiinni."
PRINT "Manageri "; lm(yyy); " soittaa ja valittelee tapahtunutta."
PRINT "Korjauskustannukset nousevat 250.000 pekkaan!"
raha = raha - 250000
RETURN
*/

const eventId = "scoreboard";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const arena = yield select(managersArena(manager));
    if (arena.get("level") < 5) {
      return;
    }

    const random = yield select(randomManager());

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        otherManager: random.get("name"),
        amount: 250000,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Hallisi tulostaulu on pudonnut keskellä yötä! Er„s pelaajasi löytää mustan kommandopipon pukuhuoneen roskiksesta,mutta tekijää ei saada kiinni.

Manageri __${data.get(
        "otherManager"
      )}__ soittaa ja valittelee tapahtunutta. Korjauskustannukset nousevat ${a(
        data.get("amount")
      )} pekkaan!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const amount = data.get("amount");

    yield call(decrementBalance, manager, amount);
  }
};

export default event;
