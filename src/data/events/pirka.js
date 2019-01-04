import { Map, List } from "immutable";
import { put, select } from "redux-saga/effects";

const eventId = "pirka";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          manager,
          resolved: true,
          amount: 80000
        })
      }
    });

    return;
  },

  render: data => {
    return List.of(
      `Ikääntynyt rokkitähti, __Pirka__, kuolee ja lahjoittaa koko omaisuutensa joukkueelle (${data.get(
        "amount"
      )} pekkaa ja kiinanpalatsikoiran).`
    );
  },

  process: function*(data) {
    yield put({
      type: "MANAGER_INCREMENT_BALANCE",
      payload: {
        manager: data.get("manager"),
        amount: data.get("amount")
      }
    });
  }
};

export default event;
