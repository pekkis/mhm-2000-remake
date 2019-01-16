import { select, call } from "redux-saga/effects";
import { Map, List } from "immutable";
import { incrementMorale } from "../../sagas/team";
import { addEvent } from "../../sagas/event";
import { managersMainCompetition, managersTeamId } from "../selectors";
import r from "../../services/random";

const eventId = "ehlAward";

/*
IF edus1 = u THEN x = eds1
IF edus2 = u THEN x = eds2
IF edus3 = u THEN x = eds3
IF seh(x) = 1 THEN PRINT "Hurraa!! Voitimme!": raha = raha + 2000000: lemesm = leh(x)
IF seh(x) = 2 THEN PRINT "Hiphei!! Sijoituimme toiseksi!": raha = raha + 1600000
IF seh(x) = 3 THEN PRINT "Sijoituimme kolmanneksi!": raha = raha + 1400000
IF seh(x) = 4 THEN PRINT "Sijoituimme nelj„nneksi...": raha = raha + 1200000
IF seh(x) = 5 THEN PRINT "Sijoituimme viidenneksi...voi tukka!": raha = raha + 1000000
IF seh(x) = 6 THEN PRINT "™RRR! J„imme jumboiksi!": raha = raha + 800000
*/

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
