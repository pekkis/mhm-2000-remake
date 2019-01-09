import { Map, List } from "immutable";
import { put, call } from "redux-saga/effects";
import r from "../../services/random";
import { addEvent } from "../../sagas/event";
import { incrementBalance } from "../../sagas/manager";

const eventId = "kasino";

const texts = data => {
  let t = List.of(
    `Olet eräänä iltana kasinolla.

  Yhtäkkiä ääni päässäsi sanoo: 'Laita ${data.get(
    "amount"
  )} pekkaa joukkueen kassasta peliin, niin voitto on sinun!' Otatko riskin?`
  );

  if (!data.get("resolved")) {
    return t;
  }

  if (!data.get("participate")) {
    return t.push("Pelkuri.");
  }

  if (!data.get("success")) {
    return t.push(`Hävisit. Voi voi sentään...`);
  }

  return t.concat(
    `JESS! Voitit omasi takaisin sekä ${data.get("amount") * 3} pekkaa lisää!`
  );
};

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: false,
        amount: 150000
      })
    );
  },

  options: () => {
    return Map({
      p: "Kaikki punaiselle!",
      m: "Kaikki mustalle!",
      e: "Ei. Uhkapeli on syntiä."
    });
  },

  resolve: function*(data, value) {
    if (value === "e") {
      data = data.set("resolved", true).set("participate", false);
    }

    data = data
      .set("resolved", true)
      .set("success", r.pick([true, false]))
      .set("participate", true);

    yield put({
      type: "EVENT_RESOLVE",
      payload: {
        id: data.get("id"),
        event: data
      }
    });
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {
    if (!data.get("participate")) {
      return;
    }

    const victory = data.get("success")
      ? data.get("amount") * 3
      : -data.get("amount");

    yield call(incrementBalance, data.get("manager"), victory);
  }
};

export default event;
