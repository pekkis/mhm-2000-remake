import { Map, List } from "immutable";
import { put } from "redux-saga/effects";
import r from "../../services/random";

const eventId = "kasino";

const texts = data => {
  const t = List.of(
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
  type: "player",

  create: function*(data) {
    const { player } = data;

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          player,
          resolved: false,
          amount: 150000
        })
      }
    });

    return;
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

    yield put({
      type: "PLAYER_INCREMENT_BALANCE",
      payload: {
        player: data.get("player"),
        amount: victory
      }
    });
  }
};

export default event;
