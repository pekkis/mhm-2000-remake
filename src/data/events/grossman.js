import { Map, List } from "immutable";
import { call } from "redux-saga/effects";
import { addEvent, resolvedEvent } from "../../sagas/event";

const eventId = "grossman";

/*
sat86:
PRINT "Urheilun tappaja, pienten seurojen kirous, kuuluisan Grossman-p„„t”ksen"
PRINT "aikaansaaja, Marc Grossman, haluaisi pelata joukkueessasi."
PRINT "Otatko kaikkialla vihatun Grossmanin joukkueeseesi?"
satt86:
INPUT "Valitse (e)i, (n)ej, (n)o tai (n)icht...", gross$
IF gross$ = "e" THEN RETURN
IF gross$ = "n" THEN RETURN
GOTO satt86
*/

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: false
      })
    );
  },

  options: data => {
    return Map({
      agree: `Ei, kiitos!`,
      disagree: `Kiitos, ei!`
    });
  },

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true
    });

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `Urheilun tappaja, pienten seurojen kirous, kuuluisan Grossman-päätöksen aikaansaaja, __Marc Grossman__, haluaisi pelata joukkueessasi. Otatko kaikkialla vihatun Grossmanin joukkueeseesi?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    t = t.push(
      `__Grossman__ pillahtaa itkuun. Hänen uransa on tuhottu, vaikka hän tarkoitti vain hyvää.`
    );

    return t;
  },

  process: function*(data) {}
};

export default event;
