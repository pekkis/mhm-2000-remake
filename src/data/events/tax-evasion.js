import { Map, List } from "immutable";
import { put, select, call } from "redux-saga/effects";
import {
  managersTeamId,
  teamCompetesIn,
  randomTeamFrom,
  randomManager,
  teamsStrength,
  managerHasService,
  managersDifficulty,
  managersArena
} from "../selectors";
import { currency as c, amount as a } from "../../services/format";
import r, { cinteger } from "../../services/random";
import { decrementMorale } from "../../sagas/team";

const eventId = "taxEvasion";

const texts = data => {
  let t = List.of(
    `Olet saanut tietää, että __${data.get(
      "teamName"
    )}__:n manageri __${data.get(
      "otherManagerName"
    )}__ on kiertänyt veroja. Julkistatko tiedon, vaikka samalla on riski että omat vilppisi tulevat julkisuuteen? Tieto ajaisi todennäköisesti joukkueen konkurssiin."
    `
  );

  if (!data.get("resolved")) {
    return t;
  }

  if (!data.get("agree")) {
    return t.push(
      `OK. ${data.get(
        "otherManagerName"
      )} saa siis jatkaa rikollista toimintaansa.`
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
        "otherManagerName"
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
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const otherManager = yield select(randomManager());
    const team = yield select(randomTeamFrom(["phl"], false));

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          manager,
          amount: 50000,
          resolved: false,
          otherManager: otherManager.get("id"),
          otherManagerName: otherManager.get("name"),
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

    const manager = data.get("manager");

    data = data
      .set("fine", 1000000)
      .set("fine2", 300000)
      .set("caught", r.bool())
      .set(
        "hasInsurance",
        yield select(managerHasService(manager, "insurance"))
      );

    const difficulty = yield select(managersDifficulty(manager));

    if (difficulty < 3) {
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
    const manager = data.get("manager");
    const managersTeam = yield select(managersTeamId(manager));

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
          team: managersTeam,
          amount: data.get("getPlayer")
        }
      });
    }

    if (!data.get("caught")) {
      return;
    }

    yield call(decrementMorale, managersTeam, 6);

    yield put({
      type: "MANAGER_DECREMENT_BALANCE",
      payload: {
        manager,
        amount: data.get("fine")
      }
    });

    if (data.get("hasInsurance")) {
      yield put({
        type: "MANAGER_DECREMENT_BALANCE",
        payload: {
          manager,
          amount: data.get("fine2")
        }
      });

      const arena = yield select(managersArena(manager));
      yield put({
        type: "MANAGER_INCREMENT_INSURANCE_PAY",
        payload: {
          manager,
          amount: 200 * arena.get("level")
        }
      });
    }
  }
};

export default event;
