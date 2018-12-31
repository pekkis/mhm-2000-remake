import { Map, List } from "immutable";
import { select, put } from "redux-saga/effects";
import { playersArena } from "../selectors";
import { amount as a } from "../../services/format";

const eventId = "concert";

const event = {
  type: "player",

  create: function*(data) {
    const { player } = data;

    const arena = yield select(playersArena(player));

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          player,
          resolved: true,
          amount: 10000 + 20000 * arena.get("level")
        })
      }
    });

    return;
  },

  render: data => {
    return List.of(
      `Joukkueesi areenalla pidetään suuri rock-konsertti. Tuotto: ${a(
        data.get("amount")
      )} pekkaa.`
    );
  },

  process: function*(data) {
    yield put({
      type: "PLAYER_INCREMENT_BALANCE",
      payload: {
        player: data.get("player"),
        amount: data.get("amount")
      }
    });
  }
};

export default event;
