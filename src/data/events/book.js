import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementMorale } from "../../sagas/team";
import { managersTeamId, managerById, totalGamesPlayed } from "../../services/selectors";
import { cinteger } from "../../services/random";

/*
sat88:
IF psmo < 400 THEN RETURN
PRINT "Kuuluisa kirjailija Seppo Kuningas hahmottelee uutta teosta"
teos = CINT(3 * RND) + 1
IF teos = 1 THEN teos$ = nimi$ + ":Legenda jo el„ess„„n!"
IF teos = 2 THEN teos$ = "Mestarimanagerin tarina"
IF teos = 3 THEN teos$ = "Managerikukkulan Kuningas"
IF teos = 4 THEN teos$ = "Kapina Hallilla"
PRINT "nimelt„„n '"; teos$; "' joka kertoo Sinun el„m„st„si!"
RETURN
*/

const bookNames = List.of(
  data => `${data.get("managerName")}: legenda jo eläessään`,
  data => `Mestarimanagerin tarina`,
  data => `Managerikukkulan kuningas`,
  data => `Kapina hallilla`
);

const eventId = "book";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const phlGamesPlayed = yield select(totalGamesPlayed(manager, "phl", 0));
    console.log("SEPPO KUNINGAS", phlGamesPlayed);
    if (phlGamesPlayed < 400) {
      return;
    }

    const m = yield select(managerById(manager));

    const book = cinteger(0, 3);

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        managerName: m.get("name"),
        book,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Kuuluisa kirjailija __Seppo Kuningas__ hahmottelee uutta teosta. "${bookNames.get(
        data.get("book")
      )(data)}" on kirjan nimi, ja se kertoo sinun elämästäsi!`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    yield call(incrementMorale, team, 2);
  }
};

export default event;
