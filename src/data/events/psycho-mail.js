import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { flag } from "../../services/selectors";
import { cinteger } from "../../services/random";

/*

sat84:
IF assassi = 0 THEN RETURN
PRINT "Manageri "; lm(16); " l„hett„„ sinulle Tiukukoskelta kirjeen,"
yyy = CINT(5 * RND) + 1
IF yyy = 1 THEN PRINT "jossa h„n vannoo kostoa !"
IF yyy = 2 THEN PRINT "jossa h„n varoittaa sinua avaruusolentojen hy”kk„yksest„."
IF yyy = 3 THEN PRINT "jossa h„n pyyt„„ anteeksi ja kertoo psykoanalyysist„„n."
IF yyy = 4 THEN PRINT "jossa h„n kertoo olevansa koko sairaalan paras j„„kiekkomanageri."
IF yyy = 5 THEN PRINT "josta ei saa mit„„n tolkkua."
IF yyy = 6 THEN PRINT "jonka h„nelle ovat sanelleet 'Toni Tiikeri' ja 'Eetu Elefantti'"
RETURN
*/

const letters = List.of(
  data =>
    `__${data.get(
      "otherManager"
    )}__ lähettää sinulle Tiukukoskelta kirjeen, jossa vannoo kostoa!`,
  data =>
    `__${data.get(
      "otherManager"
    )}__ lähettää sinulle Tiukukoskelta kirjeen, jossa hän varoittaa sinua avaruusolentojen hyökkäyksestä.`,
  data =>
    `__${data.get(
      "otherManager"
    )}__ lähettää sinulle Tiukukoskelta kirjeen, jossa hän kertoo olevansa koko sairaalan paras jääkiekkomanageri.`,
  data =>
    `__${data.get(
      "otherManager"
    )}__ lähettää sinulle Tiukukoskelta kirjeen, josta et ota mitään tolkkua.`,
  data =>
    `__${data.get(
      "otherManager"
    )}__ lähettää sinulle Tiukukoskelta kirjeen, jonka hänelle "ovat sanelleet Sami Sammakko, Toni Tiikeri ja Ossi Olifantti".`
);

const eventId = "psychoMail";

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

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        otherManager: psychoManager.get("name"),
        letter: cinteger(0, 4),
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(letters.get(data.get("letter"))(data));

    return t;
  },

  process: function*(data) {}
};

export default event;
