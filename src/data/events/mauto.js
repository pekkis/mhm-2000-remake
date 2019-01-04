import { Map, List } from "immutable";
import { put, select, all } from "redux-saga/effects";
import r from "../../services/random";
import {
  managerCompetesIn,
  flag,
  randomTeamFrom,
  managersTeam,
  managersDifficulty
} from "../selectors";

const eventId = "mauto";

const texts = data => {
  const t = List.of(
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

    /*    const competesInPHL = yield select(managerCompetesIn(manager, "phl"));
    if (!competesInPHL) {
      return;
    }
    */

    const hasHappened = yield select(flag("mauto"));
    if (hasHappened) {
      return;
    }

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          manager,
          newName: "Mauto HT",
          resolved: false,
          amount: 4000000
        })
      }
    });

    return;
  },

  options: () => {
    return Map({
      y: "Suostun.",
      n: "En suostu."
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
    yield put({
      type: "GAME_SET_FLAG",
      payload: {
        flag: "mauto",
        value: true
      }
    });

    yield put({
      type: "TEAM_RENAME",
      payload: {
        team: data.get("team"),
        name: data.get("newName")
      }
    });

    if (!data.get("agree") || data.get("changeOfMind")) {
      yield put({
        type: "TEAM_INCREMENT_STRENGTH",
        payload: {
          team: data.get("team"),
          amount: 40
        }
      });
    } else {
      yield put({
        type: "MANAGER_INCREMENT_BALANCE",
        payload: {
          manager: data.get("manager"),
          amount: data.get("amount")
        }
      });

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
