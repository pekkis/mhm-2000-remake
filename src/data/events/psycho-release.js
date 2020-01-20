import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { flag, randomTeamFrom } from "../../services/selectors";
import { cinteger } from "../../services/random";
import { setFlag } from "../../sagas/game";

/*

sat85:
IF assassi = 0 THEN RETURN
PRINT "Er„„n„ iltana ovikello soi. Avaat oven, ja sen takana seisoo"
PRINT "psykopaattimanageri "; lm(16); "!!"
satt85:
yyy = CINT(11 * RND) + 2
nnn = CINT(14 * RND) + 1
IF yyy = u AND sarja = 2 THEN GOTO satt85
PRINT "Mies on viimein vapautettu, ja saanut my”skin t”it„ divisioonasta!"
PRINT ld(yyy); " on palkannut h„net, ja mainostaa itse„„n"
PRINT "iskulauseella 'HULLUN HYVŽ MEININKI'!"
SWAP lm(nnn), lm(16): assassi = 0
RETURN
*/

const eventId = "psychoRelease";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const psycho = yield select(flag("psycho"));
    if (!psycho) {
      return;
    }

    const psychoManager = yield select(state =>
      state.game.getIn(["managers", psycho])
    );

    const randomTeam = yield select(randomTeamFrom(["division"]));

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        otherManager: psychoManager.get("name"),
        otherTeam: randomTeam.get("name"),
        letter: cinteger(0, 4),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Eräänä iltana ovikello soi. Avaat oven, ja sen takana seisoo psykopaattimanageri __${data.get(
        "otherManager"
      )}__!`
    );

    t = t.push(
      `Mies on viimein vapautettu Tiukukosken mielisairaalasta, ja hän on saanut myöskin töitä divisioonasta. __${data.get(
        "otherTeam"
      )}__ on palkannut hänet, ja mainostaa nyt itseään iskulauseella "hullun hyvä meininki".`
    );

    return t;
  },

  process: function*(data) {
    yield call(setFlag, "psycho", undefined);
  }
};

export default event;
