import { select, call } from "redux-saga/effects";
import { Map, List } from "immutable";
import { incrementMorale } from "../../sagas/team";
import { addEvent } from "../../sagas/event";
import { managersMainCompetition, managersTeamId } from "../../services/selectors";
import r from "../../services/random";

const eventId = "fortuneTeller";

const prophecies = Map({
  phl: Map({
    good: Map({
      prophecy: `Ennustajaeukko lupaa __kolmea__ peräkkäistä mestaruutta!`,
      moraleChange: 5
    }),
    bad: Map({
      prophecy: `Ennustajaeukko lupaa pudotusta __divisioonaan__.`,
      moraleChange: -5
    })
  }),
  division: Map({
    good: Map({
      prophecy: `Ennustajaeukko lupaa __liiganousua__.`,
      moraleChange: 5
    }),
    bad: Map({
      prophecy: `Ennustajaeukko lupaa __vaikeita aikoja__.`,
      moraleChange: -5
    })
  })
});

/*
ddd = CINT(100 * RND)
IF sarja = 1 AND ddd < 50 THEN PRINT "Ennustajaeukko lupaa KOLMEA per„kk„ist„ mestaruutta!": mo = mo + 5
IF sarja = 2 AND ddd < 50 THEN PRINT "Ennustajaeukko lupaa LIIGANOUSUA!": mo = mo + 5
IF sarja = 1 AND ddd > 50 THEN PRINT "Ennustajaeukko lupaa pudotusta DIVISIOONAAN!": mo = mo + 5
IF sarja = 2 AND ddd > 50 THEN PRINT "Ennustajaeukko lupaa VAIKEITA AIKOJA!": mo = mo + 5
RETURN;
*/

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const competition = yield select(managersMainCompetition(manager));
    const omen = r.pick(["good", "bad"]);

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        competition,
        omen,
        resolved: true
      })
    );
  },

  render: data => {
    let text = List.of(
      prophecies.getIn([data.get("competition"), data.get("omen"), "prophecy"])
    );
    return text;
  },

  process: function*(data) {
    const team = yield select(managersTeamId(data.get("manager")));

    yield call(
      incrementMorale,
      team,
      prophecies.getIn([
        data.get("competition"),
        data.get("omen"),
        "moraleChange"
      ])
    );
  }
};

export default event;
