import { Map, List } from "immutable";
import { put, select } from "redux-saga/effects";
import {
  playersTeamId,
  teamCompetesIn,
  randomTeamFrom,
  randomManager,
  teamsStrength,
  playerHasService,
  playersDifficulty,
  playersArena
} from "../selectors";
import { currency as c, amount as a } from "../../services/format";
import r, { cinteger } from "../../services/random";

const eventId = "taxEvasion";

const texts = data => {
  let t = List.of(
    `Olet saanut tietää, että __${data.get(
      "teamName"
    )}__:n manageri __${data.get(
      "managerName"
    )}__ on kiertänyt veroja. Julkistatko tiedon, vaikka samalla on riski että omat vilppisi tulevat julkisuuteen? Tieto ajaisi todennäköisesti joukkueen konkurssiin."
    `
  );

  if (!data.get("resolved")) {
    return t;
  }

  if (!data.get("agree")) {
    return t.push(
      `OK. ${data.get("managerName")} saa siis jatkaa rikollista toimintaansa.`
    );
  }

  if (data.get("caught")) {
    t = t.push(
      `Oi voi! Omat veronkiertosi paljastuvat, ja saat ${a(
        data.get("fine")
      )} pekan sakot!`
    );
    if (data.get("hasInsurance")) {
      t = t.push(
        `Vakuutuspetoksesikin tulevat ilmi, ja Etel„l„ sakottaa sinua ${a(
          data.get("fine2")
        )} pekalla!!!`
      );
    }
  } else {
    t = t.push(
      `Haa haa. ${data.get(
        "managerName"
      )} joutuu kohtaamaan talousrikosmiliisin ypöyksin!`
    );
  }

  t = t.push(
    `${data.get(
      "teamName"
    )} saa kauheat mätkyt, ja huippupelaajat evakuoituvat uppoavasta laivasta!`
  );

  if (data.get("getPlayer")) {
    t = t.push(
      `Yksi heistä haluaa pelipaikan, jonka ystävällisesti annat (vain palkka maksettava)`
    );
  }

  return t;
};

const event = {
  type: "player",

  create: function*(data) {
    const { player } = data;

    const manager = yield select(randomManager());
    const team = yield select(randomTeamFrom(["phl"], false));

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          player,
          amount: 50000,
          resolved: false,
          manager: manager.get("id"),
          managerName: manager.get("name"),
          team: team.get("id"),
          teamName: team.get("name")
        })
      }
    });

    return;
  },

  options: data => {
    return Map({
      agree: `Paljastan vilpin.`,
      disagree: `En paljasta vilppiä.`
    });
  },

  resolve: function*(data, value) {
    data = data.set("resolved", true).set("agree", value === "agree");

    const player = data.get("player");

    data = data
      .set("fine", 1000000)
      .set("fine2", 300000)
      .set("caught", r.bool())
      .set("hasInsurance", yield select(playerHasService(player, "insurance")));

    const difficulty = yield select(playersDifficulty(player));

    if (difficulty < 4) {
      data = data.set("getPlayer", 5);
    }

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
    const player = data.get("player");
    const playersTeam = yield select(playersTeamId(player));

    if (!data.get("agree")) {
      return;
    }

    yield put({
      type: "TEAM_DECREMENT_STRENGTH",
      payload: {
        team: data.get("team"),
        amount: 65
      }
    });

    if (data.get("getPlayer")) {
      yield put({
        type: "TEAM_INCREMENT_STRENGTH",
        payload: {
          team: playersTeam,
          amount: data.get("getPlayer")
        }
      });
    }

    if (!data.get("caught")) {
      return;
    }

    yield put({
      type: "TEAM_DECREMENT_MORALE",
      payload: {
        team: playersTeam,
        amount: 6
      }
    });

    yield put({
      type: "PLAYER_DECREMENT_BALANCE",
      payload: {
        player,
        amount: data.get("fine")
      }
    });

    if (data.get("hasInsurance")) {
      yield put({
        type: "PLAYER_DECREMENT_BALANCE",
        payload: {
          player,
          amount: data.get("fine2")
        }
      });

      const arena = yield select(playersArena(player));
      yield put({
        type: "PLAYER_INCREMENT_INSURANCE_PAY",
        payload: {
          player,
          amount: 200 * arena.get("level")
        }
      });
    }
  }
};

export default event;
