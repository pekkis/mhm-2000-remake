import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { setBalance } from "../../sagas/manager";
import { managersDifficulty } from "../../services/selectors";

/*
IF banki = 1 THEN RETURN
Pankki, jossa joukkueen tili (tai velka) on, MENEE KONKURSSIIN! KAIKKI pankin s„„st”t & velat mit„t”id„„n, ja kansa vaatii rahojaantakaisin... TURHAAN!!! Pankinjohtaja Sulf Undqvist valittelee tapahtunutta, ja matkustaa toipumaan Caymansaarten huvilalleen."
raha = 0
*/

const eventId = "undqvist";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));
    if (difficulty === 4) {
      return;
    }

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: true
      })
    );
    return;
  },

  render: () => {
    return List.of(
      `Pankki, jossa joukkueen tili (tai velka) on, __menee konkurssiin__! Kaikki pankissa uinuvat säästöt, velat ja sijoitukset ovat ikuisiksi ajoiksi mennyttä. Kansa vaatii rahojaan takaisin, mutta turhaan.

Pankinjohtaja Sulf Undqvist valittelee tapahtunutta ja matkustaa toipumaan Gaymansaarten huvilalleen.`
    );
  },

  process: function*(data) {
    const manager = data.get("manager");
    yield call(setBalance, manager, 0);
  }
};

export default event;
