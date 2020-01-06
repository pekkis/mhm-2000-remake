import { List, Map } from "immutable";
import { competition, allTeams, flag } from "./selectors";
import { select } from "redux-saga/effects";
import { compose } from "ramda";

const countries = Map(
  List.of(
    Map({
      iso: "FI",
      name: "Pekkalandia",
      strength: function() {
        return undefined;
      }
    }),
    Map({
      iso: "CA",
      name: "Kanada",
      strength: () => 202
    }),
    Map({
      iso: "US",
      name: "Yhdysvallat",
      strength: () => 194
    }),
    Map({
      iso: "SE",
      name: "Ruotsi",
      strength: () => 206
    }),
    Map({
      iso: "FR",
      name: "Ranska",
      strength: () => 153
    }),
    Map({
      iso: "CZ",
      name: "Tshekki",
      strength: () => 208
    }),
    Map({
      iso: "SK",
      name: "Slovakia",
      strength: () => 189
    }),
    Map({
      iso: "RU",
      name: "Venäjä",
      strength: () => 211
    }),
    Map({
      iso: "DE",
      name: "Saksa",
      strength: () => 170
    }),
    Map({
      iso: "LV",
      name: "Latvia",
      strength: () => 163
    }),
    Map({
      iso: "IT",
      name: "Italia",
      strength: () => 168
    }),
    Map({
      iso: "CH",
      name: "Sveitsi",
      strength: () => 159
    })
  ).map(c => [c.get("iso"), c])
);

export default countries;
