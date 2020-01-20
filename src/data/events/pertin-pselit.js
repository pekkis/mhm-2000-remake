import { select, call } from "redux-saga/effects";
import { Map, List } from "immutable";
import { incrementMorale } from "../../sagas/team";
import { addEvent } from "../../sagas/event";
import { managersTeamId, managersDifficulty } from "../../services/selectors";
import r from "../../services/random";

const eventId = "pertinPselit";

/*
sat59:
PRINT "Pertin Pselit kutsuu sinut pselailemaan! Pseli menee kuitenkin todella"
IF vai < 5 THEN PRINT "pserseelleen, mutta Lastenklinikka saa jokatapauksessa rahaa."
IF vai < 5 THEN PRINT "Moraali nousee hyv„ntekev„isyystempauksen johdosta.": mo = mo + 4
IF vai = 5 THEN PRINT "pserseelleen, ja kun Pertti viel„ pimitt„„ kaikki rahat ja lehdist” repos-"
IF vai = 5 THEN PRINT "telee jutulla, moraali laskee!": mo = mo - 5
RETURN
*/

const pselit = Map({
  good: Map({
    text: `Pseli menee todella pserseelleen, mutta lastensairaala saa joka tapauksessa rahaa. Moraali nousee hyväntekeväisyystempauksen johdosta.`,
    moraleChange: 4
  }),
  bad: Map({
    text: `Pseli menee todella pserseelleen, ja kun Pertti vielä pimittää kaikki rahat ja lehdistökin repostelee jutulla, moraali laskee.`,
    moraleChange: -4
  })
});

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const difficulty = yield select(managersDifficulty(manager));

    const pseli = difficulty < 4 ? "good" : "bad";

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        pseli,
        resolved: true
      })
    );
  },

  render: data => {
    let t = List.of(`__Pertin Pselit__ kutsuu sinut pselailemaan!`);

    const pseliText = pselit.getIn([data.get("pseli"), "text"]);
    t = t.push(pseliText);
    return t;
  },

  process: function*(data) {
    const team = yield select(managersTeamId(data.get("manager")));

    yield call(
      incrementMorale,
      team,
      pselit.getIn([data.get("pseli"), "moraleChange"])
    );
  }
};

export default event;
