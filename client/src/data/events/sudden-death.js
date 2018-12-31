import { Map, List } from "immutable";
import { put } from "redux-saga/effects";
import { amount as a } from "../../services/format";

const eventId = "suddenDeath";

const texts = data => {
  let t = List.of(
    `Kaikki pelaajasi ovat saaneet surmansa lento-onnettomuudessa! Johtokunta kehottaa sinua etsimään uusia kiekkoilijoita`
  );

  if (data.get("hasInsurance")) {
    t = t.push(
      `Etelälä joutuu maksamaan sinulle ${a(data.get("amount"))} pekkaa`
    );
  }

  if (!data.get("resolved")) {
    return t;
  }

  return t.push(`Uskoitko? Ainakin ensimmäisellä kerralla... :)`);
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
          amount: 15000000,
          resolved: false
        })
      }
    });

    return;
  },

  options: data => {
    return Map({
      ok: `Aaaaasia selvä. `,
      wtf: `Hiiiieno homma. Kiitos infosta.`
    });
  },

  resolve: function*(data, value) {
    yield put({
      type: "EVENT_RESOLVE",
      payload: {
        id: data.get("id"),
        event: data.set("resolved", true)
      }
    });
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {}
};

export default event;
