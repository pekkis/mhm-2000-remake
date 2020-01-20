import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import {
  managersMainCompetition,
  managersDifficulty,
  managersTeam,
  managerHasService,
  managersArena
} from "../../services/selectors";
import { amount as a } from "../../services/format";
import { decrementBalance, setArenaLevel } from "../../sagas/manager";

/*
sat73:
IF sarja = 2 THEN RETURN
IF hjalli < 10 THEN RETURN
IF v(u) < 300 THEN RETURN
IF vai < 3 THEN RETURN
PRINT "Valtaisa hallisi sortui viime y”n„! Huolimattomasta rakentamisesta johtu-"
PRINT "nut onnettomuus hautasi alleen 5 ihmist„, ja syytteilt„ v„ltty„ksesi maksat"
PRINT "kipurahoja yhteens„ 1.500.000 pekkaa."
PRINT "Joukkue joutuu siirtym„„n harjoitus-'areenalle'."
raha = raha - 1500000: hjalli = 3
IF veikko = 1 THEN
PRINT "Etel„l„n vakuutuskaan ei auta, sill„ kyseess„ on rakennusm„„r„ysten"
PRINT "t”rke„ rikkominen!!! Koko lasku p„„tyy joukkueelle..."
END IF
RETURN
*/

const eventId = "ultimateCruelty";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));
    if (difficulty < 2) {
      return;
    }

    const mainCompetition = yield select(managersMainCompetition(manager));
    if (mainCompetition !== "phl") {
      return;
    }

    const team = yield select(managersTeam(manager));
    if (team.get("strength") < 300) {
      return;
    }

    const arena = yield select(managersArena(manager));
    if (arena.get("level") !== 9) {
      return;
    }

    const hasInsurance = yield select(managerHasService(manager, "insurance"));

    const amount = 1500000;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        hasInsurance,
        amount,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Valtaisa hallisi sortui viime yönä! Huolimattomasta rakentamisesta johtunut onnettomuus hautasi alleen 5 ihmistä, ja syytteiltä välttyäksesi joudut maksamaan kipurahoja yhteensä ${a(
        data.get("amount")
      )} pekkaa. Joukkue joutuu siirtymään harjoitus-"areenalle".`
    );

    if (data.get("hasInsurance")) {
      t = t.push(
        `Etelälän vakuutuskaan ei auta, sillä kyseessä on vakuutusyhtiön mielestä rakennusmääräysten törkeä rikkominen, josta vastuussa ovat heidän vakaan näkemyksensä mukaan yksinomaan rakennuttaja ja urakan tilaaja. Koko lasku päätyy joukkueelle.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const amount = data.get("amount");

    yield call(decrementBalance, manager, amount);
    yield call(setArenaLevel, manager, 2);
  }
};

export default event;
