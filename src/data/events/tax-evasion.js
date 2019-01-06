import { Map, List } from "immutable";
import { put, select, call } from "redux-saga/effects";
import {
  managersTeamId,
  randomTeamFrom,
  randomManager,
  managerHasService,
  managersDifficulty,
  managersArena
} from "../selectors";
import { currency as c, amount as a } from "../../services/format";
import r from "../../services/random";
import { decrementMorale } from "../../sagas/team";
import { addEvent } from "../../sagas/event";
import { decrementBalance, incrementInsuranceExtra } from "../../sagas/manager";
import { decrementStrength, incrementStrength } from "../../sagas/team";

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

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        amount: 50000,
        resolved: false,
        otherManager: otherManager.get("id"),
        otherManagerName: otherManager.get("name"),
        team: team.get("id"),
        teamName: team.get("name")
      })
    );
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

    yield call(decrementStrength, data.get("team"), 65);

    if (data.get("getPlayer")) {
      yield incrementStrength(managersTeam, data.get("getPlayer"));
    }

    if (!data.get("caught")) {
      return;
    }

    yield call(decrementMorale, managersTeam, 6);
    yield call(decrementBalance, manager, data.get("fine"));

    if (data.get("hasInsurance")) {
      yield call(decrementBalance, manager, data.get("fine2"));

      const arena = yield select(managersArena(manager));
      yield call(
        incrementInsuranceExtra,
        manager,
        200 * (arena.get("level") + 1)
      );
    }
  }
};

export default event;
