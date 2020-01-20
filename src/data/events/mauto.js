import { Map, List } from "immutable";
import { put, select, call } from "redux-saga/effects";
import r from "../../services/random";
import {
  managerCompetesIn,
  flag,
  randomTeamFrom,
  managersTeam,
  managersDifficulty
} from "../../services/selectors";
import { addEvent } from "../../sagas/event";

import { incrementBalance } from "../../sagas/manager";
import { incrementStrength } from "../../sagas/team";
import { setFlag } from "../../sagas/game";

const eventId = "mauto";

const texts = data => {
  let t = List.of(
    `Monikansallinen autotehdas __Mautomobiles__ haluaa sponsoroida joukkuettasi!
    Jos joukkueen nimeksi vaihdetaan _${data.get(
      "newName"
    )}_, rahoittavat he toimintaanne ${data.get("amount")} pekalla! Suostutko?`
  );

  if (!data.get("resolved")) {
    return t;
  }

  if (data.get("changeOfMind")) {
    return t.push(
      `Mauto muuttaa yhtäkkiä mielipidettään ja sponsoroikin toista joukkuetta (__${data.get(
        "teamName"
      )}__).`
    );
  }

  if (!data.get("agree")) {
    return t.push(
      `Mautomobiles sponsoroi joukkuetta __${data.get("teamName")}__.`
    );
  }

  return t.push(
    `Mautomobilesin toimitusjohtaja hymyilee kuin Naantalin aurinko. "Olkoon alkava yhteistyömme pitkä ja menestyksekäs!"`
  );
};

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    if (!competesInPHL) {
      return;
    }

    const hasHappened = yield select(flag("mauto"));
    if (hasHappened) {
      return;
    }

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        newName: "Mauto HT",
        resolved: false,
        amount: 4000000
      })
    );
    return;
  },

  options: data => {
    return Map({
      y: `Suostun. Kauan eläköön ${data.get("newName")} `,
      n: "En suostu. Pitäköön mautonsa!"
    });
  },

  resolve: function*(data, value) {
    const manager = data.get("manager");
    const difficulty = yield select(managersDifficulty(manager));

    let team;
    if (value === "n") {
      team = yield select(randomTeamFrom(["phl", "division"], false));
    } else if (value === "y" && difficulty >= 3) {
      team = yield select(randomTeamFrom(["phl", "division"], false));
    } else {
      team = yield select(managersTeam(manager));
    }

    const resolved = data.merge({
      changeOfMind: value === "y" && difficulty >= 3,
      agree: value === "y" ? true : false,
      team: team.get("id"),
      teamName: team.get("name"),
      resolved: true
    });

    yield put({
      type: "EVENT_RESOLVE",
      payload: {
        id: data.get("id"),
        event: resolved
      }
    });
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {
    yield call(setFlag, "mauto", true);

    yield put({
      type: "TEAM_RENAME",
      payload: {
        team: data.get("team"),
        name: data.get("newName")
      }
    });

    if (!data.get("agree") || data.get("changeOfMind")) {
      yield call(incrementStrength, data.get("team"), 40);
    } else {
      yield call(incrementBalance, data.get("manager"), data.get("amount"));

      yield put({
        type: "MANAGER_RENAME_ARENA",
        payload: {
          manager: data.get("manager"),
          name: "Mauto Center"
        }
      });
    }
  }
};

export default event;
