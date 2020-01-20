import { Map, List } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { incrementReadiness } from "../../sagas/team";
import { managersTeamId } from "../../services/selectors";

/*
sat91:
PRINT "Pelaajasi v„syv„t kovaa vauhtia! Heid„n kuntopohjansa ei yksinkertaisesti"
PRINT "ole kest„nyt kiivasta ottelurytmi„."
tre = tre - 3: RETURN

*/

const eventId = "strategyFailure";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Pelaajasi väsyvät kovaa vauhtia! Heidän kuntopohjansa ei yksinkertaisesti ole kestänyt kiivasta ottelurytmiä.`
    );

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));
    yield call(incrementReadiness, team, -3);
  }
};

export default event;
