import { Map, List } from "immutable";
import { select, put } from "redux-saga/effects";
import { managersTeam } from "../selectors";
import { amount as a } from "../../services/format";

const eventId = "cleandrug";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(managersTeam(manager));

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          team: team.get("id"),
          teamName: team.get("name"),
          eventId,
          manager,
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
      type: "MANAGER_INCREMENT_BALANCE",
      payload: {
        manager: data.get("manager"),
        amount: data.get("amount")
      }
    });
  }
};

export default event;
