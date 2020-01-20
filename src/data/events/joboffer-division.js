import { Map, List } from "immutable";
import { select, call, all } from "redux-saga/effects";
import { randomTeamFrom, randomManager, managersTeamId } from "../../services/selectors";
import { addEvent, resolvedEvent } from "../../sagas/event";
import {
  hireManager,
  setInsuranceExtra,
  setBalance,
  setArenaLevel,
  setService
} from "../../sagas/manager";
import { setMorale, setReadiness, setStrategy } from "../../sagas/team";
import { cinteger } from "../../services/random";

/*
PRINT ld(x); " tarjoaa sinulle ty”paikkaa!! Joukkue yritt„„ tosissaan nousua,"
PRINT "ja sill„ onkin uusi, todella mainio sponsorisopimus!"
PRINT "Sponsori kuitenkin vaatii "; nimi$; ":n managerikseen."
PRINT "otatko tarjouksen vastaan? (k/e)"
INPUT s$
IF s$ = "e" THEN PRINT "OK, ei sitten. Ty”h”n palkataan "; lm(y): RETURN
IF s$ = "k" THEN hallis: sarja = 2: u = x: raha = 2000000: hjalli = 2 + h: pt = 0: pv = 0: mo = 20: tre = 0: jursi = 0: allgo = 0: rally = 0: molce = 0: cheer = 0: veikko = 0: mikki = 0: palo = 0: euro = 0: RETURN*/

const eventId = "jobofferDivision";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const oldTeam = yield select(managersTeamId(manager));

    const offerer = yield select(randomTeamFrom(["division"], false));
    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        oldTeam,
        offerer: offerer.get("id"),
        offererName: offerer.get("name")
      })
    );
  },

  options: data => {
    return Map({
      agree: `Kyllä otan!`,
      disagree: "En ota. Minun on hyvä täällä."
    });
  },

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true,
      agree: value === "agree"
    });

    if (value === "agree") {
    } else {
      const otherManager = yield select(randomManager());
      data = data.merge({
        otherManager: otherManager.get("name")
      });
    }

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `__${data.get(
        "offererName"
      )}__ tarjoaa sinulle työpaikkaa!! Joukkue yrittää tosissaan nousua liigaan, ja sillä onkin uusi, todella mainio sponsorisopimus! Sponsori kuitenkin vaatii nimenomaisesti sinut manageriksi. Otatko tarjouksen vastaan?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (data.get("agree")) {
      t = t.push(
        `Katselet ympärillesi viimeistä kertaa. Tämä paikka on _niiiiin_ nähty.`
      );
    } else {
      t = t.push(
        `OK, ei sitten. Tehtävään palkataan __${data.get("otherManager")}__.`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const offerer = data.get("offerer");
    const oldTeam = data.get("oldTeam");

    if (data.get("agree")) {
      yield all([
        call(hireManager, manager, offerer),
        call(setBalance, manager, 2000000),
        ...["coach", "cheer", "insurance", "microphone"].map(s =>
          call(setService, manager, s, false)
        ),
        call(setArenaLevel, manager, 2 + cinteger(0, 2)),
        call(setInsuranceExtra, manager, 0),

        call(setMorale, oldTeam, 0),
        call(setMorale, offerer, 100),
        call(setStrategy, oldTeam, 2),
        call(setReadiness, oldTeam, 0)
      ]);
    }
  }
};

export default event;
