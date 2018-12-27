import { Map, List } from "immutable";
import { put, select, all } from "redux-saga/effects";
import r from "../../services/random";
import {
  playerCompetesIn,
  flag,
  randomTeamFrom,
  playersTeam,
  playersDifficulty
} from "../selectors";

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
  type: "player",

  create: function*(data) {
    const { eventId, player } = data;

    /*    const competesInPHL = yield select(playerCompetesIn(player, "phl"));
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
          player,
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
    const player = data.get("player");
    const difficulty = yield select(playersDifficulty(player));

    console.log("difficulty", difficulty);

    let team;
    if (value === "n") {
      team = yield select(randomTeamFrom(["phl", "division"], false));
    } else if (value === "y" && difficulty >= 4) {
      team = yield select(randomTeamFrom(["phl", "division"], false));
    } else {
      team = yield select(playersTeam(player));
    }

    const resolved = data.merge({
      changeOfMind: value === "y" && difficulty >= 4,
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

  generator: function*(data) {
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
        type: "PLAYER_INCREMENT_BALANCE",
        payload: {
          player: data.get("player"),
          amount: data.get("amount")
        }
      });

      yield put({
        type: "PLAYER_RENAME_ARENA",
        payload: {
          player: data.get("player"),
          name: "Mauto Center"
        }
      });
    }
  }
};

export default event;
