import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { randomManager, flag, totalGamesPlayed } from "../selectors";
import { setFlag } from "../../sagas/game";

/*
sat83:
IF assassi = 1 THEN RETURN
IF psmo < 100 THEN RETURN
yyy = CINT(14 * RND) + 1
PRINT "Yht'äkkiä, kävellessäsi kadulla, kommandopipoinen heppu hyppää eteesi"
PRINT "pistooli kourassaan! Nauraen hän riisuu valepukunsa, ja sen alta paljastuu"
PRINT "manageri "; lm(yyy); "!!! Hän kertoo vihanneensa sinua siitä saakka"
PRINT "kun ensimmäisen kerran näki sinut vastustajan aitiossa, ja tulleensa"
PRINT "tappamaan sinut. Juuri, kun hän tähtää päätäsi, kaahaa paikalle miliisi,"
PRINT "ja seonnut manageriraukka säntää kujalle. My”hemmin hänet saadaan kui-"
PRINT "tenkin kiinni ja suljetaan Tiukukosken mielisairaalaan."
SWAP lm(yyy), lm(16): assassi = 1
RETURN
*/

const eventId = "psychoAttack";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const phlGamesPlayed = yield select(totalGamesPlayed(manager, "phl", 0));
    if (phlGamesPlayed < 100) {
      return;
    }

    const psycho = yield select(flag("psycho"));
    if (psycho) {
      return;
    }

    const random = yield select(randomManager());

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        otherManagerId: random.get("id"),
        otherManager: random.get("name"),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Yht'äkkiä, kävellessäsi kadulla, kommandopipoinen heppu hyppää eteesi pistooli kourassaan! Nauraen hän riisuu valepukunsa, ja sen alta paljastuu manageri __${data.get(
        "otherManager"
      )}__!

Hän kertoo _vihanneensa_ sinua siitä saakka kun ensimmäisen kerran näki sinut vastustajan aitiossa, ja tulleensa tappamaan sinut.

Juuri, kun hän tähtää kohti päätäsi, kaahaa paikalle miliisi, ja seonnut manageriraukka säntää kujalle. Myöhemmin hänet saadaan kui tenkin kiinni ja suljetaan Tiukukosken mielisairaalaan.`
    );

    return t;
  },

  process: function*(data) {
    const otherManagerId = data.get("otherManagerId");
    yield call(setFlag, "psycho", otherManagerId);
  }
};

export default event;
