import { Map, List } from "immutable";
import { call } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementBalance } from "../../sagas/manager";

/*
sat68:
COLOR 11, 0
PRINT "Maso TV:ll„ on sopimus liigan kanssa otteluiden n„ytt„misest„."
PRINT "Luonnollisesti huippuottelut kiinnostavat, ja joukkueesi edellinen"
PRINT "ottelu n„kyi valtakunnanverkossa. Liiga maksaa teille 20.000 pekkaa."
COLOR 14, 0
raha = raha + 20000
RETURN
*/

const eventId = "topGame";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 20000,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `__Maso TV:llä__ on sopimus liigan kanssa otteluiden näyttämisestä. Luonnollisesti huippuottelut kiinnostavat, ja joukkueesi äskeinen ottelu näkyikin valtakunnanverkossa. Liiga maksaa teille ${data.get(
        "amount"
      )} pekkaa.`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const amount = data.get("amount");
    yield call(incrementBalance, manager, amount);
  }
};

export default event;
