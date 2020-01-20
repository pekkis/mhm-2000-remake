import { Map, List } from "immutable";
import { select, put, call } from "redux-saga/effects";
import { managersTeam } from "../../services/selectors";
import { amount as a } from "../../services/format";
import { addEvent } from "../../sagas/event";
import { incrementBalance } from "../../sagas/manager";

const eventId = "cleandrug";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(managersTeam(manager));

    yield call(
      addEvent,
      Map({
        team: team.get("id"),
        teamName: team.get("name"),
        eventId,
        manager,
        resolved: true,
        amount: 70000
      })
    );
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
    yield call(incrementBalance, data.get("manager"), data.get("amount"));
  }
};

export default event;
