import { Map, List } from "immutable";
import { select, put } from "redux-saga/effects";
import { playersTeam } from "../selectors";
import { amount as a } from "../../services/format";

const eventId = "cleandrug";

const event = {
  type: "player",

  create: function*(data) {
    const { player } = data;

    const team = yield select(playersTeam(player));

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          team: team.get("id"),
          teamName: team.get("name"),
          eventId,
          player,
          resolved: true,
          amount: 70000
        })
      }
    });

    return;
  },

  render: data => {
    return List.of(
      `Lavakoomikko __Aape Ralliala__ julistaa kääntyneensä ${data.get(
        "teamName"
      )}:n kannattajaksi ja lahjoittaa sen osoitukseksi joukkueelle ${a(
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
