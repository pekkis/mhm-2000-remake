import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent, resolvedEvent } from "../../sagas/event";
import { managersArena } from "../selectors";
import { incrementBalance, renameArena } from "../../sagas/manager";
import { amount as a } from "../../services/format";

/*
IF halli$ = "Mauto Areena" THEN RETURN
IF halli$ = "Otso-Halli" THEN RETURN
PRINT "Suuri olutpanimo on halukas sponsoroimaan joukkuettasi!"
PRINT "Se maksaa 800.000 pekkaa, jos hallin nimi muutetaan"
PRINT "'Otso-Halli'ksi. Otatko tarjouksen vastaan? (k,e)"
INPUT otso$
IF otso$ = "k" THEN halli$ = "Otso-Halli": raha = raha + 800000: RETURN
IF otso$ = "e" THEN RETURN
GOTO sat54
*/

const eventId = "otsohalli";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const arena = yield select(managersArena(manager));

    if (["Mauto Areena", "Otso-Halli"].includes(arena.get("name"))) {
      return;
    }

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 800000,
        resolved: false
      })
    );
    return;
  },

  options: () =>
    Map({
      agree: "Kyllä. Olutraha kelpaa aina!",
      disagree: "Ei. Onpa kerrassaan moraaliton ehdotus!"
    }),

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true,
      agree: value === "agree"
    });

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `Suuri olutpanimo on halukas sponsoroimaan joukkuettasi! Se maksaa ${a(
        data.get("amount")
      )} pekkaa, jos hallin nimi muutetaan __Otso-Halliksi__. Otatko tarjouksen vastaan?"`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (data.get("agree")) {
      t = t.push(`Sponsoritarroja liimaillaan hallilla jo tätä lukiessasi.`);
    } else {
      t = t.push(
        `Panimon edustaja on selvästi kummissaan, mutta ei voi kuin hyväksyä päätöksesi.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    if (data.get("agree")) {
      const amount = data.get("amount");
      yield call(incrementBalance, manager, amount);
      yield call(renameArena, manager, "Otso-Halli");
    }
  }
};

export default event;
