import { List, Map } from "immutable";
import { competition, allTeams, flag } from "./selectors";
import { select } from "redux-saga/effects";

const countries = List.of(
  Map({
    name: "Pekkalandia",
    strength: function*() {
      const phl = yield select(competition("phl"));
      const teams = yield select(allTeams);

      const avg = phl
        .get("teams")
        .map(t => teams.getIn([t, "strength"]))
        .reduce((r, s) => r + s, 0);

      return Math.round(avg / phl.get("teams").count());
    }
  }),
  Map({
    name: "Kanada",
    strength: function*() {
      const goCanada = yield select(flag("canada"));
      return goCanada ? 202 : 232;
    }
  }),
  Map({
    name: "Yhdysvallat",
    strength: function*() {
      const goUSA = yield select(flag("usa"));
      return goUSA ? 194 : 229;
    }
  }),
  Map({
    name: "Ruotsi",
    strength: () => 206
  }),
  Map({
    name: "Ranska",
    strength: () => 153
  }),
  Map({
    name: "Tshekki",
    strength: () => 208
  }),
  Map({
    name: "Slovakia",
    strength: () => 189
  }),
  Map({
    name: "Venäjä",
    strength: () => 211
  }),
  Map({
    name: "Saksa",
    strength: () => 170
  }),
  Map({
    name: "Latvia",
    strength: () => 163
  }),
  Map({
    name: "Italia",
    strength: () => 168
  }),
  Map({
    name: "Sveitsi",
    strength: () => 159
  })
);

export default countries;
